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

// color for district legend
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

//color for offence legend
var color_offence =  [
  'match',
    ['get', 'Highest NIBRS/UCR Offense Description'],
    'Theft', '#003f5c',
    'Robbery', '#58508d',
    'Auto Theft', '#bc5090',
    'Agg Assault', "#ff6361",
    'Burglary', '#ffa600',
    'Murder', '#DC143C',
   /* other */ '#000'
  ]

// radius for offence circle radius
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


// months of the year
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


// to filter data by month
  function filterBy(month) {

    var filters = ['==', 'month', month];
    map.setFilter('crime_data_heatmap', filters);


    // Set the label to the month
    document.getElementById('month').textContent = months[month];

  }

  function filterByZip(zip){

    // map.setFilter('crime_data_heatmap', ['match', ['get', 'GO Location Zip'], filtered.map(function(feature) {
    //          return feature.properties.abbrev;
    //      }), true, false]);

  }

  var update_density = document.getElementById('submit');


  function update_crime_data(crime_data){

    var theft = document.getElementById('filter_input_theft').value
    var robbery = document.getElementById('filter_input_robbery').value
    var assalt = document.getElementById('filter_input_assalt').value
    var auto = document.getElementById('filter_input_auto').value
    var burg = document.getElementById('filter_input_burg').value
    var mur = document.getElementById('filter_input_mur').value

    console.log(theft)

    crime_data.features = crime_data.features.map(function(d) {

             if(d.properties ['Highest NIBRS/UCR Offense Description'] == 'Theft')
               d.properties.density = theft != "" ? parseInt(theft) : 0;

             else if(d.properties['Highest NIBRS/UCR Offense Description'] == 'Auto Theft')
                d.properties.density = auto != "" ? parseInt(auto): 0;

             else if(d.properties['Highest NIBRS/UCR Offense Description'] == 'Agg Assault')
                 d.properties.density = assalt != "" ?  parseInt(assalt): 0;

             else if(d.properties['Highest NIBRS/UCR Offense Description'] == 'Burglary')
                 d.properties.density = burg != "" ?  parseInt(burg): 0;

             else if(d.properties['Highest NIBRS/UCR Offense Description'] == 'Robbery')
                 d.properties.density = robbery!= "" ? parseInt(robbery): 0;

             else if(d.properties['Highest NIBRS/UCR Offense Description'] == 'Murder')
                 d.properties.density =  mur!= "" ?  parseInt(mur) : 10;

             return d
             console.log(d)

           })

      console.log(crime_data)
      return crime_data
  }


// on load data
map.on('load', function () {

 // loading data using d3.js
  var q = d3.queue()
            .defer(d3.json, 'dataset/City_Grid_data.geojson')
            .defer(d3.json, 'dataset/travis.json')
            .defer(d3.json, 'dataset/crime_data_final.geojson')
            .await(function(error, grid_data, city_data, crime_data) {

    if(error) throw err;

    crime_data.features = crime_data.features.map(function(d) {

           d.properties.month = new Date(d.properties['GO Report Date']).getMonth();

           // d.properties['GO Location Zip'] = parseInt(d.properties['GO Location Zip'].trim());

           return d

       });
// initial denisty value for the heatmap
   crime_data = update_crime_data(crime_data)


// point visualization of the crime_data
    map.addSource('crime_data', {
            'type': 'geojson',
            'data': crime_data
        });

    //
    // map.addLayer({
    //             'id': 'crime_data_id',
    //             'type': 'circle',
    //             'source': 'crime_data',
    //             'paint': {
    //                 'circle-color': color_offence,
    //                 'circle-opacity': 1,
    //                 'circle-radius': {
    //                 'base': 1.75,
    //                 'stops': [[12, 4], [22, 180]]
    //         }
    //             }
    //         });

// adding grid_data as a source
    map.addSource('grid_data', {
            'type': 'geojson',
            'data': grid_data
        });

// adding grid_data layer
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

// adding city_data as a source  ???
    // map.addSource('city_data', {
    //         'type': 'geojson',
    //         'data': city_data
    //     });

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

    map.addLayer({
        id: 'crime_data_heatmap',
        type: 'heatmap',
        source: 'crime_data',
        maxzoom: 15,
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'density',
            type: 'exponential',
            stops: [
              [1, 0],
              [10, 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          },
        }
      }, 'waterway-label');

  map.addLayer({
     id: 'crime_data_circle',
     type: 'circle',
     source: 'crime_data',
     minzoom: 14,
     paint: {
       // increase the radius of the circle as the zoom level and dbh value increases
       'circle-radius': {
         property: 'density',
         type: 'exponential',
         stops: [
           [{ zoom: 15, value: 1 }, 5],
           [{ zoom: 15, value: 62 }, 10],
           [{ zoom: 22, value: 1 }, 20],
           [{ zoom: 22, value: 62 }, 50],
         ]
       },
       'circle-color': {
         property: 'density',
         type: 'exponential',
         stops: [
           [0, 'rgba(236,222,239,0)'],
           [2, 'rgb(236,222,239)'],
           [3, 'rgb(208,209,230)'],
           [5, 'rgb(166,189,219)'],
           [6, 'rgb(103,169,207)'],
           [7, 'rgb(28,144,153)'],
           [10, 'rgb(1,108,89)']
         ]
       },
       'circle-stroke-color': 'white',
       'circle-stroke-width': 1,
       'circle-opacity': {
         stops: [
           [14, 0],
           [15, 1]
         ]
       }
     }
   }, 'waterway-label');

// getting the value of the slider and filtering data by month
    document.getElementById('slider').addEventListener('input', function(e) {

        var month = parseInt(e.target.value, 10);
        filterBy(month);

  });

    update_density.addEventListener('click', function(e) {

      update_crime_data(crime_data)

      map.getSource('crime_data').setData(crime_data);

  });

  document.getElementById('filter_input_zipcode').addEventListener('keyup', function(e) {

        var zip = e.target.value.trim();

        filterByZip(zip)

  });

});

});        // console.log(map.getStyle().layers)
        // add navigation control
        map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));

        // the feature, with HTML description from its properties
        map.on('click', function(e) {   // time: try mouseenter

          var features = map.queryRenderedFeatures(e.point, { layers: ['crime_data_circle'] });

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
         while(i < 14) {
          legend.insertAdjacentHTML('beforeend', '<div><span style="width:' + 10 + 'px;height:' + 10 + 'px;background-color:' + color_offence[i+1] + ';margin: 0 ' + 10+ 'px"></span><p>' + `${color_offence[i]}` + '</p></div>');
          i += 2
        };


























//
