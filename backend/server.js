const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { fileReaderAsync, fileWriterAsync } = require("./fileReader");
const app = express();
const port = 3000;
const path = require("path");

const pizzaList = JSON.parse(fs.readFileSync(__dirname + "/pizza-list.json"));
const allergeneList = JSON.parse(
  fs.readFileSync(__dirname + "/allergens-list.json")
);

const orders = __dirname + "/orders.json";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../frontend/index.html"));
  res.sendFile(path.join(__dirname + "/../frontend/index.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname + "/../frontend/menu.html"));
});

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
    let orderList = await fileReaderAsync(orders);
    orderList = JSON.parse(orderList);
    orderList.push(incomingOrder);
    await fileWriterAsync(orders, JSON.stringify(orderList));
    res.send(orderList);
  });

app.use(express.static(path.join(__dirname + "/../frontend/public")));

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
