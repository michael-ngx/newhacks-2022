import axios from 'axios'

export async function getPlacesData (coordarray, apiURL){
    const optionsArray = []
    for (let i = 0; i < 5; i++){
        const options = {
            params: {
                latitude: coordarray[i].lat,
                longitude: coordarray[i].lng,
                distance: '8',
                limit: '10'
                //open_now: true,
            },
            headers: {
                'X-RapidAPI-Key': '8c3616ee6amsh0073e22fc14cf1dp1ea398jsncfc90b52283a',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
              }
        }
        optionsArray.push(options);
    }

    const promiseArray = [
      axios.get(apiURL,optionsArray[0]),
      axios.get(apiURL,optionsArray[1]),
      axios.get(apiURL,optionsArray[2]),
      axios.get(apiURL,optionsArray[3]),
      axios.get(apiURL,optionsArray[4])
    ]

    try {
        const resultArray = await Promise.all(promiseArray)
        return resultArray
    } catch (error) {
        console.log(error)
    }
}