const express = require('express')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('This is the backend for social media')
});

app.listen(process.env.PORT ||port, () => {
  console.log(` app listening on port ${port}!`)
});