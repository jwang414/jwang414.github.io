from cgitb import text
from flask import Flask, request
import json
import requests

app = Flask(__name__)
YELP_API = "8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx"

DEFAULT_PARAMETERS = {
    "term": "",
    "radius": 16093,  # 10 miles
    "categories": "all",
    "latitude": 34.0522342,
    "longitude": -118.2436849
}
YELP_API = "Bearer 8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx"
BUSINESS_ENDPOINT = "https://api.yelp.com/v3/businesses/search"
HEADERS = {'Authorization': YELP_API}


@app.route('/', methods=['GET'])
def business_search():
    response = requests.get(url=BUSINESS_ENDPOINT,
                            params=DEFAULT_PARAMETERS, headers=HEADERS)
    received_data = json.loads((response).text)
    return json.dumps(received_data)


#####helper functions######

def convert_miles_to_meters(miles):
    return round(miles/1609.34, 2)


def get_parameters():
    return None


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
