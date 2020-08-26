var stripe = Stripe('pk_test_51HJ5XEKBSotCa0cl903XXdpCBIeWGXnB5zJKg4OACpJCVyPizdE6fSpxpJbVGoq1fcI0vWzFf1c3tnwSuAEczdcE00Uh3Nk3C7');
var elements = stripe.elements();

//var card = elements.create('card');

// Add an instance of the card UI component into the `card-element` <div>
// card.mount('#checkout-form');

var $form = $('#checkout-form');

$form.submit(function(event) {
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    number: $('.card-number').val(),
    cvc: $('.card-cvc').val(),
    exp_month: $('.card-expiry-month').val(),
    exp_year: $('.card-expiry-year').val(),
    name: $('.card_name').val()
  }, stripeResponseHandler);
  return false
});

function stripeResponseHandler(status, response) {
  if (response.error) { // Problem!

    // Show the errors on the form
    $form.find('#charge-error').text(response.error.message);
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();

  }
}
