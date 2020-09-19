const Service = require('../models/service');

const mongoose = require('mongoose');
//Connect to DB
mongoose.connect('mongodb+srv://testboy:Rhino94@cluster0-a7yut.mongodb.net/test?retryWrites=true&w=majority',
{
useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true
},
() => console.log('connected to DB for Shopping Cart!')
);

var services = [
    new Service({
        imagePath: '/images/deck2.jpeg',
        title: 'Deck Pressure Washing',
        description: 'Have your deck power washed with detergent and full rinse.',
        price: 100
    }),
    new Service({
        imagePath: '/images/driveway2.jpeg',
        title: 'Driveway Pressure Washing',
        description: 'Have your driveway power washed with a the amazing surface scrubber.',
        price: 150
    }),
    new Service({
        imagePath: '/images/house1.jpeg',
        title: 'House Pressure Washing',
        description: 'Have your house softwashed with detergent and rinse.',
        price: 350
    }),
    new Service({
        imagePath: '/images/foamcannon1.jpeg',
        title: 'Detailing Cars',
        description: 'Have your car professionally detailed inside and out.',
        price: 250
    }),
    new Service({
        imagePath: '/images/DeckStain1.jpeg',
        title: 'Deck Staining',
        description: 'Have your deck stained.',
        price: 350
    }),
    new Service({
        imagePath: '/images/interior1.jpeg',
        title: 'Interior House Painting',
        description: 'Have us paint your house',
        price: 200
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
  mongoose.disconnect();
}
