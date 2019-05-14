from flask import Flask, render_template, Response, request, jsonify, redirect, url_for, flash
from app import app, db
from app.models import *
from app.forms import *
from app.register import *
from app.events import *

from flask_login import current_user, login_user, logout_user, login_required
from flask_mail import Message

restaurants = [] # accepted and unaccepted events

appointments = [] # accepted events

users =  [] # all_users

invites =  [] # accepted and unaccepted userEvents

pending = [] # unaccepted userEvents


restaurants_index = len(restaurants)

appointments_index = len(appointments)

invites_index = len(invites)

users_index = len(users)

pending_index =  len(pending)


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
    global pending
    global restaurants_index
    global appointments_index
    global pending_index

    restaurants_index = len(restaurants)

    user_id = current_user.id

    users = []

    users_index = len(users)

    all_users = User.query.all()

    for user in all_users:

        userObj  = {
            "username": user.username,
            "user_id": user.id
        }

        if userObj not in users:
            users.append(userObj)
            users_index += 1

    pending = []

    pending_index =  len(pending)

    pendingEvents =  get_pending_events(current_user.id)

    for pendingEvent in pendingEvents:
        new_pending_entry = {
            "id": pendingEvent.id,
            "place_id": pendingEvent.place_id,
            "title": pendingEvent.title,
            "address": pendingEvent.address,
            "date": str(pendingEvent.date),
            "starttime": str(pendingEvent.start_time.time()),
            "endtime": str(pendingEvent.end_time.time()),
            "notes": pendingEvent.notes,
            "position": pendingEvent.position,
            "user_id": pendingEvent.user_id
        }

        pending.append(new_pending_entry)
        pending_index += 1


    appointments = []

    appointments_index = len(appointments)

    events = get_recent_events(current_user.id)

    for event in events:
        new_item_entry = {
            "id": event.id,
            "place_id": event.place_id,
            "title": event.title,
            "address": event.address,
            "date": str(event.date),
            "starttime": str(event.start_time.time()),
            "endtime": str(event.end_time.time()),
            "notes": event.notes,
            "position": event.position,
            "user_id": event.user_id
        }

        appointments.append(new_item_entry)
        appointments_index += 1

    appointment = request.args.get('appointment')

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

            if new_item_entry not in restaurants:
                restaurants.append(new_item_entry)
                restaurants_index +=1

        else :

            json_data = request.get_json()
            id = json_data["id"]
            title = json_data["title"]
            address = json_data["address"]
            date = json_data["date"]
            starttime = json_data["starttime"]
            endtime = json_data["endtime"]
            notes = json_data["notes"]
            position = json_data["position"]

            def convertDate(s):
                return datetime.strptime(s, '%Y-%m-%d')    

            def convertTime(s):
                return datetime.strptime(s, '%H:%M') 

            
            event = Event(user_id = current_user.id, place_id=str(id), title=str(title), address=str(address), date=convertDate(str(date)), start_time=convertTime(str(starttime)), end_time=convertTime(str(endtime)), notes=str(notes), position=str(position))
            add_event(event)
            add_user_event(event, current_user)

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
                    "position": event.position,
                    "user_id": current_user.id
                }

                if new_item_entry not in appointments:
                    appointments.append(new_item_entry)
                    appointments_index += 1

            return jsonify(restaurants = restaurants, appointments = appointments)       
    else:
        return render_template('search.html', appointments = appointments, restaurants = restaurants, restaurants_index = restaurants_index, appointments_index = appointments_index, pending =  pending, users = users, user_id = user_id)



@app.route('/item', methods=['GET', 'POST'])
@login_required
def item():
    global appointments
    global users
    global invites
    global pending
    global appointments_index
    global pending_index
    global users_index
    global invites_index

    appointments_index = len(appointments)

    pending_index =  len(pending)

    username = current_user.username
    user_id = current_user.id

    users =  []
    invites =  []

    users_index = len(users)

    invites_index = len(invites)

    all_users = User.query.all()
    invited = UserEvent.query.all()

    for user in all_users:
        if user not in users:
            users.append(user.username)
            users_index += 1

    for invitee in invited:
        event = get_event(invitee.event_id)
        new_invtee_entry = {}
        if(invitee.user_id == event.user_id) :
            new_invtee_entry = {
                "username": invitee.user.username + " : host",
                "event_id": invitee.event_id,
                "accepted": invitee.accepted
            }
        else:
            new_invtee_entry = {
                "username": invitee.user.username,
                "event_id": invitee.event_id,
                "accepted": invitee.accepted
            }
        
        if new_invtee_entry not in invites:
            invites.append(new_invtee_entry)
            invites_index += 1
    
    return render_template('item.html',title='Appointments', users=users, appointments = appointments, invites = invites,  pending = pending, username=username, user_id=user_id, appointments_index=appointments_index, pending_index  = pending_index);

