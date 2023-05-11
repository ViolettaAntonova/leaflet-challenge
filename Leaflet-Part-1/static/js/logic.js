// Create our map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(queryUrl).then(function(data) {

    // create markers
    function createMarker(feature, y) {
        return L.circleMarker(y, {
            opacity: 1,
            fillOpacity: 1,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            radius: feature.properties.mag * 4,
            color: "#000",
            weight: 0.5
        });
    }

    // marker color 
    function markerColor(x) {
        return x > 90 ? '#d73027' :
            x > 70 ? '#fc8d59' :
            x > 50 ? '#fee08b' :
            x > 30 ? '#d9ef8b' :
            x > 10 ? '#91cf60' :
                         '#1a9850' ;   
    };

    //add data to map
    L.geoJson(data, {
        pointToLayer: createMarker,
        // add pop up
       onEachFeature: function (feature, layer) {
           layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    //add legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend'),
            x = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < x.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(x[i] + 1) + '"></i> ' +
                x[i] + (x[i + 1] ? '&ndash;' + x[i + 1] + '<br>' : '+');
        }    
        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
});
