# flightApp
This application was designed to repeatedly fetch real-time flight transit data from an API, then filter the data to only include Canadian data points. The Canadian data points are then displayed on a map using Leaflet.js.

JavaScript was used to fetch fresh JSON data from an API every 3.5 seconds and filter it based on the country of origin. Using the map method to transform the filtered data into a geoJSON object, and then output to DOM values of the flight properties using template literals and interpolation.

This application helped to familiarize myself with the DOM and working with real time dynamic data. It also helped me to have a better understanding of objects and how to manipulate them.


![image](https://user-images.githubusercontent.com/97525044/218126872-0ce54d6e-d3ce-4d55-9e1a-e0807d932fc9.png)
