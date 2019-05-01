from flask import Flask, render_template, Response, request, jsonify, redirect, url_for, flash
from app import app, db
from app.models import *
from app.forms import *
from app.register import *
from app.events import *

from flask_login import current_user, login_user, logout_user, login_required
from flask_mail import Message

restaurants = []

appointments = []

restaurants_index = len(restaurants);

appointments_index = len(appointments);


@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('search'))
    form  = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('search')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('login'))



@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('search'))
    form  = RegistrationForm()
    if form.validate_on_submit():
        commit_registration(form)
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/search', methods=['GET', 'POST'])
@login_required
def search():
    global restaurants
    global appointments
    global restaurants_index
    global appointments_index

    appointment = request.args.get('appointment')

    appointments = [];

    events = get_recent_events(current_user.id)

    for event in events:
        new_item_entry = {
            "id": event.place_id,
            "title": event.title,
            "address": event.address,
            "date": str(event.date),
            "starttime": str(event.start_time.time()),
            "endtime": str(event.end_time.time()),
            "notes": event.notes,
            "position": event.position
        }

        appointments.append(new_item_entry)

        appointments_index += 1

    if request.method == 'POST':

        if (appointment == 'false') :

            json_data = request.get_json()
            id = json_data["id"]
            title = json_data["title"]
            address = json_data["address"]
            icon = json_data["icon"]
            position = json_data["position"]

            new_item_entry = {
                "id": id,
                "title": title,
                "address": address,
                "icon": icon,
                "position": position
            }

            restaurants_index +=1

            if new_item_entry not in restaurants:
                restaurants.append(new_item_entry)

        else :

            json_data = request.get_json()
            id = json_data["id"]
            title = json_data["title"]
            address = json_data["address"],
            date = json_data["date"],
            starttime = json_data["starttime"],
            endtime = json_data["endtime"],
            notes = json_data["notes"]
            position = json_data["position"]

            def convertDate(s):
                return datetime.strptime(s, '%Y-%m-%d')    

            def convertTime(s):
                return datetime.strptime(s, '%H:%M') 

            
            event = Event(place_id=str(id), title=str(title), address=str(address[0]), date=convertDate(str(date[0])), start_time=convertTime(str(starttime[0])), end_time=convertTime(str(endtime[0])), notes=str(notes), position=str(position))
            add_event(event)
            add_user_event(event, current_user)

            events = get_recent_events(current_user.id)


            print(type(event.date))

            print(type(event.start_time))

            print(str(event.date))

            print(str(event.start_time.time()))

            for event in events:
                new_item_entry = {
                    "id": event.place_id,
                    "title": event.title,
                    "address": event.address,
                    "date": str(event.date),
                    "starttime": str(event.start_time.time()),
                    "endtime": str(event.end_time.time()),
                    "notes": event.notes,
                    "position": event.position
                }

                if new_item_entry not in appointments:
                    appointments.append(new_item_entry)

                appointments_index += 1
                        
          

            return jsonify(restaurants = restaurants, appointments = appointments)       
    else:
        return render_template('search.html', appointments = appointments, restaurants = restaurants, restaurants_index = restaurants_index, appointments_index = appointments_index)

@app.route('/item', methods=['GET'])
@login_required
def item():
    global appointments
    user = current_user
    form = EmailForm()
    if form.validate_on_submit():
        msg = Message("Hi, from EATcu",
                  sender=user.email,
                  recipients=[form.recipient_email])
        msg.body = appointments + " " + form.message
        mail.send(msg)
    return render_template('item.html',title='Appointments', form=form, appointments = appointments);


if __name__ == '__main__':
    app.run(debug = True)
