//Dependencias y librerias
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

//Middlewares para paso de datos entre front end y back end
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
