$('#name').focus()
$('#other-job').hide();

// Reveals a field if 'other' is selected for the job role
$('#title').on('change', () => {
    const $jobRole = $('#title option:selected').val();
    if ($jobRole === 'other') {
        $('#other-job').show();
    } else {
        $('#other-job').hide();
    }
});

// Disables the 'color' field until a 'theme' is selected 
function disableColor() {
    $('#color').prop('disabled', true);
    $('#color').prepend($('<option id="color-df" selected>Please select a T-shirt theme</option>'));
    $('#select-theme').attr('disabled', true);
}
disableColor();

// when a theme (#design) is selected, reveals all the color under the theme
$('#design').on('change', () => {
    const $designVal = $('#design option:selected').val();

    // when a theme is selected the first color from the list is chosen by default 
    function defaultVal(className) {
        $(className).eq(0).attr('selected', true);
        $('#color').prop('disabled', false);
        $('#color-df').hide();
    }

    // hides all the color options
    $('#color').children().hide();

    // shows colors corresponding to the selected theme
    function showColor(className) {
        $(className).each(function () {
            $(this).show();
        });
        defaultVal(className);
    };

    if ($designVal === 'js puns') {
        showColor('.js-puns')

    } else if ($designVal === 'heart js') {
        showColor('.heart-js')
    };
});

let $totalValue = 0;
// calculates total cost when different activities are selected
$('.activities').on('change', (e) => {
    const $dataCost = parseInt($(e.target).attr('data-cost'))

    // when an event is selected, it hides other events scheduled for the same time  
    function eventConflict(event1, event2) {
        if ($(event1).prop('checked')) {
            $(event2).prop('disabled', true);
            $(event2).parent().css({ color: 'grey' })
        } else {
            $(event2).prop('disabled', false);
            $(event2).parent().css({ color: '' })
        }
    };

    eventConflict('[name="js-frameworks"]', '[name="express"]');
    eventConflict('[name="express"]', '[name="js-frameworks"]');
    eventConflict('[name="js-libs"]', '[name="node"]');
    eventConflict('[name="node"]', '[name="js-libs"]');

    // calculates total cost as events are selected
    if ($(e.target).prop('checked')) {
        $totalValue += $dataCost;
        $('#total').text($totalValue);

    } else {
        $totalValue -= $dataCost;
        $('#total').text($totalValue);
    }

    checkActivities();
});

// credit card is selected as the default payment method
function ccByDefault() {
    $('[value="select method"]').attr('disabled', true);
    $('[value="credit card"]').attr('selected', true);
    $('#paypal').hide();
    $('#bitcoin').hide();
}
ccByDefault();

// when a payment method is selected, it displays the corresponding fields(section)
$('#payment').change(() => {
    const $paymentSelected = $('#payment option:selected').val();

    // hides all payment methods
    function hideAllPayment() {
        $('#credit-card').hide();
        $('#paypal').hide();
        $('#bitcoin').hide();
    }

    hideAllPayment();
    // shows the appropriate filed based on the selected payment method
    if ($paymentSelected === 'credit card') {
        $('#credit-card').show();

    } else if ($paymentSelected === 'paypal') {
        $('#paypal').show();

    } else if ($paymentSelected === 'bitcoin') {
        $('#bitcoin').show();
    }
});

// when the form is submitted it validates all the fields
$('form').on('submit', (e) => {
    e.preventDefault();

    /* removes all 'error' classes associated with credit card fields (cc-num, zip, cvv) 
    if the selected payment option is either paypal or bitcoin*/
    function removeErrorClass(inputID) {
        $(inputID).removeClass('error');
        $(inputID).prev().removeClass('error');
    }
    // validates Name field
    checkName()
    // validates Email field
    checkEmail()
    // checks if at least one activity is selected
    checkActivities()

    // validates 'other' job field if 'other' is selected for the job role
    const $jobSelected = $('#title option:selected').val();
    if ($jobSelected === 'other') {
        checkOtherJob()
    } else {
        removeErrorClass('#other-job')
    }

    // validates the credit card fields only if credit card is selected as a payment option
    const $paymentSelected = $('#payment option:selected').val();
    if ($paymentSelected === 'credit card') {
        checkCreditCard()
        checkZip()
        checkCvv()
    } else {
        removeErrorClass('#cc-num')
        removeErrorClass('#zip')
        removeErrorClass('#cvv')
    }

    // if there is no 'error' class the page reloades
    // if there is error it scrolls to the top most error
    if (($('.error').length) === 0) {
        location.reload(true);
    } else {
        const $topError = $('.error').eq(0);
        $('html, body').animate({
            scrollTop: $($topError).offset().top
        }, 500)
    }
})

// individually validates each form field when focused out
$('form').on('focusout', (e) => {
    if ($(e.target).attr('id') === 'name') {
        checkName()
    } else if ($(e.target).attr('id') === 'mail') {
        checkEmail()
    } else if ($(e.target).attr('id') === 'other-job') {
        checkOtherJob()
    } else if ($(e.target).attr('id') === 'cc-num') {
        checkCreditCard()
    } else if ($(e.target).attr('id') === 'zip') {
        checkZip()
    } else if ($(e.target).attr('id') === 'cvv') {
        checkCvv()
    }
})

// takes an input and compares it against a regex pattern 
function validator(pattern, inputID) {
    const $inputVal = $(inputID).val();
    if (pattern.test($inputVal)) {
        $(inputID).removeClass('error');
        // selects the input label
        $(inputID).prev().removeClass('error');
    } else {
        $(inputID).addClass('error');
        // this selects the label of the input and changes the color to red
        $(inputID).prev().addClass('error');
    }
};

function checkName() {
    const pattern = /^\s*?[a-z]+[a-z, .'-]*$/i
    validator(pattern, '#name');
};

function checkEmail() {
    const pattern = /^[^@]+@[^@.]+\.[a-z]+$/
    validator(pattern, '#mail');
};

function checkOtherJob() {
    const pattern = /^\s*?[a-z]+[a-z, .'-]*$/i
    validator(pattern, '#other-job');
}

function checkActivities() {
    if ($('input:checked').length === 0) {
        $('.activities legend').addClass('error');
    } else {
        $('.activities legend').removeClass('error');
    }
};

function checkCreditCard() {
    const pattern = /^\d{13,16}$/
    validator(pattern, '#cc-num');
};

function checkZip() {
    const pattern = /^\d{5}$/
    validator(pattern, '#zip');
};

function checkCvv() {
    const pattern = /^\d{3}$/
    validator(pattern, '#cvv');
}

