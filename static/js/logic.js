function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [36.759337, -120.336080],
    zoom: 6,
    layers: [streetmap, lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var quakes = response.features;

  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  // Loop through the quake array
  for (var index = 0; index < quakes.length; index++) {
    var quake = quakes[index];
    var color = "";
    if (quake.properties.mag > 5) {
      color = "#800026";
    }
    else if (quake.properties.mag > 4) {
      color = "#BD0026";
    }
    else if (quake.properties.mag> 3) {
      color = "#E31A1C";
    }
    else if (quake.properties.mag > 2) {
      color = "#FC4E2A";
    }
    else if (quake.properties.mag> 1) {
      color = "#FD8D3C";
    }
    else {
      color = "#FEB24C";
    }
    // For each quake, create a marker and bind a popup with the quake's name
    var quakeCircle = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
      fillOpacity: 1,
      color: "none",
      fillColor: color,
      // Adjust radius
      radius: quake.properties.mag * 10000
    }).bindPopup("<h3>" + quake.properties.title + "<h3><h3>Magnitude: " + quake.properties.mag + "<h3>");
  
    
    
    // L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
    //   .bindPopup("<h3>" + quake.properties.title + "<h3><h3>Magnitude: " + quake.properties.mag + "<h3>");

    // Add the marker to the quakeCircle array
    quakeMarkers.push(quakeCircle);
  }

  // Create a layer group made from the quake markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));
}


// Perform an API call to the Earthquake API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
