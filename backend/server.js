const express = require("express");
const app = express();
const port = 3000;

const cors = require('cors')
app.use(cors());

const path = require("path");

const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const { fileReaderAsync, fileWriteAsync } = require("./fileReader");
const fs = require("fs");
const pizzaList = path.join(__dirname + "/list/pizza-list.json");
const allergesList = path.join(__dirname + "/list/allergens-list.json");
const orders = path.join(__dirname + "/list/orders.json");

let orderList = [];

fs.access("orders.json", fs.F_OK, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("File exists");

	orderList = JSON.parse(fs.readFileSync("orders.json"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/index.html'));
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
        // const orderList = await fileReaderAsync(orders);
        // res.send(JSON.parse(orderList));
        res.send(orderList);
    })
    .post(async (req, res) => {
        // const orderList = await fileReaderAsync(orders);
        // res.send(JSON.parse(orderList));
        const orderObject = req.body;
        // const orderObject = {id : "test"};

        orderList.push(orderObject);
        fs.writeFileSync("./backend/list/orders.json", JSON.stringify(orderList))
        res.status(201).send(orderList)

    })
    // .delete("/:index", (req, res) => {
    //     const index = req.params.index;
    //     dictionary.splice(index, 1);
    //     res.send(dictionary);

    // })

app.use('/static', express.static(path.join(__dirname, 'public')))
app.listen(port, _ => console.log(`http://127.0.0.1:${port}, Server runs...`));
