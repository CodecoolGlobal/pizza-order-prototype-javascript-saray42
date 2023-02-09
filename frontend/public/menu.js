const menuList = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const body = document.querySelector("body");
let allergenesList = null;
// export let currentCartStatus = [];
let currentCartStatus = [];

window.onload = async() => {
    let menu = await fetchAndRenderPizzaList();
    await fetchAPIAllergenesList();
    displayEmptyBasket();
    addEventClickToAllergenes();
    let pizzasInCart = [];

    const addToCartButton = document.querySelectorAll(".add-to-cart");
    for (let button of addToCartButton) {
        button.addEventListener("click", (e) => {
            const orderItemTable = document.getElementById("cart-table");
            const chosenPizzaID = (e.target.parentNode.id.split(""))[1];
            const chosenPizza = menu.pizza[chosenPizzaID - 1];
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

            console.log(currentCartStatus);
        })
    };
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
     `<tr class="pizza-in-cart" id="c${pizza.id}">
                <td>${pizza.name}</td>
                <td>${pizza.price}</td>
                <td>
                    <button type="button" class="amount-down" >-</button>
                    ${1}
                    <button type="button" class="amount-up">+</button>
                </td>
            </tr>`

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
