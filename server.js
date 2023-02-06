const express = require("express");
const app = express();

const path = require("path");
const fileReaderAsync = require("./fileReader");
const pizzaFilePath = path.join(`${__dirname}/pizza-list.json`);
const fs = require("fs/promises");



app.listen(3000);