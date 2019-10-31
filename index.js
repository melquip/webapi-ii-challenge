const server = require('./server');
server.listen(4000, () => {
  console.log('Listening to http://localhost:4000/');
});