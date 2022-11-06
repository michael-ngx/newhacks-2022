import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, VStack, Spinner } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, Circle } from '@react-google-maps/api'

import { useRef, useState, useEffect } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import homebg from "./homebg.png";
import "./imagestyle.css"
import { getPlacesData } from './api/api.js'

<link rel='stylesheet' href='imagestyle.css'/>

// Starting position
const center = { lat: 43.6607388, lng: -79.3988062 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })
  
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  
  
  // ON THE LINE
  const [markersList, setMarkersList] = useState([])
  const [circles, setCircles] = useState([])
  const [coordinatesMaster, setCoordinatesMaster] = useState([])
  // Note: directionsResponse is recorded, but not rendered when we execute the calculateRoute().
  // Needs directionsRenderer is used to render route between destinations

  // NOT ON THE LINE
  const [searchMarkers, setSearchMarkers] = useState([])
  const [places, setPlaces] = useState([])
  const firstUpdate = useRef(true);
  
  // Drawers for rendering
  const [menuDrawer, setmenuDrawer] = useState(true)
  const [listDrawer, setlistDrawer] = useState(false)

  const [filter, setFilter] = useState('')
  const filterKeys = {
    hotel: 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng',
    restaurant: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
    attraction: 'https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng'
  }
  const [URL, setURL] = useState(filterKeys.hotel)
  var establishments = []
  const [establishmentElem, setEstablishmentElem] = useState([])
  
  const placesToMarkers = (dataarray) => {
    for(let i = 0; i < 5; i++){
      var circle = dataarray[i].data.data //array of place data
      for(let j = 0; j < circle.length; j++){
        //console.log(circle[j])
        if(circle[j].latitude == null) { continue };
        const coords = {
          lat: parseFloat(circle[j].latitude),
          lng: parseFloat(circle[j].longitude)
        }
        //console.log(coords)
       // let marker = <Marker position={coords}/>
        setSearchMarkers( (prev) => ([...prev, coords]))
       // markerArray.push(coords)
        establishments.push(circle[j]);
      }

    }
    console.log("This is the length of the establishments array: " + establishments.length)
   // console.log(markerArray)
    //setSearchMarkers(markerArray)
  }
  useEffect(() => { 
    if(firstUpdate.current) {
        firstUpdate.current = false;
        return;
    }
      getPlacesData(coordinatesMaster,URL)
      .then((dataarray) => {
        establishments = []
        setSearchMarkers([])
        setEstablishmentElem([])
        setPlaces(dataarray)
        placesToMarkers(dataarray)
        showList();
      })
    }, [coordinatesMaster,URL])

    
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()

  // Loading screen
  if (!isLoaded) {
    return <p>Loading...</p>
  }

  // Calculate routes between origin & destination
  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
    setMarkersList([])
    setDirectionsResponse(null)
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    
    const leg = results.routes[0].legs[0]
    const coordinates = []
    for(let i = 0; i < results.routes[0].overview_path.length; i+=Math.ceil(results.routes[0].overview_path.length/5)){
       
      const coords = { 
          lat: results.routes[0].overview_path[i].lat(),
          lng: results.routes[0].overview_path[i].lng()
        }
        //console.log(coords)
        //setCoordinatesMaster( (prev) => ([...prev, coords]))
        coordinates.push(coords)
        setMarkersList( (prev) => ([...prev, <Marker position={coords}/>]))
        setCircles( (prev) => ([...prev, <Circle center={coords} radius ={8000} 
        options={ {strokeOpacity: 0.3, strokeWeight: 1, fillColor: '#FF0000', strokeColor: '#FF0000', fillOpacity: 0.3}}/>]));
      }
    
    setCoordinatesMaster(coordinates);
  }

  // Clear Route when pressed X button
  function clearRoute() {
    setMarkersList([])
    setDirectionsResponse(null)
    setSearchMarkers([])
    setEstablishmentElem([])
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  function showList() {
    
    for(let x = 0; x < (establishments.length < 10? establishments.length: 10); x++){
      const name = establishments[x].name
      const rating = establishments[x].rating || "No Rating"
      //console.log(name + " " + rating)
      console.log(`loop ${x}`)
      setEstablishmentElem((prev) => ([...prev, <div className='leftSideBarList'><a>{name}</a><p>{rating}</p><br></br></div>]))
    }
    console.log("exiting showlist")
    console.log("the establishment number is" + establishments.length)
    
    //console.log(establishmentElem)
  }

  // *******************************************************************************
  // *******************************************************************************
  // Rendering
  // *******************************************************************************
  // *******************************************************************************

  return (

    /* <homepage/> */
    <Flex position='absolute' flexDirection='column' h='100vh' w='100vw'>
      {/* ************************************* */}
      {/* Google Map */}
      {/* ************************************* */}

      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >

          {searchMarkers.map((marker) => {
            return <Marker position = {marker} onClick={() => setlistDrawer(true)}/>
          })
        }
         
          {/* <Marker position={center} /> //Todo: use a loop to display all markers for hotels, attractions, etc. */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
       
          {/*add back {circles} after amagalating into one polygon */}
        </GoogleMap>
      </Box>
      <div id="home">
      
      {/* ************************************* */}
      {/* Menu View */}
      {/* ************************************* */}
      {menuDrawer &&
        <Box height='100vh' width='100vw'  left="0" top = "0" display='block' bgColor="white" position='absolute' shadow='base' zIndex='2'> 
          <img className="homeimage" src={homebg}></img>
          <div>
            <Box m={4} id="homebox" height='240' width='40%'  left="30%" top = "20%" display='block' bgColor="#D8C9B6" position='absolute' shadow='base' zIndex='5'>
              <br></br>
              <h1 className="homeheader">What's In Between?</h1>
              <p className="homepara"> Route from A to B and discover what's in between! Locating restaurants, hotels, gas stations, and attractions made easy. </p>
            </Box>
          </div>
          
          <Button id="startbutton" left='42%' top='55vh' width="6cm" height="1.5cm" zIndex='5' position='absolute' onClick={() => setmenuDrawer(false)}>
              Start my trip
          </Button>
        </Box>}

      </div>
      
      <HStack justify='space-between' align='flex-start'>
        {/* ************************************* */}
        {/* Places List View */}
        {/* ************************************* */}
        {listDrawer &&
        <Box h='100vh' w='30%' borderRadius='lg' bgColor='white' shadow='base' zIndex='1'> 
          
          <Button left='0' zIndex='1' position='absolute' bgColor='light-grey' onClick={() => {
            setlistDrawer(false);
            setEstablishmentElem([]);
            setSearchMarkers([]);
          }}>
                X
          </Button>
            <VStack spacing={4} alignContent='space-between'>
              <Box><br/><b>What are you looking for?</b></Box>
              <Tabs align='flex-start' isLazy variant='soft-rounded' colorScheme='green' justify='space-between'>
                  <TabList alignContent='center'>
                      <Tab className="tab-buttons" onClick={() => {setEstablishmentElem([])(setURL(filterKeys.hotel))}}>Hotels</Tab>
                      <Tab className="tab-buttons" onClick={() => {setEstablishmentElem([])(setURL(filterKeys.restaurant))}} >Restaurants</Tab>
                      <Tab className="tab-buttons" onClick={() => {setEstablishmentElem([])(setURL(filterKeys.attraction))}}>Attractions</Tab>
                      
                  </TabList>
                  <Spinner position='absolute' left='13%' top='30%' hidden={establishmentElem.length !== 0}/>
                  <TabPanels>
                      <TabPanel > 
                        <Box position='absolute' left='1.5%' width='30%' overflow-y='hidden'>
                          {establishmentElem.map((div) => {return ( div )})}
                           
                        </Box>
                      </TabPanel>
                      <TabPanel > <Box position='absolute' left='1.5%' width='30%' overflow-y='hidden'>
                          {establishmentElem.map((div) => {return ( div )})}
                           
                        </Box> </TabPanel>
                      <TabPanel > <Box position='absolute' left='1.5%' width='30%' overflow-y='hidden'>
                          {establishmentElem.map((div) => {return ( div )})}
                           
                        </Box> </TabPanel>
                  </TabPanels>
                  </Tabs>
            </VStack>        
            </Box>}
        <Button bgColor='white' shadow='base' zIndex='1' onClick={() => {
            setlistDrawer(true);
            setURL(filterKeys.hotel);
          }}>
          Filter
        </Button>

        {/* ************************************* */}
        {/* Input Box */}
        {/* ************************************* */}
        <Box position='fixed' right='0' w='50%' p={5} borderRadius='lg' bgColor='white' shadow='base' zIndex='1'>
          <HStack spacing={2} justifyContent='space-between'>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type='text' placeholder='Origin' ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type='text' placeholder='Destination' ref={destinationRef} />
              </Autocomplete>
            </Box>

            <ButtonGroup>
              <Button colorScheme='blue' type='submit' onClick={() => {calculateRoute()
                 setlistDrawer(true)}}>
                Calculate Route
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute} />
              <IconButton
                aria-label='center back'
                icon={<FaLocationArrow />}
                isRound
                onClick={() => {
                  map.panTo(center)
                  map.setZoom(15)
                } } />
            </ButtonGroup>
          </HStack>
          
        </Box>
      </HStack>
    </Flex>
  )
}
  
export default App