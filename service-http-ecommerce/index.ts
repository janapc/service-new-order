import express from "express";
import NewOrder from "./NewOrder";
import GenerateAllReports from "./GenerateAllReports";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const newOrder = new NewOrder();
const generateAllReports = new GenerateAllReports();

app.post("/newOrder", newOrder.create.bind(newOrder));
app.get(
  "/admin/generateReports",
  generateAllReports.create.bind(generateAllReports)
);

app.listen(PORT, () =>
  console.log("\x1b[32m", `Server running in port ${PORT}`)
);
