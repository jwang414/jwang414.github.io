from flask import Flask, jsonify, request
import json
import requests

app = Flask(__name__)
YELP_API = "8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx"

parameters = {
    "radius": 16093,  # 10 miles
    "category": "all",
}
details_parameter = {
    "business_ID": ""
}

YELP_API = "Bearer 8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx"
BUSINESS_ENDPOINT = "https://api.yelp.com/v3/businesses/search"
DETAILS_ENDPOINT = "https://api.yelp.com/v3/businesses/"
HEADERS = {'Authorization': YELP_API}


@app.route('/')
def landing_page():
    return app.send_static_file('landing.html')

# business search


@app.route('/search', methods=['GET'])
def business_search():
    get_parameters()
    response = requests.get(url=BUSINESS_ENDPOINT,
                            params=parameters, headers=HEADERS)
    received_data = json.loads((response).text)
    business_list = business_parse(received_data)
    if not len(business_list):
        return "No businesses"
    return json.dumps(business_list)

# business details


@app.route('/business_details/<business_ID>', methods=['GET'])
def details_search(business_ID):
    response = requests.get(url=DETAILS_ENDPOINT +
                            str(business_ID), headers=HEADERS)
    received_data = json.loads((response).text)
    details_data = details_parse(received_data)
    return json.dumps(details_data)


#####helper functions######
def business_parse(received_data):
    business_list = []
    for b in received_data["businesses"]:
        try:
            name = b['name']
        except Exception:
            name = ''
        try:
            bus_id = b['id']
        except Exception:
            bus_id = ''
        try:
            url = b['url']
        except Exception:
            url = ''
        try:
            image_url = b['image_url']
        except Exception:
            image_url = ''
        try:
            rating = b['rating']
        except Exception:
            rating = ''
        try:
            distance = str(convert_miles_to_meters(b['distance']))
        except Exception:
            distance = str(16093)
        business = {
            "name": name,
            "url": url,
            "image_url": image_url,
            "rating": rating,
            "distance": distance,
            "id": bus_id

        }
        business_list.append(business)

    return business_list


def details_parse(received_data):
    details = {}
    try:
        status = received_data['hours']["is_open_now"]
        if status is False:
            status = "Closed"
        else:
            status = "Open Now"
    except Exception:
        status = ''

    try:
        name = received_data['name']
    except Exception:
        name = ''

    try:
        location = received_data['location']['address1']
        location += ' ' + received_data['location']['city']
        location += ' ' + received_data['location']['zip_code']
        location += ',' + received_data['location']['state']
        location += ' ' + received_data['location']['country']
    except Exception:
        location = ''

    try:
        price = received_data['price']
    except Exception:
        price = ''

    try:
        phone = received_data['display_phone']
    except Exception:
        phone = ''

    try:
        temp_cat = []
        for cat in received_data['categories']:
            temp_cat.append(cat['title'])
        category = ' | '.join(temp_cat)
    except Exception:
        category = ''

    try:
        transactions = ' '.join(received_data['transactions'])
    except Exception:
        transactions = ''

    try:
        phone = received_data['display_phone']
    except Exception:
        phone = ''

    try:
        image = received_data['photos']
    except:
        image = ''
    try:
        url = received_data['url']
    except:
        url = ''

    details["status"] = status
    details["location"] = location
    details["name"] = name
    details["price"] = price
    details["phone"] = phone
    details["category"] = category
    details["transactions"] = transactions
    details["image"] = image
    details["url"] = url

    return details


def convert_miles_to_meters(miles):
    temp = float(miles)
    return round(temp*1609.34, 2)


def convert_meters_to_miles(meters):
    temp = float(meters)
    return round(temp/1609.34, 2)


def get_parameters():
    parameters["term"] = request.args.get('keyword')
    if request.args.get('distance') is not "":
        parameters["distance"] = convert_miles_to_meters(
            request.args.get('distance'))
    parameters["category"] = request.args.get('category')
    parameters["latitude"] = request.args.get('latitude')
    parameters["longitude"] = request.args.get('longitude')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
