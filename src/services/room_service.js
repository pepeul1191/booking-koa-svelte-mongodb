import axios from 'axios';

export const createRoom = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/v1/rooms', params, {
      headers: {
        'Client-Origin': 'webapp',
        'Content-Type': 'application/json',
      }
    }).then(function (response) {
      resolve(response);
    }).catch(function (error) {
      if(error.response.status == 404){
        console.error('Miembro a asociar no existe en el servidor')
      }else{
        console.error(error.response.data);
      }
      reject(error.response);
    })
    .then(function () {
      // todo?
    });
  });
}