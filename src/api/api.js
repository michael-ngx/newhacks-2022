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
                'X-RapidAPI-Key': 'b16dd151efmsh05e632886d1328dp1b7ccdjsn8016d82d6c11',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
              }
        }
        optionsArray.push(options);
    }

    //to commit
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