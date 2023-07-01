//Dependencias y librerias
const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/test", (req,res) => {
  res.json({ message: "Received your request successfully!" });
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
