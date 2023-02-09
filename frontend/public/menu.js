const menuList = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const body = document.querySelector("body");
let allergenesList = null;


window.onload = async() => {
    await fetchAndRenderPizzaList();
    await fetchAPIAllergenesList();
    displayEmptyBasket();
    addEventClickToAllergenes();

    const addToCartButton = document.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", (e) => {
        console.log(e.target.parentNode);
    })
};



async function fetchAndRenderPizzaList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/pizza");
    const parsedData = await fetchedData.json();
    parsedData.pizza.map(pizza => displayPizzaElements(pizza));
};

async function displayPizzaElements(pizza) {
    const fetchedAllergenList = await fetch("http://127.0.0.1:3000/api/allergens");
    const parsedAllergenList = await fetchedAllergenList.json();
    menuList.insertAdjacentHTML("beforeend", `
    <div class="pizza" id="p${pizza.id}">
        <p class="pizza-name">${pizza.name}<p>
        <p class="pizza-ingredients">${pizza.ingredients.join(" | ")}</p>
        <p id="allergenes">${fetchAndDisplayAllergens(pizza.allergens, parsedAllergenList.allergens)}</p>
        <p class="price">${pizza.price}</p>
        <button class="add-to-cart" type="button">Add to cart</button>
    </div>`)
};

async function fetchAPIAllergenesList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/allergens")
    const parsedData = await fetchedData.json();
    allergenesList = parsedData;
};

function addEventClickToAllergenes() {
    const allAllergenesElements = document.querySelectorAll("#allergenes");
    allAllergenesElements.forEach((pizzaAllergenes) => {
        pizzaAllergenes.addEventListener("click", (event) => {
            if (event.target.id === "allergenes") {
                const allergeneLetters = pizzaAllergenes.innerText.split(",")
                createWindowAllergenes(allergeneLetters);
            }
        })
    });
    document.addEventListener("click", (event) => {
        if (event.target.id !== "allergenes") {
            removeElement("#window-allergenes");
        }
    })
};

async function createWindowAllergenes(allergenLetters) {
    removeElement("#window-allergenes");
    await body.insertAdjacentHTML("afterbegin", `
        <div id="window-allergenes">
            <h2 id="header-allergenes"> Contains following food allergens </h2>
            <ul id="list-allergenes">
            </ul>
            <footer id="footer-allergenes"> 
                Source: 
                <a href="https://www.wko.at/branchen/tourismus-freizeitwirtschaft/gastronomie/Service_Dokument_Liste_Gesundheit_Kennzeichnungsplichten.pdf">
                    EU-Food Information to Consumers Regulation 
                </a>
            </footer>
        </div>
    `);
    renderAllergenesList(allergenLetters);
};

function getAllergenDescriptionByLetter(letter) {
    const foundAllergenByLetter = allergenesList.find(allergen => allergen.id == letter);
    return foundAllergenByLetter.description;
};

function getAllergenShortnameByLetter(letter) {
    const foundAllergenByLetter = allergenesList.find(allergen => allergen.id == letter);
    const allergenShortName = foundAllergenByLetter.name;
    let capitalizedName = allergenShortName[0].toUpperCase() + allergenShortName.slice(1);
    return capitalizedName;
};

function renderAllergenesList(allergenLetters) {
    const listAllergenes = document.querySelector("#list-allergenes");
    allergenLetters.map((allergenCategory) => {
        listAllergenes.insertAdjacentHTML("beforeend", `
            <li id="list-item-allergenes"><b>${allergenCategory} ${getAllergenShortnameByLetter(allergenCategory)}</b>: ${getAllergenDescriptionByLetter(allergenCategory)} </li>
        `);
    })
};

function removeElement(elementName) {
    if (document.querySelector(elementName)) {
        document.querySelector(elementName).remove();
    }
};

function fetchAndDisplayAllergens(allergensID, allergenList) {   
    const allergenShort = allergensID.map(allergen => allergenList[allergen - 1].category);    
    return allergenShort;
};

function displayEmptyBasket() {
    console.log("work in progress")
}