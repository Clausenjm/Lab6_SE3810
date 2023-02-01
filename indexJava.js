const busURL = "https://msoe-web-apps.appspot.com/BusInfo?key=Vvsa6jCb3jAGBeGnhCTuzQEKB&rt=";
const successfulLoad = 200;

let markers = []; // List of all markers
let interval = ""; // The interval storage
let isON = false; // Is the program running?

window.onload = () => {





    // Initialize the map
    map = L.map('mapID').setView([43.04391143798828,-87.91095932006836], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Initialize the start and stop buttons
    document.getElementById("start").onclick = toggleBus;
    document.getElementById("stop").onclick = toggleBus;
}


// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat:  35.66900634889589, lng: 139.77887951691656};
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }





  
/**
 * Fetches the data from the MCTS server and gives the corresponding error message if needed
 * Otherwise will proceed to displaying information
 */
function checkBus() {
    fetch(busURL + document.getElementById("filter").value).then((response) => {
        if(response.status !== successfulLoad) {
            let div = document.getElementById("error")
            div.className = "alert alert-danger";
            div.role = "alert";
            div.innerText = "Error: Bad AJAX request. Request was aborted";
            return;
        }
        response.json().then((data) => {
            console.log(data);
            if (data.status) { // If no input is given
                let div = document.getElementById("error")
                div.className = "alert alert-danger";
                div.role = "alert";
                div.innerText = "Error: " + data.status;
            } else if (data["bustime-response"].error && document.getElementById("filter").value == 1003) { // Invalid API
                let div = document.getElementById("error")
                div.className = "alert alert-danger";
                div.role = "alert";
                div.innerText = "Error 1003: " + data["bustime-response"].error[0].msg;
            } else if (data["bustime-response"].error) { // If invalid input is given
                let div = document.getElementById("error")
                div.className = "alert alert-danger";
                div.role = "alert";
                div.innerText = "Error response for route: " + document.getElementById("filter").value + ": " + data["bustime-response"].error[0].msg;
            } else if (data["bustime-response"].vehicle) { // Normal case
                let div = document.getElementById("error")
                div.className = "";
                div.role = "";
                div.innerText = "";

                addBus(data);
            }
        });
    });
}

/**
 * Adds all bus data to the table and then the map
 */
function addBus(data) {
    // Adds bus information to the table
    const table = document.getElementById("table1");
    let tHead = `<thead><tr><th>Bus</th><th>Route ` + data["bustime-response"].vehicle[0].rt + `</th><th>Latitude</th><th>Longitude</th><th>Speed(MPH)</th><th>Distance(mi)</th></tr></thead>`;
    const tbody = data["bustime-response"].vehicle.map((bus) => (
        `<tr><td>${bus.vid}</td><td>${bus.des}</td><td>${bus.lat}</td><td>${bus.lon}</td><td>${bus.spd}</td><td>${bus.pdist/5280}</td></tr>`
    ));
    table.innerHTML = tHead.concat("<tbody>").concat(tbody.join("\n")).concat("</tbody>");

    // This was 100% not taken from the example in the exercise
    const defNotTaken = L.icon({
        iconUrl: 'leaf-green.png',
        shadowUrl: 'leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    });
    // It definitely was

    // adds the bus pin and id to the map for each location
    data["bustime-response"].vehicle.forEach(bus => {
        let marker = L.marker([bus.lat,bus.lon], {icon: defNotTaken});
        marker.addTo(map).bindPopup(bus.vid);
        markers.push(marker);
    })
}


/**
 * Toggles between the program being on or off depending on which button is active
 */
function toggleBus() {
    let start = document.getElementById("start");
    let stop = document.getElementById("stop");
    let input = document.getElementById("filter");

    if (stop.className == "btn btn-danger disabled" && !isON) { // turn on
        start.className = "btn btn-success disabled";
        stop.className = "btn btn-danger";
        input.className = "form-control disabled";

        interval = setInterval(checkBus, 5000);
        isON = true;
    } else if (start.className = "btn btn-success disabled" && isON) { // turn off
        clearInterval(interval);

        markers.forEach(i => map.removeLayer(i)); // Removes all markers

        start.className = "btn btn-success";
        stop.className = "btn btn-danger disabled";
        input.className = "form-control";
        isON = false;
    }
}