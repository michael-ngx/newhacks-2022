import axios from 'axios'

const options = {
    params: {
        latitude: '43.6608274',
        longitude: '-79.3978566',
        distance: '0.5',
        limit: '10',
    },
    headers: {
        'X-RapidAPI-Key': '647a672230msh726502075a2ac50p1637fejsn610f8441d226',
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

