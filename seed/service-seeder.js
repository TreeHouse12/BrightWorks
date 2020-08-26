const Service = require('../models/service');
//add
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
         imagePath: '/images/house1.jpeg',
         title: 'House Washing',
         description: 'At Brightworks Maintenance we aim to make the exterior of your house look immaculate. Our products will protect your home from mold and mildew. Most Houses under 1500 sq ft we charge $100',
         price: 100
       }),


      new Service({
        imagePath: '/images/deck2.jpeg',
        title: 'Deck Pressure Washing',
        description: 'Keeping your deck clean not only looks better but also protects from rotting and greying.',
        price: 100
    }),
    new Service({
        imagePath: '/images/driveway2.jpeg',
        title: 'Driveway Pressure Washing',
        description: 'Have your driveway power washed with a the amazing surface scrubber',
        price: 150
    }),
    new Service({
        imagePath: '/images/foamcannon1.jpg',
        title: 'House Pressure Washing',
        description: 'Have a dirty car and don\'t have the time to clean it ? No worries we have you covered.We\'ll come to your home or place of work and clean and detail your vehicle at a reasonable price.',
        price: 350
      }),

    new Service({
        imagePath: '/images/house1.jpeg',
        title: 'Gutter Cleaning',
        description: 'Debris in your gutters can cause problems for rainwater to drain properly. We can clear and clean your gutters.',
        price: 350
      }),

    new Service({
        imagePath: '/images/interior1.jpeg',
        title: 'House Painting',
        description: 'Brightworks also does interior painting.',
        price: 350
      }),
    new Service({
        imagePath: '/images/foamcannon1.jpg',
        title: 'Fleet Washing',
        description: 'We provide fleet washing to keep your trucks sparkling clean.',
        price: 350
      }),
    new Service({
        imagePath: '/images/DeckStain1.jpg',
        title: 'Deck Staining',
        description: 'Staining a deck not only adds to the allure but also value to your home.',
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
  mongoose.disconnect();
}
