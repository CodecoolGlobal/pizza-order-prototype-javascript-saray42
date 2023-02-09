const inputFullname = document.querySelector("#fullname-inputfield");
const inputEmail = document.querySelector("#email-inputfield");
const inputStreet = document.querySelector("#street-inputfield");
const inputCity = document.querySelector("#city-inputfield");
const checkboxNewsletter = document.querySelector("#checkbox-newsletter");
const confirmBtn = document.querySelector("#confirm-button");
const deliveryFee = 2.00;

let pizzas = [];
let allergens = [];
let order = null;
let updatedOrder = {};

const main = async () => {
    await fetchPizzaList();
    await fetchAllergeneList();
    getDataFromMenu();
    renderOrderList();
    addEventConfirmBtn();
}
main();

async function fetchPizzaList() {
    const list = await fetch("http://localhost:3000/api/pizza");
    const pizzaParsed = await list.json();
    pizzas = pizzaParsed.pizza;
}

async function fetchAllergeneList() {
    const list = await fetch("http://localhost:3000/api/allergens");
    const allergeneParsed = await list.json();
    allergens = allergeneParsed.allergens;
}

function renderOrderList() {
    const orderListElement = document.querySelector("#order-list");
    let sum = deliveryFee;
    order.map((pizza) => {
        const filteredPizza = getPizzaByID(pizza.id)
        const pizzaPriceSum = filteredPizza.price * pizza.amount
        
        orderListElement.insertAdjacentHTML("beforeend", `
        <tr>
            <td align=left >${getPizzaByID(pizza.id).name}</td>
            <td align=right >${pizza.amount} x</td>
            <td align=right >${intlNumberFormat(filteredPizza.price)}</td>
            <td align=right >${intlNumberFormat(pizzaPriceSum)}</td>
        </tr>
        `)
        sum += (Number(pizza.amount) * Number(filteredPizza.price));
    })

    orderListElement.insertAdjacentHTML("beforeend", `
    <tr>
        <td align=left >Delivery fee</td>
        <td align=right > - </td>
        <td align=right > - </td>
        <td align=right > ${intlNumberFormat(deliveryFee)}</td>
    </tr>
    <tr>
        <td align=left ><h3> Total </h3></td>
        <td align=right > </td>
        <td align=right > </td>
        <td align=right ><h3> ${intlNumberFormat(sum)} </h3></td>
    </tr>
    `)
}

function getPizzaByID(searchID) {
    const foundPizza = pizzas.find(pizza => pizza.id == searchID);
    return foundPizza;
}

function intlNumberFormat(number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'EUR' }).format(number);
}

function addEventConfirmBtn() {
    confirmBtn.addEventListener("click", () => {
        const currentDate = new Date();
        const dateData = {
            "year": currentDate.getFullYear(),
            "month": currentDate.getMonth(),
            "day": currentDate.getDay(),
            "hour": currentDate.getHours(),
            "minute": currentDate.getMinutes(),
        };

        const costumerData = {
            "name": inputFullname.value,
            "email": inputEmail.value,
            "adress": {
                "street": inputStreet.value,
                "city": inputCity.value,
            },
            "newsletter": checkboxNewsletter.checked,
        };

        updatedOrder = {
            "id": null,
            "pizzas": order,
            "date": dateData,
            "customer": costumerData,
        };
        renderDeliveryScreen();
        updateUserDataToServer(updatedOrder);
    })
}

async function updateUserDataToServer(object) {
    const response = await fetch("http://localhost:3000/api/order", {
		method: "POST",
		headers: {"Content-Type": "application/json",},
		body: JSON.stringify(object),
	});
}

function getDataFromMenu() {
    const orderLocalStorage = window.localStorage.getItem('currentOrder');
    order = JSON.parse(orderLocalStorage);
}

function renderDeliveryScreen() {
    const cartContainer = document.querySelector("#cart-container");
    const deliveryContainer = document.querySelector("#delivery-container");
    cartContainer.style.display = "none";
    deliveryContainer.style.display = "";
}