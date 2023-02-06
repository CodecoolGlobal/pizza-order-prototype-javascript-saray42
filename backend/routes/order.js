const express = require("express");
const router = express.Router();

const orderList = null;


router
    .route("/")
    .get((req, res) => {
        res.send("GET DONE: Display list of orders.")
    })
    .post((req, res) => {
        const newOrder = {
            id: 1,
            pizzas: [
                {   
                    id: 1,
                    amount: 2
                }
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
        }

        res.send("POST DONE: Add new order to list.")
    })


    module.exports = router;