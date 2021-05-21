mapboxgl.accessToken = map_token
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: data.features.geometry.coordinates, // starting position [lng, lat]
  zoom: 4, // starting zoom
})

var marker = new mapboxgl.Marker()
  .setLngLat(data.features.geometry.coordinates)
  .addTo(map)
