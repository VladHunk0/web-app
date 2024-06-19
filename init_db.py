import sqlite3

def init_db():
    conn = sqlite3.connect('arduino_data.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            humidity INTEGER,
            temperature REAL
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
