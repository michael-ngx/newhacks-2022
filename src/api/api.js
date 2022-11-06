import axios from 'axios'



export async function getPlacesData (coordarray){
    const optionsArray = []
    for (let i = 0; i < coordarray.length; i++){
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
        axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[0])
    ]
    // const promiseArray2 = [
    //     axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[5]),
    //     axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[6]),
    //     axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[7])
    // ]
    // for (let j = 0; j < optionsArray.length; j++){
    //     promiseArray.push(axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',optionsArray[j]));
    // }

    try {
        const resultArray = await Promise.all(promiseArray)
        return resultArray
    } catch (error) {
        console.log(error)
    }

    // try {
    //     const resultArray2 = await Promise.all(promiseArray2)
    //     const resultArraymain = [...resultArray0, ...resultArray2]
    //     return resultArraymain;
    // } catch (error) {
    //     console.log(error)
    // }
}

