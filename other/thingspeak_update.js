const axios = require('axios');

const url = 'https://api.thingspeak.com/update.json';
const apiKey = 'LY0LHQ2N8WEN5LQY';
const fieldValue = 7.670094;
const fieldValue2 = 36.833349;
const fieldValue3 = 27;

axios
  .post(url, null, {
    params: {
      api_key: apiKey,
      field1: fieldValue,
      field2: fieldValue2,
      field3: fieldValue3,
    },
  })
  .then((response) => {
    if (response.data > 0) {
      console.log('Field updated successfully!');
    } else {
      console.log('Failed to update field. Response:', response.data);
    }
  })
  .catch((error) => {
    if (error.response) {
      console.error('Error updating field:', error.response.data);
    } else {
      console.error('Error updating field:', error.message);
    }
  });
