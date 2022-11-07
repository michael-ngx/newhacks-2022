
import requests, json

url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"


category_list = ["Restauraunt", "Hotel", "Attraction"]
API_KEY = "AIzaSyCWdGX9E1WSKsgT_YEu-eUD3DqWjhanbac"
vicinity_radius = "8000"

  
# The text string on which to search
selected_geocode_location = ["43.68539", "-79.512581"]
  
# get method of requests module
# return response object
def getLocations(latitude: float, longitude: float, category: int):
    
    geocodes = [] # [lat, lng, name, rating]

    r = requests.get(url +
                    "&location=" + str(latitude) + "," + str(longitude) + 
                    "&radius=" + vicinity_radius + 
                    "&name=" + category_list[category] + 
                    "&sensor=false&key=" + API_KEY)

    results = r.json()['results']

    for i in range(len(results)):
        location = results[i]['geometry']['location']
        geocodes.append([location['lat'], location['lng'], results[i]['name'], results[i]['rating']])

    return geocodes

print(getLocations(43.68539, -79.512581, 0))