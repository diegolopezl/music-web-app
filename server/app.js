//Dependencias y librerias
const express = require('express');
const app = express();
const port = 5000;

//Render de los files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../music-app'));
app.use(express.json());



app.listen(port , () => {
    console.log(`Server listening at port ${port}`);
});