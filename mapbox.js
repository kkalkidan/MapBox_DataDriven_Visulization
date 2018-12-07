mapboxgl.accessToken = 'pk.eyJ1Ijoia2Fsa2lkYW4xOTIxIiwiYSI6ImNqcGEzMHVyYzAwbHUzd29md2I4bmFmdG8ifQ.vSOhg7ETCPpD8BcmJfkaKg';

var bounds = [
   [-98.2, 30.0], // Southwest coordinates ,
   [-97.2, 30.6]  // Northeast coordinates ,
];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [-97.75, 30.35], // starting position [lng, lat]
    zoom: 12,// starting zoom
    maxBounds: bounds
});


var color_district =  [
  "interpolate",
    ["linear"],
    ['get', 'Council District'],
    1, "#e6194b",
    2,  "#3cb44b",
    3, "#ffe119",
    4, "#4363d8",
    5,  "#f58231",
    6,"#911eb4",
    7, '#46f0f0',
    8,'#f032e6',
    9, '#bcf60c',
    10, '#7F3121'
]


var color_offence =  [
  'match',
    ['get', 'Highest NIBRS/UCR Offense Description'],
    'Theft', '#003f5c',
    'Robbery', '#58508d',
    'Auto Theft', '#bc5090',
    'Agg Assault', "#ff6361",
    'Burglary', '#ffa600',
   /* other */ '#000'
  ]

  // var radius_offence =  [
  //   'interpolate',
  //    ['linear'],
  //     ['get', 'Highest NIBRS/UCR Offense Description'],
  //     1, 10,
  //     2, 20,
  //     3, 30,
  //     4, 50,
  //     5, 40
  //   ]



  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

  // console.log(color_offence.slice(2,))


  function filterBy(month) {

    var filters = ['==', 'month', month];
    map.setFilter('crime_data_id', filters);
    // map.setFilter('earthquake-labels', filters);

    // Set the label to the month
    document.getElementById('month').textContent = months[month];

  }


  var q = d3.queue()
            .defer(d3.json, 'dataset/City_Grid_data.geojson')
            .defer(d3.json, 'dataset/travis.json')
            .defer(d3.json, 'dataset/crime_data_final.geojson')
            .await(function(error, grid_data, city_data, crime_data) {

    if(error) throw err;


    crime_data.features = crime_data.features.map(function(d) {
            d.properties.month = new Date(d.properties['GO Report Date']).getMonth();
            return d
        });



    console.log(crime_data.features)


    map.addSource('crime_data', {
            'type': 'geojson',
            'data': crime_data
        });

    map.addLayer({
                'id': 'crime_data_id',
                'type': 'circle',
                'source': 'crime_data',
                'paint': {
                    'circle-color': color_offence,
                    'circle-opacity': 1,
                    'circle-radius': {
                    'base': 1.75,
                    'stops': [[12, 4], [22, 180]]
            }
                }
            });

    map.addSource('grid_data', {
            'type': 'geojson',
            'data': grid_data
        });

    map.addLayer({
              'id': 'grid_data_id',
              'type': 'line',
                'source': 'grid_data',
                'paint': {
                    'line-width': 0.1,

                },
                "light": {
                      "anchor": "viewport",
                      "color": "white",
                      "intensity": 1
                    }


    });

    map.addSource('city_data', {
            'type': 'geojson',
            'data': city_data
        });

    document.getElementById('slider').addEventListener('input', function(e) {
        var month = parseInt(e.target.value, 10);
        filterBy(month);
    });


    // map.addLayer({
    //           'id': 'city_data_id',
    //           'type': 'line',
    //             'source': 'city_data',
    //             'paint': {
    //                 'line-width': 0.5,
    //
    //             },
    //             "light": {
    //                   "anchor": "viewport",
    //                   "color": "white",
    //                   "intensity": 1
    //                 }
    //
    //
    // });



        // console.log(map.getStyle().layers)
        // add navigation control
        map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));

        // the feature, with HTML description from its properties
        map.on('click', function(e) {   // time: try mouseenter

          var features = map.queryRenderedFeatures(e.point, { layers: ['crime_data_id'] });

          var grid = map.queryRenderedFeatures(e.point, {layers: ['grid_data_id']});

          // console.log(features)
          // console.log(grid)

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

        // var quantiles = []
        // for (i = 0; i < 10; i++) {
        //   quantiles.push(i);
        // }
        //
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

});
























//
