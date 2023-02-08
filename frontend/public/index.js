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
    renderAllergenList();
}

main();

function renderAllergenList() {
    const allergenListElement = document.querySelector("#allergen-list");
    allergens.map((allergen) => {
        const allergenShortName = allergen.name;
        const capitalizedName = allergenShortName[0].toUpperCase() + allergenShortName.slice(1);
        allergenListElement.insertAdjacentHTML("beforeend", `
            <p id="allergen-paragraph"><b>(${allergen.category}) ${capitalizedName}</b>: <br> ${allergen.description}</p>
        `)
    })
}
