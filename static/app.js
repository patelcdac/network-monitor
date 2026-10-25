
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
