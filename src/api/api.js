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

    const promiseArray = optionsArray.map(async (option) => {
        var a = await axios.get(apiURL, option)
        return a
    })

    try {
        console.log(await (promiseArray))
        return await Promise.all(promiseArray)
    } catch (error) {
        console.log(error)
    }
}