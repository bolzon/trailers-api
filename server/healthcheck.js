const axios = require('axios');

const healthy = () => process.exit(0);
const unhealthy = () => process.exit(1);

axios({ method: 'get', url: 'http://0.0.0.0:3000/' })
  .then(res => {
    if (res.status === 200)
      healthy();
    else
      unhealthy();
  })
  .catch(err => {
    console.error(err);
    unhealthy();
  });
