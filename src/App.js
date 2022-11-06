import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, Text } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, Circle } from '@react-google-maps/api'

import { useRef, useState, useEffect } from 'react'
import homebg from "./homebg.png";
import "./imagestyle.css"
import { getPlacesData } from './api/api.js'

// import List from './components/List.js'

// Starting position
const center = { lat: 43.6607388, lng: -79.3988062 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })
  
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [markersList, setMarkersList] = useState([])
  const [circles, setCircles] = useState([])
  const [coordinatesMaster, setCoordinatesMaster] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchMarkers, setSearchMarkers] = useState([])
  // Note: directionsResponse is recorded, but not rendered when we execute the calculateRoute().
  // Needs directionsRenderer is used to render route between destinations
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const [menuDrawer, setmenuDrawer] = useState(true)
  const [listDrawer, setlistDrawer] = useState(false)
  const searchedMarker = []
  
  const [places, setPlaces] = useState([])

  useEffect(() => {
    getPlacesData()
    .then((data) => {
      console.log(data)
      setPlaces(data)
    })
  }, [])

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
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text) //TODO secondary: route[0] is fastest, but is it free?
    setDuration(results.routes[0].legs[0].duration.text)
    
    const leg = results.routes[0].legs[0]
    const coordinates = []
    for(let j = 0; j < leg.steps.length; j++){
      if(leg.steps[j].distance.value < 1500) {continue};
      let target = leg.steps[j].distance.value / 4000
      let skip = Math.ceil(leg.steps[j].path.length / target)
      for(let i = 0; i < leg.steps[j].path.length; i+=skip){
        const coords = { 
          lat: leg.steps[j].path[i].lat(),
          lng: leg.steps[j].path[i].lng()
        }
        setCoordinatesMaster( (prev) => ([...prev, coords]))
        coordinates.push(coords)
        setMarkersList( (prev) => ([...prev, <Marker position={coords}/>]))
        setCircles( (prev) => ([...prev, <Circle center={coords} radius ={8000} 
        options={ {strokeOpacity: 0.3, strokeWeight: 1, fillColor: '#FF0000', strokeColor: '#FF0000', fillOpacity: 0.3}}/>]));
      }
    }
    setCoordinatesMaster(coordinates);
    // getPlacesData(coordinates[0]);
  }

  // Clear Route when pressed X button
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  // *******************************************************************************
  // *******************************************************************************
  // Find nearby stuff
  // *******************************************************************************
  // *******************************************************************************

  function serachingQueries(){
    //todo: iterate through all the checked off queries
  };

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
          {/* <Marker position={center} /> //Todo: use a loop to display all markers for hotels, attractions, etc. */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          <div>{markersList}{searchMarkers}</div>
          {/*add back {circles} after amagalating into one polygon */}
        </GoogleMap>
      </Box>

      <div id="home">
      
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
          
          <Button id="startbutton" left='42%' top='55vh' width="6cm" height="1.5cm" zIndex='3' position='absolute' onClick={() => setmenuDrawer(false)}>
              Start my trip
          
          </Button>
        </Box>}

        {/* <Button onClick={() => setlistDrawer(true)}>
          Test Open
        </Button> */}
      </div>

      <HStack justify='space-between' align='flex-start'>
        {/* ************************************* */}
        {/* Places List View */}
        {/* ************************************* */}
        {/* Opens the Drawer when pressed the button */}

        {listDrawer &&
        <Box h='100vh' w='30%' p={5} borderRadius='lg' bgColor='white' shadow='base' zIndex='1'> 
          
          <h1>List</h1>

          <Button onClick={() => setlistDrawer(false)}>
              Test Close
          </Button>
        </Box>}

        <Button onClick={() => setlistDrawer(true)}>
          Test Open
        </Button>

        {/* ************************************* */}
        {/* Input Box */}
        {/* ************************************* */}
        <Box w='50%' p={5} borderRadius='lg' bgColor='white' shadow='base' zIndex='1' >
          <HStack spacing={2} justifyContent='space-between'>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type='text' placeholder='Origin' ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type='text' placeholder='Destination' ref={destinationRef}/>
              </Autocomplete>
            </Box>

            <ButtonGroup>
              <Button colorScheme='blue' type='submit' onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
              <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            {/* Display distance and duration */}
            {/* <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text> */}
          </HStack>
        </Box>
      </HStack>
    </Flex>
  )
}
  
export default App