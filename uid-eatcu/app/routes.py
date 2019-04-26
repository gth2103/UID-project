from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from app import app, db
from app.models import *

restaurants = []

appointments = []

restaurants_index = len(restaurants);

appointments_index = len(appointments);

@app.route('/search', methods=['GET', 'POST'])
def search():
    global restaurants
    global appointments
    global restaurants_index
    global appointments_index

    appointment = request.args.get('appointment')
   
    if request.method == 'POST':
        print(appointment)
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
            date = json_data["date"]
            starttime = json_data["starttime"]
            endtime = json_data["endtime"]
            notes = json_data["notes"]
            address = json_data["address"]


            new_item_entry = {
                "id": id,
                "title": title,
                "date": date,
                "starttime": starttime,
                "endtime": endtime,
                "notes": notes,
                "address": address
            }

            appointments_index += 1
           

 
            if new_item_entry not in appointments:
                appointments.append(new_item_entry)

            print(appointments)
        return jsonify(restaurants = restaurants, appointments = appointments)
    else:
        return render_template('search.html', appointments = appointments, restaurants = restaurants, restaurants_index = restaurants_index, appointments_index = appointments_index)

@app.route('/item', methods=['GET'])
def item():
    global appointments
    return render_template('item.html', appointments = appointments);

if __name__ == '__main__':
    app.run(debug = True)
