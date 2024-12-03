from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


#test the sign up
def test_signup():

    response = client.post(
        "/signup/",
        json="email":"alanturin@example.com",
            "password": "self_replicate_automata"
            "first_name": "alan",
            "last_name": "turin",
            "phone_number": "0712345678",
            "is_verified": true
    )
    assert response.status_code == 200
    assert response.json()["message"] == "User registration success"

    