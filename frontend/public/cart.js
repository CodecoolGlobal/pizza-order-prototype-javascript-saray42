const searchPizza = document.getElementById("search-pizzas");
const searchAllergens = document.getElementById("search-allergens");
const pizzasOut = document.getElementById("pizzas");
const allergensOut = document.getElementById("allergens")

let pizzas = [];
let allergens = [];
let order = [];
order = {
    "id": 1,
    "pizzas": [
        {
            "id": 1, 
            "amount": 2
        }
    ],
    "date": {
        "year": 2022,
        "month": 6,
        "day": 7,
        "hour": 18,
        "minute": 47
    },
    "customer": {
        "name": "John Doe",
        "email": "jd@example.com",
        "address": {
            "city": "Palermo",
            "street": "Via Appia 6"
        }
    }
};

const fetchPizzaList = async () => {
    const list = await fetch("http://localhost:3000/api/pizza");
    const pizzaParsed = await list.json();
    pizzas = pizzaParsed;
    // pizzasOut.innerText = pizzas;
    // console.log(pizzas);
}

const fetchAllergeneList = async () => {
    const list = await fetch("http://localhost:3000/api/allergens");
    const allergeneParsed = await list.json();
    allergens = allergeneParsed;
    // allergensOut.innerText = allergens;
    // console.log(allergens);
}

const main = async () => {
    // searchPizza.onclick = fetchPizzaList;
    // searchAllergens.onclick = fetchAllergeneList;
    await fetchPizzaList();
    await fetchAllergeneList();
    renderOrderList();
}

main();

function renderOrderList() {
    const orderListElement = document.querySelector("#order-list");
    let sum = null;
    order.pizzas.map((pizza) => {
        // sum = pizza.amount * pizza.price;
        orderListElement.insertAdjacentHTML("beforeend", `
            <p id="allergen-paragraph">${pizza.amount} x ${pizza.id}:  ${sum}</p>
        `)
    })
}