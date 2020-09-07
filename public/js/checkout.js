// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(process.env.PUB_KEY);
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    // Add your base input styles here. For example:
    fontSize: '16px',
    color: '#32325d',
  },
};
//Get Doc by ID
var cardNameElement = doc.getElementById("card-name");

// Create an instance of the card Element.
var cardNumber = elements.create('cardNumber', {});
var cardExpiry = elements.create('cardExpiry', {});
var cardCvc = elements.create('cardCvc', {});
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
cardNumber.mount('#card-number-element');
cardExpiry.mount('#card-expiry-element');
cardCvc.mount('#card-cvc-element');
card.mount('#card-element');

//registerElements([cardNumber, cardAddress, cardName, cardExpiryMonth, cardExpiryYear, cardCvc]);

var $form = $('#checkout-form');

$form.submit(function(event) {
  $('#charge-error').addClass('hidden');
  $form.find('button').prop('disabled', true);
  Stripe.setPublishableKey($form.data(process.env.PUB_KEY));
  Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  }, stripeResponseHandler);
  return false
});

function stripeResponseHandler(status, response) {
  if (response.error) { // Problem!

    // Show the errors on the form
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
    location.reload();

  }
}
