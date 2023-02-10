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
    const orderItemsContainer = document.getElementById("cart-item-container");
    const chosenPizzaID = (e.target.parentNode.id.split(""))[1];
    const chosenPizza = menuForListener[chosenPizzaID - 1];
    if (pizzasInCart.includes(chosenPizza)) {
        const cartAmountOfChosenPizza = document.getElementById(`a${chosenPizzaID}`);
        cartAmountOfChosenPizza.innerHTML = parseInt(cartAmountOfChosenPizza.innerHTML) + 1;
     } else {
        const orderItemTableRow = renderChosenPizzaEl(chosenPizza);
        orderItemsContainer.appendChild(orderItemTableRow);
        pizzasInCart.push(chosenPizza);
    }
    document.getElementById("checkout-btn").disabled = false;
    calculationForCheckout();
    currentCartStatus = updateCheckoutVar();
    window.localStorage.setItem("currentOrder", JSON.stringify(currentCartStatus));
};

async function fetchAndRenderPizzaList() {
    const fetchedData = await fetch("http://127.0.0.1:3000/api/pizza");
    const parsedData = await fetchedData.json();
    parsedData.pizza.map(pizza => displayPizzaElements(pizza));
    return parsedData;
};

document.getElementById("checkout-btn").addEventListener("click", () => {
    window.location.href = "./cart.html";
});

async function displayPizzaElements(pizza) {
    const fetchedAllergenList = await fetch("http://127.0.0.1:3000/api/allergens");
    const parsedAllergenList = await fetchedAllergenList.json();

    const pizzaDiv = document.createElement("div");
    pizzaDiv.setAttribute("class", "pizza");
    pizzaDiv.setAttribute("id", `p${pizza.id}`);
    const pizzaName = document.createElement("h3");
    pizzaName.setAttribute("id", "pizza-name");
    pizzaName.innerHTML = pizza.name;
    const pizzaIngredients = document.createElement("p");
    pizzaIngredients.setAttribute("id", "pizza-ingredients");
    pizzaIngredients.innerHTML = "Ingredients: " + pizza.ingredients.join(" | ");
    const pizzaAll = document.createElement("p");
    pizzaAll.setAttribute("id", "allergenes");
    pizzaAll.innerHTML = fetchAndDisplayAllergens(pizza.allergens, parsedAllergenList.allergens);
    const pizzaPrice = document.createElement("p");
    pizzaPrice.setAttribute("id", "price");
    pizzaPrice.innerHTML = `€ ${pizza.price}`;
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


function renderChosenPizzaEl(pizza) {
    const orderItem = document.createElement("div")
    orderItem.setAttribute("class", "pizza-in-cart");
    orderItem.setAttribute("id", `c${pizza.id}`);
    const itemName = document.createElement("p");
    itemName.setAttribute("class", "item-name");
    itemName.innerHTML = `${pizza.name}`;
    const itemPrice = document.createElement("p");
    itemPrice.setAttribute("class", "item-price");
    itemPrice.innerHTML = `€ ${pizza.price}`;
    const itemAmountDiv = document.createElement("div");
    itemAmountDiv.setAttribute("class", "item-amount-container");
        const amountDownBtn = document.createElement("button");
        amountDownBtn.setAttribute("type", "button");
        amountDownBtn.setAttribute("class", "amount-down");
        amountDownBtn.innerHTML = "-"
        const amountNumber = document.createElement("p");
        amountNumber.setAttribute("class", "item-amount");
        amountNumber.setAttribute("id", `a${pizza.id}`)
        amountNumber.innerHTML = 1;
        const amountUpBtn = document.createElement("button");
        amountUpBtn.setAttribute("type", "button");
        amountUpBtn.setAttribute("class", "amount-up");
        amountUpBtn.innerHTML = "+";
        
    itemAmountDiv.append(amountDownBtn, amountNumber, amountUpBtn);
    orderItem.append(itemName, itemPrice, itemAmountDiv);

    amountDownBtn.addEventListener("click", (e) => {
        e.target.nextElementSibling.innerHTML = e.target.innerHTML === "+" ? parseInt(e.target.nextElementSibling.innerHTML) + 1 : parseInt(e.target.nextElementSibling.innerHTML) - 1;
        if (e.target.nextElementSibling.innerHTML === "0") {
            e.target.parentNode.parentNode.remove();
            [...document.querySelectorAll(".pizza-in-cart")].length > 0 ? document.getElementById("checkout-btn").disabled = false : document.getElementById("checkout-btn").disabled = true;
        }
        calculationForCheckout();
    });
    amountUpBtn.addEventListener("click", (e) => {
        e.target.previousElementSibling.innerHTML = e.target.innerHTML === "+" ? parseInt(e.target.previousElementSibling.innerHTML) + 1 : parseInt(e.target.previousElementSibling.innerHTML) - 1;
        calculationForCheckout();
    });

    return orderItem;
};

function updateCheckoutVar() {
    const cartPositions = [...document.querySelectorAll(".pizza-in-cart")];
    return cartPositions.map(pos => {return makeObject(pos)});
};

function makeObject(pos) {
    const pizzaID = parseInt(pos.id.split("")[1]);
    return {"id": pizzaID, "amount": parseInt(pos.querySelector(`#a${pizzaID}`).innerHTML)};
}

function calculationForCheckout() {
    let subtotal = 0;
    const pizzaDivs = document.querySelectorAll(".pizza-in-cart");
    for (let pizza of pizzaDivs) {
        let price = parseFloat(pizza.querySelector(".item-price").innerHTML.slice(2));
        let amount = parseInt(pizza.querySelector(".item-amount-container").querySelector(".item-amount").innerHTML);
        subtotal += (Math.round(((price * amount) * 100)) / 100)
    };
    document.getElementById("subtotal").innerHTML = subtotal === 0 ? "€ 0.00" : `€ ${subtotal}`;

    let deliveryFee = subtotal >= 15 ? 0.00 : 2.00;
    document.getElementById("delivery-fee").innerHTML = `€ ${deliveryFee}.00`;

    document.getElementById("total").innerHTML = subtotal === 0 ? "€ 0.00" : `€ ${subtotal + deliveryFee}`;
};
