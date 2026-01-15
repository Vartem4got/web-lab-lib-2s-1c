
let hotels = [
    { id: 1, title: "Grand Hotel", desc: "Luxury place in Lviv", rooms: 45, type: "Resort" },
    { id: 2, title: "Business Central", desc: "Near the office center", rooms: 12, type: "Business" }
];

let displayData = [...hotels];

function showPage(page) {
    document.getElementById('list-page').style.display = (page === 'list') ? 'flex' : 'none';
    document.getElementById('search-bar-ui').style.display = (page === 'list') ? 'flex' : 'none';
    document.getElementById('create-page').style.display = (page === 'create') ? 'block' : 'none';
    document.getElementById('edit-page').style.display = (page === 'edit') ? 'block' : 'none';
    
    document.getElementById('nav-list').classList.toggle('active', page === 'list');
    document.getElementById('nav-create').classList.toggle('active', page === 'create');
}

function validateData(title, rooms, desc) {
    if (title.trim().length < 3) {
        alert("Error: name must be 3 characters minimum!");
        return false;
    }
    if (isNaN(rooms) || rooms <= 0) {
        alert("Error: rooms must be a positive number!");
        return false;
    }
    return true;
}

function renderHotels(data) {
    const grid = document.getElementById('hotelGrid');
    grid.innerHTML = '';
    data.forEach(h => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
            <div class="hotel-info">
                <h3>${h.title}</h3>
                <p>${h.desc}</p>
                <small><strong>Rooms:</strong> ${h.rooms} | <strong>Type:</strong> ${h.type}</small>
            </div>
            <div class="hotel-actions">
                <button class="btn-edit" onclick="openEditPage(${h.id})">Edit</button>
                <button class="btn-remove" onclick="removeHotel(${h.id})">Remove</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function submitHotel() {
    const title = document.getElementById('hotelTitle').value;
    const desc = document.getElementById('hotelDesc').value;
    const rooms = parseInt(document.getElementById('hotelRooms').value);
    const type = document.getElementById('hotelType').value;

    if (!validateData(title, rooms, desc)) return;

    const newHotel = { id: Date.now(), title, desc, rooms, type };
    hotels.push(newHotel);
    
    alert("Success: Hotel added to list!");
    clearSearch();
    showPage('list');

    document.getElementById('hotelTitle').value = '';
    document.getElementById('hotelDesc').value = '';
}

function openEditPage(id) {
    const hotel = hotels.find(h => h.id === id);
    if (!hotel) return;

    document.getElementById('editHotelId').value = hotel.id;
    document.getElementById('editHotelTitle').value = hotel.title;
    document.getElementById('editHotelDesc').value = hotel.desc;
    document.getElementById('editHotelRooms').value = hotel.rooms;
    document.getElementById('editHotelType').value = hotel.type;

    showPage('edit');
}

function updateHotel() {
    const id = parseInt(document.getElementById('editHotelId').value);
    const title = document.getElementById('editHotelTitle').value;
    const desc = document.getElementById('editHotelDesc').value;
    const rooms = parseInt(document.getElementById('editHotelRooms').value);
    const type = document.getElementById('editHotelType').value;

    if (!validateData(title, rooms, desc)) return;

    const index = hotels.findIndex(h => h.id === id);
    if (index !== -1) {
        hotels[index] = { id, title, desc, rooms, type };
        //alert("Changes saved!");
        clearSearch();
        showPage('list');
    }
}

function removeHotel(id) {
    if(confirm("Sure want to delete this?")) {
        hotels = hotels.filter(h => h.id !== id);
        clearSearch();
    }
}

function handleSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    displayData = hotels.filter(h => h.title.toLowerCase().includes(term));
    applySort();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    displayData = [...hotels];
    applySort();
}

function applySort() {
    if (document.getElementById('sortToggle').checked) {
        displayData.sort((a, b) => b.rooms - a.rooms);
    }
    renderHotels(displayData);
}

function toggleSort() {
    applySort();
}

function calculateTotal() {
    const total = displayData.reduce((sum, h) => sum + h.rooms, 0);
    document.getElementById('totalDisplay').innerText = total;
}

window.onload = () => renderHotels(displayData);


