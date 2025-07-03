from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os # Import os for secret key

app = Flask(__name__)
app.secret_key = os.urandom(24) # Set a strong secret key for sessions

# Dummy user database (replace with a real database in production)
users = {
    "test@example.com": {"password": "password123", "firstName": "Test", "lastName": "User", "phone": "9876543210"}
}

@app.route('/')
def index():
    # If logged in, redirect to home.html, otherwise stay on index.html
    if 'username' in session:
        return redirect(url_for('home'))
    return render_template('index.html')

@app.route('/home')
def home():
    if 'username' not in session:
        # Redirect to login page if not authenticated
        return redirect(url_for('login', next=request.url))
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() # Expect JSON payload
        email = data.get('email')
        password = data.get('password')

        user = users.get(email)
        if user and user['password'] == password: # Basic password check
            session['username'] = email # Store username in session
            session['firstName'] = user['firstName']
            session['lastName'] = user['lastName']
            session['email'] = user['email']
            session['phone'] = user['phone'] # Store phone in session
            return jsonify({'message': 'Login successful', 'loggedIn': True}), 200
        else:
            return jsonify({'message': 'Invalid credentials', 'loggedIn': False}), 401
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json() # Expect JSON payload
        email = data.get('email')
        password = data.get('password')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        phone = data.get('phone', '')

        if email in users:
            return jsonify({'message': 'User already exists', 'loggedIn': False}), 409

        users[email] = {"password": password, "firstName": firstName, "lastName": lastName, "phone": phone}
        session['username'] = email # Log in after signup
        session['firstName'] = firstName
        session['lastName'] = lastName
        session['email'] = email
        session['phone'] = phone
        return jsonify({'message': 'Signup successful', 'loggedIn': True}), 201
    return render_template('register.html') # Assuming register.html is for signup

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('firstName', None)
    session.pop('lastName', None)
    session.pop('email', None)
    session.pop('phone', None)
    return jsonify({'message': 'Logout successful', 'loggedIn': False}), 200

@app.route('/check-auth', methods=['GET'])
def check_auth_status():
    return jsonify({'loggedIn': 'username' in session}), 200

@app.route('/user-data', methods=['GET'])
def get_user_data():
    if 'username' in session:
        return jsonify({
            'firstName': session.get('firstName'),
            'lastName': session.get('lastName'),
            'email': session.get('email'),
            'phone': session.get('phone')
        }), 200
    return jsonify({'message': 'Not logged in'}), 401

# Add more routes for /account, /checkout, etc., if needed, rendering their respective HTML files
@app.route('/account')
def account_page():
    if 'username' not in session:
        return redirect(url_for('login', next=request.url))
    return render_template('account.html')

@app.route('/checkout')
def checkout_page():
    if 'username' not in session:
        return redirect(url_for('login', next=request.url))
    return render_template('checkout.html')


if __name__ == '__main__':
    app.run(debug=True)