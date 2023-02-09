const inputFullname = document.querySelector("#fullname-inputfield");
const inputEmail = document.querySelector("#email-inputfield");
const inputStreet = document.querySelector("#street-inputfield");
const inputCity = document.querySelector("#city-inputfield");
const checkboxNewsletter = document.querySelector("#checkbox-newsletter");
const confirmBtn = document.querySelector("#confirm-button");

// import { currentCartStatus } from "./menu.js";
// console.log(currentCartStatus)


let pizzas = [];
let allergens = [];
let order = [];
// order = currentCartStatus // doesn't work
console.log(order)
let updatedOrder = {}

// Test order object:
// order = [
//     {
//         "id": 1, 
//         "amount": 1
//     },
//     {
//         "id": 6, 
//         "amount": 2
//     }
// ];
const fetchPizzaList = async () => {
    const list = await fetch("http://localhost:3000/api/pizza");
    const pizzaParsed = await list.json();
    pizzas = pizzaParsed.pizza;

    // pizzasOut.innerText = pizzas;
    // console.log(pizzas);
}

const fetchAllergeneList = async () => {
    const list = await fetch("http://localhost:3000/api/allergens");
    const allergeneParsed = await list.json();
    allergens = allergeneParsed.allergens;
    // allergensOut.innerText = allergens;
    // console.log(allergens);
}

const main = async () => {
    // searchPizza.onclick = fetchPizzaList;
    // searchAllergens.onclick = fetchAllergeneList;
    await fetchPizzaList();
    await fetchAllergeneList();
    getDataFromMenu();
    renderOrderList();
    addEventConfirmBtn();

}

main();

function renderOrderList() {
    const orderListElement = document.querySelector("#order-list");
    let sum = null;
    order.map((pizza) => {
        const filteredPizza = getPizzaByID(pizza.id)
        const pizzaPrice = intlNumberFormat(filteredPizza.price);
        orderListElement.insertAdjacentHTML("beforeend", `
        <p id="allergen-paragraph">${pizza.amount} x ${getPizzaByID(pizza.id).name} ea ${pizzaPrice}</p>
        `)
        sum += (Number(pizza.amount) * Number(filteredPizza.price));
    })
    const totalCost = document.querySelector("#total-cost");
    const sumFormated = intlNumberFormat(sum);
    totalCost.innerText = `Total cost: ${sumFormated}`
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
        console.log(updatedOrder)
        updateUserDataToServer(updatedOrder);

    })
}
async function updateUserDataToServer(object) {
    console.log("POST")
    const response = await fetch("http://localhost:3000/api/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(object),
	});
}

function getDataFromMenu() {
    const orderLocalStorage = window.localStorage.getItem('currentOrder');
    console.log(JSON.parse(orderLocalStorage));
    order = JSON.parse(orderLocalStorage);
}