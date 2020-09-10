// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = Stripe('pk_test_51HJ5XEKBSotCa0cl903XXdpCBIeWGXnB5zJKg4OACpJCVyPizdE6fSpxpJbVGoq1fcI0vWzFf1c3tnwSuAEczdcE00Uh3Nk3C7');
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };
// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Create a paymentMethod when submitted
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  var cardname_Element = document.getElementById('card_name').value;
  stripe.createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: {
      name: cardname_Element,
    }
  })

  //Create a Token
  stripe.createToken(card, {name: cardname_Element}).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token);
  form.appendChild(hiddenInput);
  //alert('Success! Got token: ' + token.id)
  // Insert the token into the form so it gets submitted to the server:
  //form.append($('<input type="hidden" name="stripeToken" />').val(tok));

  // Submit the form:
  form.submit();

};
