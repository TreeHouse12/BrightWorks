var Service = require('../models/service');

var mongoose = require('mongoose');
//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
 },
() => console.log('reconnected to DB for Shopping!')
);

var service = [
    new Service({
        imagePath: '/images/deck2.jpeg',
        title: 'Deck Pressure Washing',
        description: 'Very Clean Desk!!!!!',
        price: 100
    }),
    new Service({
        imagePath: '/images/driveway2.jpeg',
        title: 'Driveway Pressure Washing',
        description: 'Extremely Clean Driveway!!!!!',
        price: 150
    }),
    new Service({
        imagePath: '/images/house1.jpeg',
        title: 'House Pressure Washing',
        description: 'Exceptionally Clean House!!!!!',
        price: 350
    }),
];

var done = 0;
for (var i =0; i < services.length; i++) {
  services[i].save(function (err, result) {
      done++;
      if (done === services.length) {
          exit();
      }
  });
}

function exit() {
  mongoose.disconnnect();
}
