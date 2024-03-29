import axios from 'axios';
import addParams from '@utils/add-params';
import calcDistance from '@utils/calc-distance';


const placeSearch = async (req, res) => {

  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const currentLocation = req.query.location;

  const params = {
    location: currentLocation,
    language: 'ja',
    maxprice: 3,
    minprice: 0,
    opennow: true,
    // pagetoken: '',
    rankby: 'distance',
    // radius: 500,
    type: 'restaurant',
    key: process.env.API_KEY,
  };

  const places = [];
  await axios.get(addParams(url, params))
    .then(response => {
      
      const data = response.data;
      
      for (const result of data.results) {
        const location = result.geometry.location;
        places.push({
          name: result.name,
          // photo: result.photos[0],
          rating: result.rating,
          vicinity: result.vicinity,
          distance: calcDistance(...currentLocation.split(','), location.lat, location.lng),
        });
      }

    })
    .catch(error => {
      console.log({error});
    });

  return res.status(200).json({places: places});

}


export default placeSearch;
