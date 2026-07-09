import os
import json
from flask import Flask, jsonify, request, send_from_directory, session, redirect, url_for, Response
from functools import wraps

app = Flask(__name__, static_folder='.')
app.secret_key = 'super-secret-key-contratos360'  # En producción debe ser una variable de entorno segura

# ----------------------------------------------------
# Base de Datos Simulada de Usuarios (Login)
# ----------------------------------------------------
USERS = {
    "admin": "admin123",
    "gerencia": "gerencia2026",
    "milton": "milton2026",
    "dfbeltran":dfbeltran2026"	
}

# ----------------------------------------------------
# Lógica para leer los contratos y droguerias
# ----------------------------------------------------
def load_data():
    try:
        data_path = os.path.join(app.root_path, 'data.js')
        if not os.path.exists(data_path):
            return [], []
        with open(data_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Split by the second variable declaration
        parts = content.split('window.DROGUERIAS_DATA =')
        
        contratos_str = parts[0].replace('window.CONTRATOS_DATA =', '').strip()
        if contratos_str.endswith(';'):
            contratos_str = contratos_str[:-1]
            
        drog_parts = parts[1].split('window.DANE_TO_REGIONAL =')
        droguerias_str = drog_parts[0].strip() if len(drog_parts) > 0 else "[]"
        if droguerias_str.endswith(';'):
            droguerias_str = droguerias_str[:-1]
            
        dane_to_regional_str = drog_parts[1].strip() if len(drog_parts) > 1 else "{}"
        if dane_to_regional_str.endswith(';'):
            dane_to_regional_str = dane_to_regional_str[:-1]
            
        try:
            json.loads(contratos_str)
        except Exception as e:
            print("Error parseando contratos:", e)
            contratos_str = "[]"
            
        try:
            json.loads(droguerias_str)
        except Exception as e:
            print("Error parseando droguerias:", e)
            droguerias_str = "[]"
            
        try:
            json.loads(dane_to_regional_str)
        except Exception as e:
            print("Error parseando dane_to_regional:", e)
            dane_to_regional_str = "{}"

        return contratos_str, droguerias_str, dane_to_regional_str
    except Exception as e:
        print("Error leyendo archivos:", e)
        return "[]", "[]", "{}"

# Cachear en memoria (strings)
CONTRATOS_CACHE_STR, DROGUERIAS_CACHE_STR, DANE_TO_REGIONAL_CACHE_STR = load_data()

# ----------------------------------------------------
# Decorador de Seguridad (Requiere Sesión)
# ----------------------------------------------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return jsonify({"error": "No autorizado. Inicie sesión."}), 401
        return f(*args, **kwargs)
    return decorated_function

# ----------------------------------------------------
# Endpoints de Autenticación
# ----------------------------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in USERS and USERS[username] == password:
        session['logged_in'] = True
        session['user'] = username
        return jsonify({"message": "Login exitoso", "user": username}), 200
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout exitoso"}), 200

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'logged_in' in session:
        return jsonify({"logged_in": True, "user": session['user']}), 200
    return jsonify({"logged_in": False}), 200

# ----------------------------------------------------
# Endpoints de Datos (Protegidos)
# ----------------------------------------------------
@app.route('/api/contratos', methods=['GET'])
@login_required
def get_contratos():
    json_str = f'{{"contratos": {CONTRATOS_CACHE_STR}, "droguerias": {DROGUERIAS_CACHE_STR}, "daneToRegional": {DANE_TO_REGIONAL_CACHE_STR}}}'
    return Response(json_str, mimetype='application/json')

@app.route('/api/droguerias', methods=['GET'])
@login_required
def get_droguerias():
    json_str = f'{{"droguerias": {DROGUERIAS_CACHE_STR}}}'
    return Response(json_str, mimetype='application/json')

@app.route('/api/debug', methods=['GET'])
def debug_data():
    try:
        data_path = os.path.join(app.root_path, 'data.js')
        with open(data_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        parts = content.split('window.DROGUERIAS_DATA =')
        c_str = parts[0].replace('window.CONTRATOS_DATA =', '').strip()
        if c_str.endswith(';'): c_str = c_str[:-1]
        
        err_msg = "OK"
        try:
            json.loads(c_str)
        except Exception as e:
            err_msg = str(e)
            
        return jsonify({
            "c_str_len": len(c_str),
            "c_str_start": c_str[:50],
            "c_str_end": c_str[-50:],
            "json_error": err_msg
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# ----------------------------------------------------
# Servir Archivos Estáticos (Front-End)
# ----------------------------------------------------
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'contratacion.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

if __name__ == '__main__':
    print("Iniciando el Back-End Seguro...")
    print("Iniciando Servidor Seguro Contratos360...")
    print("Accede en tu navegador a: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
