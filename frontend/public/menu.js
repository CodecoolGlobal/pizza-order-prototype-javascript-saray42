const menuList = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const body = document.querySelector("body");
let allergenesList = null;
let currentCartStatus = [];
let menuForListener = [];
let pizzasInCart = [];

window.onload = async() => {
    const menu = await fetchAndRenderPizzaList();
    menuForListener = menu.pizza;
    await fetchAPIAllergenesList();
    displayEmptyBasket();
    addEventClickToAllergenes();
    let possibleMenu = menu.pizza;
    let filteredAllergens = []

    const filterCheckbox = document.querySelectorAll(".allergen-box")
    for (let checkbox of filterCheckbox) {
        checkbox.addEventListener("click", (e) => {
            let allergenIdNumber = parseInt(e.target.id.split("").splice(3).join(""));
            checkbox.checked ? filteredAllergens.push(allergenIdNumber) : filteredAllergens.splice(filteredAllergens.indexOf(allergenIdNumber), 1);
            for (let allergen of filteredAllergens) {
                possibleMenu = possibleMenu.filter(pizza => !pizza.allergens.includes(allergen));
            }
            [...document.querySelectorAll(".pizza")].map(pizza => pizza.remove());
            possibleMenu.map(pizza => displayPizzaElements(pizza));

            possibleMenu = menu.pizza;
        })
    }
};

function listenerAddToCart(e) {
    const orderItemTable = document.getElementById("cart-table");
    const chosenPizzaID = (e.target.parentNode.id.split(""))[1];
    const chosenPizza = menuForListener[chosenPizzaID - 1];
    if (pizzasInCart.includes(chosenPizza)) {
        const cartAmountOfChosenPizza = document.getElementById(`a${chosenPizzaID}`);
        cartAmountOfChosenPizza.innerHTML = parseInt(cartAmountOfChosenPizza.innerHTML) + 1;
     } else {
        const orderItemTableRow = renderChosenPizzaEl(chosenPizza);
        orderItemTable.appendChild(orderItemTableRow);
        pizzasInCart.push(chosenPizza);
    }
    currentCartStatus = updateCheckoutVar();
    window.localStorage.setItem("currentOrder", JSON.stringify(currentCartStatus));
};

async function fetchAndRenderPizzaList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/pizza");
    const parsedData = await fetchedData.json();
    parsedData.pizza.map(pizza => displayPizzaElements(pizza));
    return parsedData;
};

async function displayPizzaElements(pizza) {
    const fetchedAllergenList = await fetch("http://127.0.0.1:3000/api/allergens");
    const parsedAllergenList = await fetchedAllergenList.json();

    const pizzaDiv = document.createElement("div");
    pizzaDiv.setAttribute("class", "pizza");
    pizzaDiv.setAttribute("id", `p${pizza.id}`);
    const pizzaName = document.createElement("p");
    pizzaName.setAttribute("id", "pizza-name");
    pizzaName.innerHTML = pizza.name;
    const pizzaIngredients = document.createElement("p");
    pizzaIngredients.setAttribute("id", "pizza-ingredients");
    pizzaIngredients.innerHTML = pizza.ingredients.join(" | ");
    const pizzaAll = document.createElement("p");
    pizzaAll.setAttribute("id", "allergens");
    pizzaAll.innerHTML = fetchAndDisplayAllergens(pizza.allergens, parsedAllergenList.allergens);
    const pizzaPrice = document.createElement("p");
    pizzaPrice.setAttribute("id", "price");
    pizzaPrice.innerHTML = pizza.price;
    const toCartBtn = document.createElement("button");
    toCartBtn.setAttribute("id", "add-to-cart");
    toCartBtn.setAttribute("type", "button");
    toCartBtn.innerHTML = "Add to cart";

    toCartBtn.addEventListener("click", listenerAddToCart);

    pizzaDiv.append(pizzaName, pizzaIngredients, pizzaAll, pizzaPrice, toCartBtn);
    menuList.appendChild(pizzaDiv);

};

async function fetchAPIAllergenesList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/allergens")
    const parsedData = await fetchedData.json();
    allergenesList = parsedData.allergens;
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
    body.insertAdjacentHTML("afterbegin", `
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
    const foundAllergenByLetter = allergenesList.find(allergen => allergen.category == letter);
    return foundAllergenByLetter.description;
};

function getAllergenShortnameByLetter(letter) {
    const foundAllergenByLetter = allergenesList.find(allergen => allergen.category == letter);
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
};

function renderChosenPizzaEl(pizza) {

    const tableRow = document.createElement("tr");
    tableRow.setAttribute("class", "pizza-in-cart");
    tableRow.setAttribute("id", `c${pizza.id}`);

    const nameCell = document.createElement("td");
    nameCell.innerHTML = `${pizza.name}`;

    const priceCell = document.createElement("td");
    nameCell.innerHTML = `${pizza.price}`;

    const amountCell = document.createElement("td");

    const amountDownBtn = document.createElement("button");
    amountDownBtn.setAttribute("type", "button");
    amountDownBtn.setAttribute("class", "amount-down");
    amountDownBtn.innerHTML = "-"

    const amountNumber = document.createElement("p");
    amountNumber.setAttribute("id", `a${pizza.id}`)
    amountNumber.innerHTML = 1;

    const amountUpBtn = document.createElement("button");
    amountUpBtn.setAttribute("type", "button");
    amountUpBtn.setAttribute("class", "amount-up");
    amountUpBtn.innerHTML = "+";

    amountCell.append(amountDownBtn, amountNumber, amountUpBtn);

    tableRow.append(nameCell, priceCell, amountCell);

    amountDownBtn.addEventListener("click", (e) => {
        e.target.nextElementSibling.innerHTML = e.target.innerHTML === "+" ? parseInt(e.target.nextElementSibling.innerHTML) + 1 : parseInt(e.target.nextElementSibling.innerHTML) - 1;
        console.log(e.target.nextElementSibling.innerHTML)
        if (e.target.nextElementSibling.innerHTML === "0") {
            console.log(0)
            e.target.parentNode.parentNode.remove();
        }
    });
    amountUpBtn.addEventListener("click", (e) => {
        e.target.previousElementSibling.innerHTML = e.target.innerHTML === "+" ? parseInt(e.target.previousElementSibling.innerHTML) + 1 : parseInt(e.target.previousElementSibling.innerHTML) - 1;
    });

    return tableRow;
};

function updateCheckoutVar() {
    const cartPositions = [...document.querySelectorAll(".pizza-in-cart")];
    return cartPositions.map(pos => {return makeObject(pos)});
};

function makeObject(pos) {
    const pizzaID = parseInt(pos.id.split("")[1]);
    return {"id": pizzaID, "amount": parseInt(pos.querySelector(`#a${pizzaID}`).innerHTML)};
}
