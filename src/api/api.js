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
                'X-RapidAPI-Key': '6d1adcf553mshd38cfcaa3f893e4p15bb5ejsnbdff288d6e40',
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