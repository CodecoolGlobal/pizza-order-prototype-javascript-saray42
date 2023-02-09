const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { fileReaderAsync, fileWriterAsync } = require("./fileReader");
const app = express();
const port = 3000;
const path = require("path");
let orderID = 0;

const pizzaList = JSON.parse(fs.readFileSync(__dirname + "/pizza-list.json"));
const allergeneList = JSON.parse(
  fs.readFileSync(__dirname + "/allergens-list.json")
);

const orders = __dirname + "/orders.json";

app.use(cors());
app.use(express.json());

app.get("/api/pizza", (req, res) => {
  res.send(pizzaList);
});

app.get("/api/allergens", (req, res) => {
  res.send(allergeneList);
});

app
  .route("/api/order")
  .get(async (req, res) => {
    const orderList = await fileReaderAsync(orders);
    res.status(201).send(JSON.parse(orderList));
  })
  .post(async (req, res) => {
    const incomingOrder = req.body;
    orderID = orderID + 1; // doesn't work!!!
    incomingOrder.id = orderID;
    console.log(incomingOrder)
    let orderList = await fileReaderAsync(orders);
    orderList = JSON.parse(orderList);
    orderList.orders.push(incomingOrder);
    await fileWriterAsync(orders, JSON.stringify(orderList));
    res.send(orderList);
  });

app.use(express.static(path.join(__dirname + "/../frontend/public")));

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
