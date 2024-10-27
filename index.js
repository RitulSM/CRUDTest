import express from 'express';
const app = express();
const port = 5000;
import logger from "./Logger.js";
import morgan from "morgan";

app.use(express.json());
let teaData = [];
let nextId = 1;
const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );
app.post('/coffees', (req, res) => {
    const { name, price } = req.body;
    const newTea = { id: nextId++, name, price };
    teaData.push(newTea);
    res.status(201).send(newTea);
});

app.get('/coffees', (req, res) => {
    res.status(200).send(teaData);
});

app.get('/coffees/:id', (req, res) => {
    const coffee = teaData.find(t => t.id === parseInt(req.params.id));
    if (!coffee) {
        return res.status(404).send("Coffee not found");
    } else {
        res.status(200).send(coffee);
    }
});

app.put('/coffees/:id', (req, res) => {
    const coffee = teaData.find(t => t.id === parseInt(req.params.id));
    if (!coffee) {
        return res.status(404).send("Coffee not found");
    } else {
        const { name, price } = req.body;
        coffee.name = name;
        coffee.price = price;
        res.status(200).send(coffee);
    }
});

app.delete('/coffees/:id', (req, res) => {
    const index = teaData.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send("Not found");
    }
    teaData.splice(index, 1);
    res.status(204).send("Deleted");
});

app.listen(port, () => {
    console.log(`Server is running at port: ${port}...`);
});
