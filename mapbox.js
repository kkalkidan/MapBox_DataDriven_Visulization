mapboxgl.accessToken = 'pk.eyJ1Ijoia2Fsa2lkYW4xOTIxIiwiYSI6ImNqcGEzMHVyYzAwbHUzd29md2I4bmFmdG8ifQ.vSOhg7ETCPpD8BcmJfkaKg';

var bounds = [
   [-98.2, 30.0], // Southwest coordinates ,
   [-96.9, 30.6]  // Northeast coordinates ,
];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [-97.75, 30.35], // starting position [lng, lat]
    zoom: 9,// starting zoom
    maxBounds: bounds
});


var color_distict =  [
  "interpolate",
    ["linear"],
    ['get', 'Council District'],
    1, '#fbb03b',
    2, '#223b53',
    3, "#ffe119",
    4, "#fbb03b",
    5, "#f58231",
    6, "#911eb4",
    7, '#e55e5e',
    8, '#f032e6',
    9, '#3bb2d0',
    10,'#fabebe'
]


var color_offence =  [
  'match',
    ['get', 'Highest NIBRS/UCR Offense Description'],
    'Theft', '#fbb03b',
    'Robbery', '#e55e5e',
    'Auto Theft', '#223b53',
    'Agg Assault', "#911eb4",
    'Burglary', '#3bb2d0',
   /* other */ '#fff'
  ]

  // console.log(color_offence.slice(2,))


map.on('load', function () {

    map.addLayer({
      'id': 'crime_data',
      'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kalkidan1921.99xodh49'
        },
        'source-layer': 'Annual_Crime_Dataset_2015with-d4plo1',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[12, 2], [22, 180]]
            },
            'circle-color':color_offence,

            'circle-opacity': 0.8

        }
    });



    map.addLayer({
      'id': 'city_grid',
      'type': 'fill',
        'source': {
            type: 'vector',
            url: 'mapbox://kalkidan1921.42u1pnj2'
        },
        'source-layer': 'City_Grid_data-dbajc2',

        'paint': {
            'fill-opacity': 0.2,

        },
        "light": {
              "anchor": "viewport",
              "color": "white",
              "intensity": 1
            }


    });


});

// add navigation control
map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));

// the feature, with HTML description from its properties
map.on('click', function(e) {   // time: try mouseenter

  var features = map.queryRenderedFeatures(e.point, { layers: ['crime_data'] });

  var grid = map.queryRenderedFeatures(e.point, {layers: ['city_grid']});

  // console.log(features)
  console.log(grid)

  // if the features have no info, return nothing
  if (!features.length) {
    return;
  }

  // console.log(features)


  var feature = features[0];

  // Populate the popup and set its coordinates
  // based on the feature found
  var popup = new mapboxgl.Popup()
  .setLngLat(feature.geometry.coordinates)
  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h5> Detail: </h5>' +
  '<ul class=\'list-group\'>' +
  '<li class=\'list-group-item\'> Date: ' + feature.properties['GO Report Date'] + ' </li>' +
  '<li class=\'list-group-item\'> Offense: ' + feature.properties['GO Highest Offense Desc'] + ' </li>' +
  '<li class=\'list-group-item\'> Location: ' + feature.properties['GO Location'] + ' </li></ul></div>')
  .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'
map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point)  // { layers: ['crime_data'] });
  // console.log(features)
  map.getCanvas().style.cursor = features.length ? 'pointer' : '';
});

var colors =   ["#e6194b", "#3cb44b","#ffe119", "#4363d8", "#f58231",
          "#911eb4", '#46f0f0', '#f032e6','#bcf60c','#fabebe']

var quantiles = []
for (i = 0; i < 10; i++) {
  quantiles.push(i);
}

// var legend = document.getElementById('legend');
//
// quantiles.forEach(function(quantile, i) {
//   legend.insertAdjacentHTML('beforeend', '<div><span style="width:' + 10 + 'px;height:' + 10 + 'px;background-color:' + colors[i] + ';margin: 0 ' + 10+ 'px"></span><p>' + `${quantile + 1}` + '</p></div>');
// });

var legend = document.getElementById('legend');
var i = 2;
 while(i < 12) {
  legend.insertAdjacentHTML('beforeend', '<div><span style="width:' + 10 + 'px;height:' + 10 + 'px;background-color:' + color_offence[i+1] + ';margin: 0 ' + 10+ 'px"></span><p>' + `${color_offence[i]}` + '</p></div>');
  i += 2
};


























//
