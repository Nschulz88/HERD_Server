
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('events').insert({
          id: 10,
          organizer_id: 1,
          GMaps_API_location: {
                                 "results" : [
                                    {
                                       "address_components" : [
                                          {
                                             "long_name" : "Stanley Park",
                                             "short_name" : "Stanley Park",
                                             "types" : [ "establishment", "park", "point_of_interest" ]
                                          },
                                          {
                                             "long_name" : "Vancouver",
                                             "short_name" : "Vancouver",
                                             "types" : [ "locality", "political" ]
                                          },
                                          {
                                             "long_name" : "Greater Vancouver",
                                             "short_name" : "Greater Vancouver",
                                             "types" : [ "administrative_area_level_2", "political" ]
                                          },
                                          {
                                             "long_name" : "British Columbia",
                                             "short_name" : "BC",
                                             "types" : [ "administrative_area_level_1", "political" ]
                                          },
                                          {
                                             "long_name" : "Canada",
                                             "short_name" : "CA",
                                             "types" : [ "country", "political" ]
                                          },
                                          {
                                             "long_name" : "V6G 1Z4",
                                             "short_name" : "V6G 1Z4",
                                             "types" : [ "postal_code" ]
                                          }
                                       ],
                                       "formatted_address" : "Stanley Park, Vancouver, BC V6G 1Z4, Canada",
                                       "geometry" : {
                                          "location" : {
                                             "lat" : 49.30425839999999,
                                             "lng" : -123.1442522
                                          },
                                          "location_type" : "GEOMETRIC_CENTER",
                                          "viewport" : {
                                             "northeast" : {
                                                "lat" : 49.3056073802915,
                                                "lng" : -123.1429032197085
                                             },
                                             "southwest" : {
                                                "lat" : 49.3029094197085,
                                                "lng" : -123.1456011802915
                                             }
                                          }
                                       },
                                       "place_id" : "ChIJo-QmrYxxhlQRFuIJtJ1jSjY",
                                       "types" : [ "establishment", "park", "point_of_interest" ]
                                    },
                                    {
                                       "address_components" : [
                                          {
                                             "long_name" : "Stanley Park",
                                             "short_name" : "Stanley Park",
                                             "types" : [ "establishment", "park", "point_of_interest" ]
                                          },
                                          {
                                             "long_name" : "400",
                                             "short_name" : "400",
                                             "types" : [ "street_number" ]
                                          },
                                          {
                                             "long_name" : "Western Avenue",
                                             "short_name" : "Western Ave",
                                             "types" : [ "route" ]
                                          },
                                          {
                                             "long_name" : "Westfield",
                                             "short_name" : "Westfield",
                                             "types" : [ "locality", "political" ]
                                          },
                                          {
                                             "long_name" : "Hampden County",
                                             "short_name" : "Hampden County",
                                             "types" : [ "administrative_area_level_2", "political" ]
                                          },
                                          {
                                             "long_name" : "Massachusetts",
                                             "short_name" : "MA",
                                             "types" : [ "administrative_area_level_1", "political" ]
                                          },
                                          {
                                             "long_name" : "United States",
                                             "short_name" : "US",
                                             "types" : [ "country", "political" ]
                                          },
                                          {
                                             "long_name" : "01085",
                                             "short_name" : "01085",
                                             "types" : [ "postal_code" ]
                                          },
                                          {
                                             "long_name" : "2521",
                                             "short_name" : "2521",
                                             "types" : [ "postal_code_suffix" ]
                                          }
                                       ],
                                       "formatted_address" : "Stanley Park, 400 Western Ave, Westfield, MA 01085, USA",
                                       "geometry" : {
                                          "location" : {
                                             "lat" : 42.1243798,
                                             "lng" : -72.78399739999999
                                          },
                                          "location_type" : "ROOFTOP",
                                          "viewport" : {
                                             "northeast" : {
                                                "lat" : 42.1257287802915,
                                                "lng" : -72.78264841970849
                                             },
                                             "southwest" : {
                                                "lat" : 42.1230308197085,
                                                "lng" : -72.7853463802915
                                             }
                                          }
                                       },
                                       "place_id" : "ChIJL1sbscge54kRbxZSJE9kPCM",
                                       "types" : [ "establishment", "park", "point_of_interest" ]
                                    }
                                 ],
                                 "status" : "OK"
                              },
          event_size: 60,
          location: 'Stanley Park',
          event_description: '5k run to defeat smallpox',
          criteria: 'Bring sunscreen it will be hot!',
          event_date: '2016-06-23',
          event_time: '18:30',
          duration: 2
        }),
        knex('events').insert({
          id: 11,
          organizer_id: 2,
          GMaps_API_location: {
                                 "results" : [
                                    {
                                       "address_components" : [
                                          {
                                             "long_name" : "300",
                                             "short_name" : "300",
                                             "types" : [ "subpremise" ]
                                          },
                                          {
                                             "long_name" : "The HiVE",
                                             "short_name" : "The HiVE",
                                             "types" : [ "premise" ]
                                          },
                                          {
                                             "long_name" : "128",
                                             "short_name" : "128",
                                             "types" : [ "street_number" ]
                                          },
                                          {
                                             "long_name" : "West Hastings Street",
                                             "short_name" : "W Hastings St",
                                             "types" : [ "route" ]
                                          },
                                          {
                                             "long_name" : "Central",
                                             "short_name" : "Central",
                                             "types" : [ "neighborhood", "political" ]
                                          },
                                          {
                                             "long_name" : "Vancouver",
                                             "short_name" : "Vancouver",
                                             "types" : [ "locality", "political" ]
                                          },
                                          {
                                             "long_name" : "Greater Vancouver",
                                             "short_name" : "Greater Vancouver",
                                             "types" : [ "administrative_area_level_2", "political" ]
                                          },
                                          {
                                             "long_name" : "British Columbia",
                                             "short_name" : "BC",
                                             "types" : [ "administrative_area_level_1", "political" ]
                                          },
                                          {
                                             "long_name" : "Canada",
                                             "short_name" : "CA",
                                             "types" : [ "country", "political" ]
                                          },
                                          {
                                             "long_name" : "V6B 1G8",
                                             "short_name" : "V6B 1G8",
                                             "types" : [ "postal_code" ]
                                          }
                                       ],
                                       "formatted_address" : "The HiVE, 128 W Hastings St #300, Vancouver, BC V6B 1G8, Canada",
                                       "geometry" : {
                                          "location" : {
                                             "lat" : 49.2819163,
                                             "lng" : -123.1083174
                                          },
                                          "location_type" : "ROOFTOP",
                                          "viewport" : {
                                             "northeast" : {
                                                "lat" : 49.2832652802915,
                                                "lng" : -123.1069684197085
                                             },
                                             "southwest" : {
                                                "lat" : 49.2805673197085,
                                                "lng" : -123.1096663802915
                                             }
                                          }
                                       },
                                       "place_id" : "ChIJVVVFhnlxhlQRVqDISA_7Lc8",
                                       "types" : [ "establishment", "point_of_interest" ]
                                    }
                                 ],
                                 "status" : "OK"
                              },
          event_size: 500,
          location: 'Lighthouse Labs',
          event_description: 'Birdwatching',
          criteria: 'BYOBinoculars',
          event_date: '2019-12-14',
          event_time: '13:30',
          duration: 6
        }),
        knex('events').insert({
          id: 12,
          organizer_id: 3,
          GMaps_API_location: {
                                 "results" : [
                                    {
                                       "address_components" : [
                                          {
                                             "long_name" : "2329",
                                             "short_name" : "2329",
                                             "types" : [ "street_number" ]
                                          },
                                          {
                                             "long_name" : "West Mall",
                                             "short_name" : "West Mall",
                                             "types" : [ "route" ]
                                          },
                                          {
                                             "long_name" : "Vancouver",
                                             "short_name" : "Vancouver",
                                             "types" : [ "locality", "political" ]
                                          },
                                          {
                                             "long_name" : "Greater Vancouver A",
                                             "short_name" : "Greater Vancouver A",
                                             "types" : [ "administrative_area_level_3", "political" ]
                                          },
                                          {
                                             "long_name" : "Greater Vancouver",
                                             "short_name" : "Greater Vancouver",
                                             "types" : [ "administrative_area_level_2", "political" ]
                                          },
                                          {
                                             "long_name" : "British Columbia",
                                             "short_name" : "BC",
                                             "types" : [ "administrative_area_level_1", "political" ]
                                          },
                                          {
                                             "long_name" : "Canada",
                                             "short_name" : "CA",
                                             "types" : [ "country", "political" ]
                                          },
                                          {
                                             "long_name" : "V6T 1Z4",
                                             "short_name" : "V6T 1Z4",
                                             "types" : [ "postal_code" ]
                                          }
                                       ],
                                       "formatted_address" : "2329 West Mall, Vancouver, BC V6T 1Z4, Canada",
                                       "geometry" : {
                                          "location" : {
                                             "lat" : 49.26060520000001,
                                             "lng" : -123.2459938
                                          },
                                          "location_type" : "ROOFTOP",
                                          "viewport" : {
                                             "northeast" : {
                                                "lat" : 49.26195418029151,
                                                "lng" : -123.2446448197085
                                             },
                                             "southwest" : {
                                                "lat" : 49.25925621970851,
                                                "lng" : -123.2473427802915
                                             }
                                          }
                                       },
                                       "place_id" : "ChIJAx7UL8xyhlQR86Iqc-fUncc",
                                       "types" : [ "establishment", "point_of_interest", "university" ]
                                    }
                                 ],
                                 "status" : "OK"
                              },
          event_size: 10,
          location: 'UBC Campus',
          event_description: 'Swimming in the fountain for charity',
          criteria: 'Get a tetanus shot that water nastay',
          event_date: '2018-02-11',
          event_time: '18:30',
          duration: 3
        }),
      ]);
    });
};
