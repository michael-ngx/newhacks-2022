import axios from 'axios'



export async function getPlacesData (coord){
    
    const options = {
      params: {
          latitude: coord.lat,
          longitude: coord.lng,
          distance: '0.5',
          limit: '10',
      },
      headers: {
          'X-RapidAPI-Key': 'c0f901a9d8mshc7c7497498ab872p179f80jsn92b95a0cb054',
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };
    try {
      const { data: {data}} = await axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng', options);
      return data
    } catch (error) {
      console.log(error)
    }
}

