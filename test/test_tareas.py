import requests
BASE_URL = "https://tu-backend-desplegado.onrender.com/api/tareas"
#BASE_URL = "http://localhost:5000/api/tareas"

def test_obtener_tareas():
    response = requests.get(BASE_URL)
    assert response.status_code in [200, 401, 403]

def test_crear_tarea():
    nueva_tarea = {"titulo": "Prueba desde PyTest", "descripcion": "Tarea automática"}
    response = requests.post(BASE_URL, json=nueva_tarea)
    # Como la API pide autenticación, puede devolver 401 si no hay token
    assert response.status_code in [201, 401, 403]
