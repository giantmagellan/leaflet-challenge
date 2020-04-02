// --------------------------------------
// Import data into JS
// --------------------------------------

// earthquake json url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Performs GET request to the query URL
d3.json(url, function(data) {
    // Sends data.features object to the createFeatures function
    createFeatures(data.features);
  });

// --------------------------------------
// Features and Popups for Earthquakes
// --------------------------------------
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>" + "Magnitude" + " " + feature.properties.mag + "</p>");
  }

  function pointToLayer(geoJsonPoint, latlng) {
    return L.circleMarker(latlng);
  }

  function style(geoJsonFeature) {
    return {
      fillColor: "yellow",
      color: "royalblue",
      weight: 1.5,
      fillOpacity: 0.3, 
      radius: markerSize(geoJsonFeature.properties.mag / 1.5)
    }
  }

  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      style: style
    });
  
    // Sends earthquakes layer to createMap function
    createMap(earthquakes);
}

// --------------------------------------
// Circles with varied radii
// --------------------------------------

function markerSize(earthquakeData) {
  return earthquakeData * 15;
}

// Arrays to hold created markers
var quakeMarkers = [];

// Loop through each feature to create earthquake markers based on magnitude and locations
for (var j = 0; j < features.length; j++) {
  // setting marker radius for the location by passing the magnitude into the markerSize function
  quakeMarkers.push(
    L.circle(features[j].geometry.coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "white",
      fillColor: "white",
      radius: markerSize(features[j].properties.mag)
    })
  );
}

// --------------------------------------
// Function to create earthquake map
// --------------------------------------
function createMap(earthquakes) {

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
  });

  // var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "mapbox.grayscale",
  //   accessToken: API_KEY
  //   });

  // Layer groups
  var quakes = L.layerGroup(quakeMarkers);

  // BaseMaps object to hold base layer
  var baseMaps = {
    // "Street Map": streetmap,
    "Dark Map": darkmap,
    "Outdoors": outdoors,
    "Satellite": satellite
    // "Grayscale": grayscale
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Inital map object with central coordinates at Las Vegas, NV
  var lvMap = L.map("map", {
      center: [36.17, -115.14],
      zoom: 5,
      layers: [darkmap, earthquakes]
    });

  // Outdoors map
  // var mapOutdoors = new mapboxgl.Map({
  //   container: 'map',
  //   style: 'mapbox://styles/mapbox/streets-v11'
  //   });

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(lvMap);

  var legend = L.control({position: "bottomright"});


    
}
