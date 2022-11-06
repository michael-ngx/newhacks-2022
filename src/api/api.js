import axios from 'axios'

export async function getPlacesData (coordarray){
    const optionsArray = []
    for (let i = 0; i < 5; i++){
        const options = {
            params: {
                latitude: coordarray[i].lat,
                longitude: coordarray[i].lng,
                distance: '5',
                limit: '1',
            },
            headers: {
                'X-RapidAPI-Key': '647a672230msh726502075a2ac50p1637fejsn610f8441d226',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
              }
        }
        optionsArray.push(options);
    }

    const promiseArray = [
      axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[0]),
      axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[1]),
      axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[2]),
      axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[3]),
      axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[4])
    ]

    try {
        const resultArray = await Promise.all(promiseArray)
        return resultArray
    } catch (error) {
        console.log(error)
    }
}