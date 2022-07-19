import express from "express";
import NewOrder from "./NewOrder";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const newOrder = new NewOrder();

app.post("/newOrder", newOrder.create.bind(newOrder));

app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
