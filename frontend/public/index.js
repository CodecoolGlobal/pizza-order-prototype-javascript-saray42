const searchPizza = document.getElementById("search-pizzas");
const searchAllergens = document.getElementById("search-allergens");
const pizzasOut = document.getElementById("pizzas");
const allergensOut = document.getElementById("allergens");
const searchInput = document.getElementById("searchInput");
const ingredientsOption = document.getElementById("pizzaDatalist");

let pizzas = [];
let allergens = [];
let ingredients = [];

const fetchPizzaList = async () => {
  const list = await fetch("http://localhost:3000/api/pizza");
  const pizzaParsed = await list.json();
  pizzas = pizzaParsed;
  for (let i = 0; i < pizzas.pizza.length; i++) {
    ingredients.push(pizzas.pizza[i].ingredients);
  }
  // pizzasOut.innerText = pizzas;
};
console.log(ingredients);

const fetchAllergeneList = async () => {
  const list = await fetch("http://localhost:3000/api/allergens");
  const allergeneParsed = await list.json();
  allergens = allergeneParsed.allergens;
  // allergensOut.innerText = allergens;
  // console.log(allergens);
};

const main = async () => {
  // searchPizza.onclick = fetchPizzaList;
  // searchAllergens.onclick = fetchAllergeneList;
  await fetchPizzaList();
  await fetchAllergeneList();
  // console.log(typeof allergens);
  renderAllergenList();
};

function renderAllergenList() {
  const allergenListElement = document.querySelector("#allergen-list");
  allergens.map((allergen) => {
    const allergenShortName = allergen.name;
    const capitalizedName =
      allergenShortName[0].toUpperCase() + allergenShortName.slice(1);
    allergenListElement.insertAdjacentHTML(
      "beforeend",
      `
            <p id="allergen-paragraph"><b>(${allergen.category}) ${capitalizedName}</b> <br> ${allergen.description}</p>
        `
    );
  });
}

////////////////////search event//////////////////////////////

const dataListOptionHTML = `<option value="${ingredients}"></option>`;
searchInput.addEventListener("keyup", async () => {
  ingredientsOption.insertAdjacentHTML("beforeend", dataListOptionHTML);
});

main();
