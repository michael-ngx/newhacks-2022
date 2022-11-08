from flask import Flask, request
import requests, json, time

app = Flask(__name__)
url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"

allPlaces = set()
#category_list = ["Restauraunt", "Hotel", "Attraction"]
vicinity_radius = "5000"

  
# The text string on which to search
selected_geocode_location = ["43.68539", "-79.512581"]

def getLocations(latitude: float, longitude: float, category: str, api_key: str):
    geocodes = [] # [lat, lng, name, rating]
    r = requests.get(url +
                    "&location=" + str(latitude) + "," + str(longitude) + 
                    "&radius=" + vicinity_radius + 
                    "&name=" + category + 
                    "&sensor=false&key=" + api_key)

    results = r.json()['results']
    if len(results) < 15:
        x = len(results)
    else:
        x = 10
    for i in range(x):
        location = results[i]['geometry']['location']
        allPlaces.add((location['lat'], location['lng'], results[i]['name'], results[i]['rating']))
    #return geocodes
# get method of requests module
# return response object
@app.route("/getLocations", methods=['GET','POST'])
def runLocationsAPI():
    request_data = request.get_json()
    coordinatesMaster = request_data['coordinatesMaster']
    category = request_data['category']
    API_KEY = request_data['API_KEY']
    #establishments = set()

    for ref_coordinate in coordinatesMaster:
        lat = ref_coordinate['lat']
        lng = ref_coordinate['lng']
        geocodes = getLocations(lat,lng,category,API_KEY)
        #establishments.add(geocodes)
        #establishments.append(geocodes)
        time.sleep(0.01)
    temp = list(allPlaces)
    returning = []
    for location in temp:
        returning.append(list(location))
    return returning

if __name__ == "__main__":
    app.run(debug=False)