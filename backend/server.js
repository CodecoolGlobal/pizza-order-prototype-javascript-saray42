const express = require("express");
const app = express();

const orderRouter = require("./routes/order"); // added by Thomas
app.use("/api/order", orderRouter); // added by Thomas

const path = require("path");
const {fileReaderAsync, fileWriteAsync} = require("./fileReader");
const pizzaFilePath = path.join(__dirname + "/../list/pizza-list.json");
const allergenFilePath = path.join(__dirname + "/../list/allergens-list.json");

const fs = require("fs/promises");

app.get("/api/pizza", async (req, res) => {
    const pizzaListJson = await fileReaderAsync(pizzaFilePath);
    res.send(pizzaListJson);
})

app.listen(3000);