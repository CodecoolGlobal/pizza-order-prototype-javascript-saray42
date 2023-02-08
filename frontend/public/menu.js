const menuList = document.querySelector("#menu");
const cart = document.querySelector("#cart");


window.onload = () => {

    fetchAndRenderPizzaList();
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
        <p>${pizza.allergens}</p>
        <p>${pizza.price}</p>
        <button class="addToCart" type="button>"Add to cart"</button>
    </div>`)
};
