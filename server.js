const express = require("express");
const bodyParser= require("body-parser");

const users = require("./routes/api/users");


const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());


app.use("/api",users);    


const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`server's up :p ${port}`));