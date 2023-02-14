// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

let temp1 = 35.68294148822643;
let temp2 = 139.76663189057422;
let globe = Date.now();
 async function  initAutocomplete() {
  const start = Date.now();
  
  document.getElementById("currentLong").innerText = "Long: "+temp1;
  document.getElementById("currentLat").innerText = "Lat: "+temp2;
  document.getElementById("personButton").addEventListener("click", ()=>{
    console.log("RED")
    temp1 = document.getElementById("lon").value;
    temp2 = document.getElementById("lat").value;
    console.log(temp1);
    console.log(temp2);
    document.getElementById("currentLong").innerText = "Long: "+temp1;
    document.getElementById("currentLat").innerText = "Lat: "+temp2;

  })

  const pyrmont = { lat: temp1, lng: temp2 };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 35.68294148822643, lng: 139.76663189057422 },
      zoom: 18,
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
      searchBox.addListener("places_changed", () => {
       
        const places = searchBox.getPlaces();
    
        if (places.length == 0) {
          return;
        }
    
        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
    
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
    
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }
    
          const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };
    
          // Create a marker for each place.
          markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);

       
      });

      // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");


  moreButton.onclick = function () {
    // moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };
      // Perform a nearby search.
     
  service.nearbySearch(
    { location: { lat: temp1, lng: temp2 }, radius: 100000, type: "store" },
    (results, status, pagination) => {
      const start1 = Date.now();
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      // moreButton.disabled = !pagination || !pagination.hasNextPage;
      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
      const end1 = Date.now();
  console.log(`STOREIN: ${end1 - globe} ms`);
    }
  );
  
  const end = Date.now();
  console.log(`Page Execution time: ${end - start} ms`);
  
  }


  async function addPlaces(places, map) {
    const start = Date.now();
    const placesList = document.getElementById("places");
  
    for (const place of places) {
      if (place.geometry && place.geometry.location) {
        const image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
        });
  
        const li = document.createElement("li");
  
        li.textContent = place.name;
        placesList.appendChild(li);
        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
      }
    }
    const end = Date.now();
    console.log(`Stores: ${end - globe} ms`);
   // document.getElementById("time").innerText = `Execution time: ${end - start} ms`;
  }
  


  

  window.initAutocomplete = initAutocomplete;