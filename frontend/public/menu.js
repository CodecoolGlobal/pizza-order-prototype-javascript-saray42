const menuList = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const body = document.querySelector("body");
let allergenesList = null;


window.onload = async() => {
    await fetchAndRenderPizzaList();
    await fetchAPIAllergenesList();
    addEventClickToAllergenes();
};



async function fetchAndRenderPizzaList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/pizza");
    const parsedData = await fetchedData.json();
    parsedData.pizza.map(pizza => displayPizzaElements(pizza));
};

function displayPizzaElements(pizza) {
    menuList.insertAdjacentHTML("beforeend", `
    <div class="pizza">
        <h2>${pizza.name}<h2>
        <p>${pizza.ingredients}</p>
        <p id="allergenes">${pizza.allergens}</p>
        <p>${pizza.price}</p>
        <button class="addToCart" type="button">Add to cart</button>
    </div>`)
};

async function fetchAPIAllergenesList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/allergens")
    const parsedData = await fetchedData.json();
    allergenesList = parsedData;
}

function addEventClickToAllergenes() {
    const allAllergenesElements = document.querySelectorAll("#allergenes");
    allAllergenesElements.forEach((pizzaAllergenes) => {
        pizzaAllergenes.addEventListener("click", (event) => {
            const allergeneLetters = pizzaAllergenes.innerText.split(",")
            createWindowAllergenes(allergeneLetters)
        })
    });
}

async function createWindowAllergenes(allergenLetters) {
    if (document.querySelector("#window-allergenes")) {
        document.querySelector("#window-allergenes").remove();
    }
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
}

function getAllergenDescriptionByLetter(letter) {
    const foundAllergenByLetter = allergenesList.find(allergen => allergen.id == letter);
    return foundAllergenByLetter.description;
}
function renderAllergenesList(allergenLetters) {
    const listAllergenes = document.querySelector("#list-allergenes");
    allergenLetters.map((allergenCategory) => {
        listAllergenes.insertAdjacentHTML("beforeend", `
            <li id="list-item-allergenes"><b>${allergenCategory}</b>: ${getAllergenDescriptionByLetter(allergenCategory)} </li>
        `);
    })
}