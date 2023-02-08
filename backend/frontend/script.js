// const { application } = require("express");

// const requestOptions = {
//     method: 'POST',
//     // content-type: "application/json"
//     redirect: 'follow'
//   };
  
//   fetch("http://127.0.0:3000/api/order", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));


let orderList = [];
const cartBtn = document.querySelector(".cart");

const fetchOrderList = async () => {
    const list = await fetch("http://localhost:3000/api/order")
    const orderListParsed = await list.json();
    orderList = orderListParsed
}
const addOrder = async () => {
    const newOrder = {
        id: 1,
        pizzas: [
            {id: 1, amount: 2}
        ],
        date: {
            year: 2022,
            month: 6,
            day: 7,
            hour: 18,
            minute: 47
        },
        customer: {
            name: "John Doe",
            email: "jd@example.com",
            address: {
                city: "Palermo",
                street: "Via Appia 6"
            }
        }
    };
    const response = await fetch("http://localhost:3000/api/order", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newOrder)
    });
    console.log(response)
    const orderListParsed = await response.json();
    orderList = orderListParsed;
    // render 
}

const main = async () => {
    await fetchOrderList();
    console.log(orderList);
    
    cartBtn.addEventListener("click", () => {
        addOrder();
    })
};

main();