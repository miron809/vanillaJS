const currencyEl_one = document.getElementById('currency-one');
const currencyEl_two = document.getElementById('currency-two');
const amountInput_one = document.getElementById('amount-one');
const amountInput_two = document.getElementById('amount-two');
const swap = document.getElementById('swap');
const rate = document.getElementById('rate');

function calculate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
        .then(response => response.json())
        .then(data => {
            const rateData = data.rates[currency_two];

            rate.innerText = `1 ${currency_one} = ${rateData} ${currency_two}`;

            amountInput_two.value = (amountInput_one.value * rateData).toFixed(2);
        })
}

currencyEl_one.addEventListener('change', calculate);
currencyEl_two.addEventListener('change', calculate);
amountInput_one.addEventListener('input', calculate);
amountInput_two.addEventListener('input', calculate);
swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    calculate();
});

calculate();
