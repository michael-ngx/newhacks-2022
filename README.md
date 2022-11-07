# What's in Between?

Project for NewHacks 2022 - University of Toronto

<p align="center">
  <img width="800" alt="Demo image" src="https://user-images.githubusercontent.com/108838237/200351785-6dc963dd-cfa7-4acc-a391-48125fa24764.png">
</p>

## About the Project

We love going on road trips! However, trip planning is hard sometimes, due to continuous searching, scrolling and noting down hundreds of locations on Google Maps along the travel route. This is defenitely time consuming and inconvenient.

With "What's in Between?", all the planning works are made easy for you. All you need to do is to input starting point and destination, then the app will show you the shortest driving path, hotels, restaurants, attractions, etc. along the way. The location's descriptions will help you make the planning decision easier.

We are adding new features to the website, including adding more filtering categoties, comparision option, and a function to plan your trip right inside the website!

### Built with

* [![React][React.js]][React-url]
* [![Maps JavaScript API][Google.com]][Maps-JavaScript-API-url]
* [![Places API][Places-API]][Places-API-url]
* [![Directions API][Directions-API]][Directions-API-url]

## Getting started

* Download the latest version of NodeJS

* Download/clone this repo

* Open the commandline in the project's directory and type 

```
npm install
```

* This will install all required node modules if they don't exist yet. Then, type

```
npm start!
```

## Roadmap

- [x] Route Map between Point A to B
- [x] Integrate Places API for locations around route
    - [x] Hotels
    - [x] Restaurants
    - [x] Sights & Attractions
    - [ ] Fuel & Rest stops
    - [ ] Shopping
    - [ ] Activities
    - [ ] Places to Camp
- [x] Add tab list to view location description
- [ ] Implement long-term usage API for places
- [ ] Filter option (Ratings, distance, etc.) with Comparision option
- [ ] List planning option with time


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Google.com]: https://img.shields.io/badge/-Maps-black.svg?style=for-the-badge&logo=google&colorB=e3e8e5
[Places-API]: https://img.shields.io/badge/-Places-black.svg?style=for-the-badge&logo=google&colorB=e3e8e5
[Directions-API]: https://img.shields.io/badge/-Directions-black.svg?style=for-the-badge&logo=google&colorB=e3e8e5

[React-url]: https://reactjs.org/
[Maps-JavaScript-API-url]: https://developers.google.com/maps/documentation/javascript/overview
[Places-API-url]: https://developers.google.com/maps/documentation/places/web-service/overview
[Directions-API-url]: https://developers.google.com/maps/documentation/directions/overview
