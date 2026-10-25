
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("network_monitor.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS monitoring_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_name TEXT NOT NULL,
                host TEXT NOT NULL,
                status TEXT NOT NULL,
                response_ms REAL,
                checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_check(device_name, host, status, response_ms):
    with get_connection() as connection:
        connection.execute("""
            INSERT INTO monitoring_history
                (device_name, host, status, response_ms)
            VALUES (?, ?, ?, ?)
        """, (device_name, host, status, response_ms))


def get_history(limit=100):
    with get_connection() as connection:
        rows = connection.execute("""
            SELECT id, device_name, host, status, response_ms, checked_at
            FROM monitoring_history
            ORDER BY id DESC
            LIMIT ?
        """, (limit,)).fetchall()

    return [dict(row) for row in rows]
