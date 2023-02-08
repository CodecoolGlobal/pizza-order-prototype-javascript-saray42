const searchPizza = document.getElementById("search-pizzas");
const searchAllergens = document.getElementById("search-allergens");
const pizzasOut = document.getElementById("pizzas");
const allergensOut = document.getElementById("allergens")

let pizzas = [];
let allergens = [];

const fetchPizzaList = async () => {
    const list = await fetch("http://localhost:3000/api/pizza");
    const pizzaParsed = await list.json();
    pizzas = pizzaParsed;
    pizzasOut.innerText = pizzas;
    console.log(pizzas);
}

const fetchAllergeneList = async () => {
    const list = await fetch("http://localhost:3000/api/allergens");
    const allergeneParsed = await list.json();
    allergens = allergeneParsed;
    allergensOut.innerText = allergens;
    console.log(allergens);
}

const main = () => {
    searchPizza.onclick = fetchPizzaList;
    searchAllergens.onclick = fetchAllergeneList;
}

main();