@app.route('/remove_event/<event_id>', methods=['POST'])
@login_required
def remove_event(event_id):
    global appointments
    global appointments_index

    remove_event(event_id)

    appointments = [];

    appointments_index = len(appointments)

    events = get_recent_events(current_user.id)

    for event in events:
        new_item_entry = {
            "id": event.id,
            "place_id": event.place_id,
            "title": event.title,
            "address": event.address,
            "date": str(event.date),
            "starttime": str(event.start_time.time()),
            "endtime": str(event.end_time.time()),
            "notes": event.notes,
            "position": event.position,
            "user_id":  event.user_id
        }

        if new_item_entry not in appointments:
            appointments.append(new_item_entry)
            appointments_index += 1
    return redirect(url_for('search'));


@app.route('/update_event/<event_id>', methods=['POST'])
@login_required
def update_event(event_id):
    global appointments
    global appointments_index

    json_data = request.get_json()

    date = json_data["date"]
    starttime = json_data["starttime"]
    endtime = json_data["endtime"]
    notes = json_data["notes"]


    def convertDate(s):
        return datetime.strptime(s, '%Y-%m-%d')    

    def convertTime(s):
        return datetime.strptime(s, '%H:%M') 


    update_db_event(event_id, convertDate(str(date)), convertTime(str(starttime)), convertTime(str(endtime)), str(notes))

    new_event = get_event(event_id)
    print(new_event.start_time)

    appointments = [];

    appointments_index = len(appointments)

    events = get_recent_events(current_user.id)

    for event in events:
        new_item_entry = {
            "id": event.id,
            "place_id": event.place_id,
            "title": event.title,
            "address": event.address,
            "date": str(event.date),
            "starttime": str(event.start_time.time()),
            "endtime": str(event.end_time.time()),
            "notes": event.notes,
            "position": event.position,
            "user_id":  event.user_id
        }

        if new_item_entry not in appointments:
            appointments.append(new_item_entry)
            appointments_index += 1
    return jsonify(appointments = appointments);


@app.route('/remove_invitation/<event_id>/<username>', methods=['POST'])
@login_required
def remove_invitation(event_id, username):
    global pending
    global pending_index

    user = User.query.filter_by(username=username).first()
    delete_user_event(event_id, user.id)

    pending = []

    pending_index =  len(pending)

    pendingEvents = get_pending_events(current_user.id)

    for pendingEvent in pendingEvents:
        new_pending_entry = {
            "id": pendingEvent.id,
            "place_id": pendingEvent.place_id,
            "title": pendingEvent.title,
            "address": pendingEvent.address,
            "date": str(pendingEvent.date),
            "starttime": str(pendingEvent.start_time.time()),
            "endtime": str(pendingEvent.end_time.time()),
            "notes": pendingEvent.notes,
            "position": pendingEvent.position,
            "user_id": pendingEvent.user_id
        }
        if new_pending_entry not in pending:
            pending.append(new_pending_entry)
            pending_index += 1
    return redirect(url_for('search'));

@app.route('/accept_invitation/<event_id>/<username>', methods=['POST'])
@login_required
def accept_invitation(event_id, username):
    global pending
    global pending_index
    global appointments
    global appointments_index

    user = User.query.filter_by(username=username).first()
    accept_user_event(event_id, user.id)

    pending = []

    pending_index =  len(pending)

    pendingEvents = get_pending_events(current_user.id)

    for pendingEvent in pendingEvents:
        new_pending_entry = {
            "id": pendingEvent.id,
            "place_id": pendingEvent.place_id,
            "title": pendingEvent.title,
            "address": pendingEvent.address,
            "date": str(pendingEvent.date),
            "starttime": str(pendingEvent.start_time.time()),
            "endtime": str(pendingEvent.end_time.time()),
            "notes": pendingEvent.notes,
            "position": pendingEvent.position,
            "user_id": pendingEvent.user_id
        }

        if new_pending_entry not in pending:
            pending.append(new_pending_entry)
            pending_index += 1

    appointments = []

    appointments_index = len(appointments)

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
            "position": event.position,
            "user_id": current_user.id
        }

        if new_item_entry not in appointments:
            appointments.append(new_item_entry)
            appointments_index += 1

    return redirect(url_for('search'));



@app.route('/invite_people/<event_id>/<username>', methods=['POST'])
@login_required
def invite_people(event_id, username):
    print(event_id)
    event = Event.query.filter_by(id=event_id).first()
    print(event)
    user = User.query.filter_by(username=username).first()
    print(user)
    print(current_user)
    send_invite(event, current_user, user)
    return redirect(url_for('search'));


if __name__ == '__main__':
    app.run(debug = True)
