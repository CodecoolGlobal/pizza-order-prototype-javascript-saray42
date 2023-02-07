const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const { fileReaderAsync, fileWriteAsync } = require("./fileReader");
const pizzaList = path.join(__dirname + "/list/pizza-list.json");
const allergesList = path.join(__dirname + "/list/allergens-list.json");
const orders = path.join(__dirname + "/list/orders.json");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/backend/index.html'));
});

app.get("/api/pizza", async (req, res) => {
    const pizzaListJson = await fileReaderAsync(pizzaList);
    res.send(JSON.parse(pizzaListJson));
});

app.get("/api/allergens", async (req, res) => {
    const allergenListJson = await fileReaderAsync(allergesList);
    res.send(JSON.parse(allergenListJson));
});

app.route("/api/order")
    .get(async (req, res) => {
        const orderList = await fileReaderAsync(orders);
        res.send(JSON.parse(orderList));
    })
    .post(async (req, res) => {
        const orderList = await fileReaderAsync(orders);
        res.send(JSON.parse(orderList));
    });

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));
