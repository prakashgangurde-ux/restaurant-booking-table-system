import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from collections import Counter
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/', methods=['GET', 'POST'])
def dashboard():
    if request.method == 'POST':
        booking_id = request.form.get('booking_id')
        if booking_id:
            db.collection('bookings').document(booking_id).update({
                'paymentStatus': 'paid'
            })
        return redirect(url_for('dashboard'))

    bookings_ref = db.collection('bookings').order_by('date', direction=firestore.Query.DESCENDING).stream()
    
    bookings_list = []
    for booking in bookings_ref:
        booking_data = booking.to_dict()
        booking_data['id'] = booking.id
        bookings_list.append(booking_data)
        
    return render_template('dashboard.html', bookings=bookings_list)

@app.route('/tables', methods=['GET', 'POST'])
def manage_tables():
    if request.method == 'POST':
        action = request.form.get('action')
        
        if action == 'add':
            number = int(request.form.get('number'))
            capacity = int(request.form.get('capacity'))
            location = request.form.get('location')
            
            new_table_data = {
                'number': number,
                'capacity': capacity,
                'location': location,
                'status': 'available'
            }
            db.collection('tables').add(new_table_data)
        
        elif action == 'delete':
            table_id = request.form.get('table_id')
            db.collection('tables').document(table_id).delete()
            
        elif action == 'update_status':
            table_id = request.form.get('table_id')
            new_status = request.form.get('new_status')
            db.collection('tables').document(table_id).update({
                'status': new_status
            })
            
        return redirect(url_for('manage_tables'))

    tables_ref = db.collection('tables').order_by('number').stream()
    tables_list = []
    for table in tables_ref:
        table_data = table.to_dict()
        table_data['id'] = table.id
        tables_list.append(table_data)
        
    return render_template('tables.html', tables=tables_list)

@app.route('/menu', methods=['GET', 'POST'])
def manage_menu():
    if request.method == 'POST':
        action = request.form.get('action')
        
        if action == 'add':
            name = request.form.get('name')
            description = request.form.get('description')
            price = float(request.form.get('price'))
            category = request.form.get('category')
            
            new_item_data = {
                'name': name,
                'description': description,
                'price': price,
                'category': category,
                'available': True
            }
            db.collection('menu').add(new_item_data)
        
        elif action == 'delete':
            item_id = request.form.get('item_id')
            db.collection('menu').document(item_id).delete()
            
        return redirect(url_for('manage_menu'))

    menu_ref = db.collection('menu').order_by('category').stream()
    menu_list = []
    for item in menu_ref:
        item_data = item.to_dict()
        item_data['id'] = item.id
        menu_list.append(item_data)
        
    return render_template('menu.html', menu_items=menu_list)

@app.route('/reports')
def reports():
    bookings_ref = db.collection('bookings').stream()
    
    all_bookings = []
    booking_hours = []
    booked_table_numbers = []

    today_str = datetime.now().strftime('%Y-%m-%d')
    
    for booking in bookings_ref:
        booking_data = booking.to_dict()
        all_bookings.append(booking_data)
        
        if booking_data.get('status') == 'confirmed':
            booking_hours.append(booking_data.get('time'))
            booked_table_numbers.append(booking_data.get('tableNumber'))

    total_bookings = len(all_bookings)
    today_bookings_count = sum(1 for b in all_bookings if b.get('date') == today_str)

    peak_hour = Counter(booking_hours).most_common(1)[0][0] if booking_hours else "N/A"
    popular_tables = Counter(booked_table_numbers).most_common(3) if booked_table_numbers else []
        
    stats = {
        'total_bookings': total_bookings,
        'today_bookings': today_bookings_count,
        'peak_hour': peak_hour,
        'popular_tables': popular_tables
    }
    
    return render_template('reports.html', stats=stats)

@app.route('/confirm-booking', methods=['POST'])
def confirm_booking():
    try:
        customer_id = "SIMULATED_USER"

        table_id = request.form.get('tableId')
        table_number = int(request.form.get('tableNumber'))
        date = request.form.get('date')
        time = request.form.get('time')
        people = int(request.form.get('people'))

        booking_ref = db.collection('bookings').add({
            'customerId': customer_id,
            'tableId': table_id,
            'tableNumber': table_number,
            'date': date,
            'time': time,
            'people': people,
            'status': 'confirmed',
            'paymentStatus': 'paid',
            'createdAt': firestore.SERVER_TIMESTAMP
        })

        db.collection('tables').document(table_id).update({
            'status': 'reserved'
        })
        
        return redirect("http://127.0.0.1:5500/my-bookings.html", code=302)

    except Exception as e:
        print(f"An error occurred: {e}")
        return redirect("http://127.0.0.1:5500/tables.html", code=302)

if __name__ == '__main__':
    app.run(debug=True)