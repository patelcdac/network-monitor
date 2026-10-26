
# Network Monitoring Dashboard

A containerized network monitoring dashboard built with Python, Flask, SQLite, Docker, and GitHub Actions.

## Features

- Monitor network targets using ICMP ping.
- Display device status (UP/DOWN) and response time.
- Refresh device status automatically.
- Store monitoring history in SQLite.
- Run the application in a Docker container.
- Persist database records using a Docker volume.
- Run automated tests with pytest.
- Build and publish Docker images to GitHub Container Registry (GHCR) using GitHub Actions.

## Technology Stack

- Python 3.12
- Flask
- SQLite
- HTML, CSS, JavaScript
- Docker and Docker volumes
- Git and GitHub
- GitHub Actions
- pytest
- GitHub Container Registry

## Run with Docker

Pull the published image:

```bash
docker pull ghcr.io/patelcdac/network-monitor:latest
```

Run the container:

```bash
docker run -d \
  --name network-monitor \
  -p 5000:5000 \
  -v network-monitor-data:/app/data \
  ghcr.io/patelcdac/network-monitor:latest
```

Open the dashboard:

http://localhost:5000

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Dashboard interface |
| `/api/health` | Application health check |
| `/api/devices` | Current device status and response time |
| `/api/history` | Recent monitoring history |

## Run Tests Locally

Install development dependencies:

```bash
python -m pip install -r requirements-dev.txt
```

Run the test suite:

```bash
python -m pytest -v
```

## CI/CD Pipeline

GitHub Actions automatically:

1. Checks out the repository.
2. Sets up Python.
3. Installs dependencies.
4. Runs automated tests.
5. Builds the Docker image.
6. Publishes the image to GitHub Container Registry on pushes to `main`.

## Docker Image

Published image:

`ghcr.io/patelcdac/network-monitor:latest`

## Repository

https://github.com/patelcdac/network-monitor

## Future Improvements

- Add CPU, memory, and disk monitoring.
- Add charts for response-time history.
- Improve automated test coverage.
- Add deployment to a cloud environment.
- Add monitoring alerts for unavailable devices.

## Author

Narayan Patel
