from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'hotels_db.json')

def load_db():
    if not os.path.exists(DATA_FILE): return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except: return []

# Головний маршрут: Пошук та Сортування
@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    hotels = load_db()
    
    # ПОШУК на бекенді
    search_query = request.args.get('search', '').lower()
    if search_query:
        hotels = [h for h in hotels if search_query in h['title'].lower()]
    
    # СОРТУВАННЯ на бекенді
    sort_param = request.args.get('sort')
    if sort_param == 'desc':
        hotels = sorted(hotels, key=lambda x: x['rooms'], reverse=True)
        
    return jsonify(hotels)

# ПІДРАХУНОК на бекенді
@app.route('/api/hotels/count', methods=['GET'])
def count_rooms():
    hotels = load_db()
    search_query = request.args.get('search', '').lower()
    
    # Рахуємо тільки те, що відфільтровано пошуком
    if search_query:
        hotels = [h for h in hotels if search_query in h['title'].lower()]
        
    total_rooms = sum(h['rooms'] for h in hotels)
    return jsonify({"total": total_rooms})

@app.route('/api/hotels', methods=['POST'])
def add_hotel():
    hotels = load_db()
    data = request.json
    hotels.append(data)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(hotels, f, indent=4, ensure_ascii=False)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)