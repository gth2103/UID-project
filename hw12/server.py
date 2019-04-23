from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)


restaurants = []


current_index = len(restaurants);

@app.route('/search', methods=['GET', 'POST'])
def search():
    global restaurants
    global current_index

    if request.method == 'POST':

        json_data = request.get_json()
        id = json_data["id"]
        title = json_data["title"]
        address = json_data["address"]

        new_item_entry = {
            "index": current_index,
            "id": id,
            "title": title,
            "address": address,
        }

        current_index +=1

        restaurants.append(new_item_entry)
        
        return jsonify(restaurants = restaurants)
    else:
        return render_template('search.html', restaurants = restaurants, current_index = current_index)

@app.route('/item/<item_id>', methods=['GET'])
def item(item_id):
    global characters
    item_id = item_id
    return render_template('item.html', item_id = item_id, restaurants = restaurants) 

if __name__ == '__main__':
    app.run(debug = True)
