import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, Text } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, Circle } from '@react-google-maps/api'
import { useRef, useState, useEffect } from 'react'
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
  
  
  //ON THE LINE
  const [markersList, setMarkersList] = useState([])
  const [circles, setCircles] = useState([])
  const [coordinatesMaster, setCoordinatesMaster] = useState([])
  // Note: directionsResponse is recorded, but not rendered when we execute the calculateRoute().
  // Needs directionsRenderer is used to render route between destinations

  //NOT ON THE LINE
  const [searchResults, setSearchResults] = useState([])
  const [searchMarkers, setSearchMarkers] = useState([])
  const searchedMarker = []

  //deprecate?
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  
  const [places, setPlaces] = useState([])
  
  const [listDrawer, setlistDrawer] = useState(false)

  const firstUpdate = useRef(true);

  useEffect(() => { 
    if(firstUpdate.current) {
        firstUpdate.current = false;
        return;
    }
      getPlacesData(coordinatesMaster)
      .then((dataarray) => {
        console.log(dataarray)
        setPlaces(dataarray)
      })
    }, [coordinatesMaster])
      
      

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
    setDistance(results.routes[0].legs[0].distance.text) //TODO secondary: route[0] is fastest, but is it free?
    setDuration(results.routes[0].legs[0].duration.text)
    
    const leg = results.routes[0].legs[0]
    const coordinates = []
    for(let i = 0; i < results.routes[0].overview_path.length; i+=Math.ceil(results.routes[0].overview_path.length/5)){
        const coords = { 
          lat: results.routes[0].overview_path[i].lat(),
          lng: results.routes[0].overview_path[i].lng()
        }
        //setCoordinatesMaster( (prev) => ([...prev, coords]))
        coordinates.push(coords)
        setMarkersList( (prev) => ([...prev, <Marker position={coords}/>]))
        setCircles( (prev) => ([...prev, <Circle center={coords} radius ={8000} 
        options={ {strokeOpacity: 0.3, strokeWeight: 1, fillColor: '#FF0000', strokeColor: '#FF0000', fillOpacity: 0.3}}/>]));
      }
    
    setCoordinatesMaster(coordinates);
    // getPlacesData(coordinates[0]);
  }

  // Clear Route when pressed X button
  function clearRoute() {
    setMarkersList([])
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