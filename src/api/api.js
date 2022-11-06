import axios from 'axios'

const options = {
    params: {
        latitude: '43.6608274',
        longitude: '-79.3978566',
        distance: '0.5',
        limit: '10',
    },
    headers: {
        'X-RapidAPI-Key': 'c0f901a9d8mshc7c7497498ab872p179f80jsn92b95a0cb054',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
      }
};

export async function getPlacesData (){
    try {
      const { data: {data}} = await axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng', options);
      return data
    } catch (error) {
      console.log(error)
    }
}

