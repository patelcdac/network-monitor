
import app as app_module


def test_homepage_returns_success():
    client = app_module.app.test_client()

    response = client.get("/")

    assert response.status_code == 200
    assert b"Network" in response.data


def test_health_endpoint():
    client = app_module.app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_history_endpoint_returns_json():
    client = app_module.app.test_client()

    response = client.get("/api/history")

    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
