
from flask import Flask, jsonify, render_template
import platform
import subprocess
import time

from database import initialize_database, save_check, get_history

app = Flask(__name__)

# Initialize the SQLite database when the application starts.
initialize_database()

# Devices to monitor.
TARGETS = [
    {"name": "Home Router", "host": "192.168.0.1"},
    {"name": "Google DNS", "host": "8.8.8.8"},
    {"name": "Cloudflare DNS", "host": "1.1.1.1"},
    {"name": "My Laptop", "host": "192.168.0.107"},
    {"name": "Localhost", "host": "127.0.0.1"},
]


def check_host(host):
    """Check host reachability and measure approximate check duration."""

    if platform.system().lower() == "windows":
        command = ["ping", "-n", "1", "-w", "1500", host]
    else:
        command = ["ping", "-c", "1", "-W", "2", host]

    start = time.perf_counter()

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=3
        )

        elapsed_ms = round(
            (time.perf_counter() - start) * 1000, 2
        )

        if result.returncode == 0:
            return {
                "status": "UP",
                "response_ms": elapsed_ms
            }

        return {
            "status": "DOWN",
            "response_ms": None
        }

    except (subprocess.TimeoutExpired, FileNotFoundError):
        return {
            "status": "DOWN",
            "response_ms": None
        }


@app.route("/")
def dashboard():
    return render_template("index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/devices")
def devices():
    results = []

    for target in TARGETS:
        result = check_host(target["host"])

        device = {
            **target,
            **result
        }

        # Save every device check to SQLite.
        save_check(
            device["name"],
            device["host"],
            device["status"],
            device["response_ms"]
        )

        results.append(device)

    return jsonify(results)


@app.route("/api/history")
def history():
    """Return the most recent 100 monitoring records."""
    return jsonify(get_history(limit=100))


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
