(function(){

//create map and layer in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([42, -97], 3);
    let myLayer;


// create flight icon with size, and anchor numeric values/location markers 
    var flightIcon = L.icon
    ({
        iconUrl: `plane4-45.png`,          
        iconSize:     [40, 40], 
        iconAnchor:   [20,20], 
        popupAnchor:  [0, 0] 
    });


// access and display openstreetmap tiles     
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


// Test popup   
// L.marker([42, -100]).addTo(map)
//     .bindPopup('This is a sample popup. You can put any html structure in this including extra flight data. You can also swap this icon out for a custom icon. Some png files have been provided for you to use if you wish.')
//     .openPopup();


// create page refresh function 
    function flightRefresh() 
    {


// fetch flight data from url `https://opensky-network.org/api/states/all`
        fetch(`https://opensky-network.org/api/states/all`)
            .then(function(response)
            {
                return response.json();
            })
            .then(function(json)
            {  


// verify if myLayer already exisits, if true remove layer 
// remove current layer, so that data can be updated 
            if(myLayer)
            {
                map.removeLayer(myLayer);
            }


// use filter method to isolate in the JSON data all flights originating from Canada 
            let originCanada = json.states.filter(function(flight)
            {
                return flight[2] === `Canada`
            });  
               

// use map method to transform filtered Json data into geoJSON format 
            let geoJson = originCanada.map(function(flight)
            {

// translate boolean to plain English
                function onGround() {
                    let yes = `Yes`;
                    let no = `No`;
                    if(flight[16] === true) 
                    {
                        return flight[8] = yes; 
                    }
                    else 
                    {
                        return flight[8] = no;               
                    }
                }
                onGround();
                
// create geoJSON object with API filtered data points as values
// inside geoJSON object create custom popup
// output to DOM with values of the flight properties using template literals and interpolation 
                return {
                        "type": "Feature",
                        "geometry": 
                        {
                            "type": "Point",
                            "coordinates": [flight[5],flight[6]]                            
                        },
                        "properties": 
                        {
                            "icao":flight[0],
                            "origin_country": flight[2],
                            "time_position":flight[3],
                            "last_contact":flight[4],
                            "baro_altitude":flight[7],
                            "on_groud":flight[8],
                            "velocity":flight[9],
                            "true_track":flight[10],
                            "vertical_rate":flight[11],
                            "sensors":flight[12],
                            "geo_altitude":flight[13],
                            "squawk":flight[14],
                            "spi":flight[15],
                            "position_source":flight[16],
                            "popupContent":                   
                            `<div class='popup' id='flightPopup'>
                            <p><strong>Flight Information</strong></p>
                                    <strong>ICAO:</strong> ${flight[0].toUpperCase()}<br>
                                    <strong>Origin Country:</strong> ${flight[2]}<br>
                                    <strong>Velocity:</strong> ${flight[9]}<br>
                                    <strong>Altitude:</strong> ${flight[9]}<br>
                                    <strong>Coordinates:</strong> (${flight[5]},${flight[6]})<br>
                                    <strong>On Ground:</strong> ${flight[8]}
                            </div>`
                        }
                    }
            }); 
            

// create feature collection for each flight in geoJson format to be output to console
            let featureCollection  = 
            {
                type : "FeatureCollection",
                features : geoJson
            }; 
            console.log(featureCollection);


// create and added a marker to the map (with flight icon and flight angle rotation) for each geoJson feature 
            myLayer = L.geoJSON(geoJson, {onEachFeature: onEachFeature,
                pointToLayer: function(feature,latlng)
                {
                    return L.marker(latlng,{icon:flightIcon,rotationAngle:feature.properties.true_track});
                }
            }).addTo(map);


//create function to enable popup info of each flight
// compare if the feature has a property named popupContent before binding popup content
            function onEachFeature(feature, layer) 
            {
                if (feature.properties && feature.properties.popupContent) 
                {
                    layer.bindPopup(feature.properties.popupContent);                    
                }               
            }
            

// use setTimeout funciton to refresh page every 3.5 seconds
            setTimeout(flightRefresh,3500);   
        }) 
    }


//call refresh function so the data can updated
     flightRefresh();

})();
