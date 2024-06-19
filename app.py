from flask import Flask, render_template
from flask_socketio import SocketIO
import serial
import time
import re
import threading
import sqlite3
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

arduino_port = 'COM3'
baud_rate = 9600
ser = serial.Serial(arduino_port, baud_rate)
time.sleep(2)

def is_valid_data(data):
    pattern = r'^Humidity:\s*\d+\s*%\s*Temperature:\s*-?\d+\.\d+\s*\*C$'
    return re.match(pattern, data)

def parse_data(data):
    humidity = re.search(r'Humidity:\s*(\d+)\s*%', data).group(1)
    temperature = re.search(r'Temperature:\s*(-?\d+\.\d+)\s*\*C', data).group(1)
    return humidity, temperature

data_collection_active = False

def save_to_db(humidity, temperature):
    conn = sqlite3.connect('arduino_data.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO sensor_data (humidity, temperature) VALUES (?, ?)
    ''', (humidity, temperature))
    conn.commit()
    conn.close()

def collect_data():
    while data_collection_active:
        time.sleep(0.1)
        if ser.in_waiting > 0:
            data = ser.readline().decode('utf-8').rstrip()
            if is_valid_data(data):
                humidity, temperature = parse_data(data)
                save_to_db(humidity, temperature)
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                socketio.emit('data_update', {'timestamp': timestamp, 'humidity': humidity, 'temperature': temperature})
            else:
                print('Invalid data:', data)
                continue

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('start_data')
def start_data():
    global data_collection_active
    data_collection_active = True
    threading.Thread(target=collect_data).start()

@socketio.on('stop_data')
def stop_data():
    global data_collection_active
    data_collection_active = False

if __name__ == '__main__':
    socketio.run(app)