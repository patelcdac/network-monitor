
const deviceBody = document.getElementById("devices");
const message = document.getElementById("message");

async function refreshDevices() {
    message.textContent = "Checking network devices...";

    try {
        const response = await fetch("/api/devices");

        if (!response.ok) {
            throw new Error("Server returned HTTP " + response.status);
        }

        const devices = await response.json();

        document.getElementById("total").textContent = devices.length;
        document.getElementById("online").textContent =
            devices.filter(device => device.status === "UP").length;
        document.getElementById("offline").textContent =
            devices.filter(device => device.status === "DOWN").length;

        deviceBody.replaceChildren();

        for (const device of devices) {
            const row = document.createElement("tr");

            const values = [
                device.name,
                device.host,
                device.status,
                device.response_ms === null
                    ? "—"
                    : `${device.response_ms} ms`
            ];

            values.forEach((value, index) => {
                const cell = document.createElement("td");
                cell.textContent = value;

                if (index === 2) {
                    cell.className =
                        "status " + (value === "UP" ? "up" : "down");
                }

                row.appendChild(cell);
            });

            deviceBody.appendChild(row);
        }

        document.getElementById("updated").textContent =
            new Date().toLocaleTimeString();

        message.textContent = "Monitoring checks completed.";
    } catch (error) {
        message.textContent = "Unable to load devices: " + error.message;
    }
}

document.getElementById("refresh").addEventListener("click", refreshDevices);

refreshDevices();
setInterval(refreshDevices, 15000);

async function refreshHistory() {
    const historyBody = document.getElementById("history-rows");

    try {
        const response = await fetch("/api/history");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const records = await response.json();
        historyBody.replaceChildren();

        if (records.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.textContent = "No monitoring history yet.";
            row.appendChild(cell);
            historyBody.appendChild(row);
            return;
        }

        records.forEach(record => {
            const row = document.createElement("tr");

            const values = [
                record.checked_at,
                record.device_name,
                record.host,
                record.status,
                record.response_ms == null
                    ? "—"
                    : `${record.response_ms} ms`
            ];

            values.forEach((value, index) => {
                const cell = document.createElement("td");
                cell.textContent = value;

                if (index === 3) {
                    cell.className =
                        "status " + (value === "UP" ? "up" : "down");
                }

                row.appendChild(cell);
            });

            historyBody.appendChild(row);
        });
    } catch (error) {
        console.error("History loading failed:", error);
        historyBody.textContent = "Unable to load monitoring history.";
    }
}

document
    .getElementById("refresh-history")
    .addEventListener("click", refreshHistory);

refreshHistory();

