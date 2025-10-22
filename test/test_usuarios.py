import requests

BASE_URL = "http://localhost:5000/api/usuarios"

def test_listar_usuarios():
    response = requests.get(BASE_URL)
    assert response.status_code in [200, 401]

def test_crear_usuario():
    nuevo_usuario = {
        "nombre": "UsuarioPrueba",
        "email": "usuario@prueba.com",
        "password": "123456"
    }
    response = requests.post(BASE_URL + "/registro", json=nuevo_usuario)
    assert response.status_code in [201, 400]
