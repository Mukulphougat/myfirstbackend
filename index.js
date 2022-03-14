require("dotenv").config()
const mysql = require("mysql2")
const fs = require("fs")
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.set('view engine','ejs');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
});

let sqlConnection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.database_port,
    ssl:{ca:fs.readFileSync("BaltimoreCyberTrustRoot.crt.pem")}
});


sqlConnection.connect(err => {
    if ( !err ) console.log("Connected");
    else console.log("Not connected");
});

app.get('/get',(req,res) => {
    // res.sendFile(path.join(__dirname,'view/page/index.ejs'));
    sqlConnection.query(`select * from userdata`,function (err,results,fields){
        if ( err ) throw err;
        else res.send(results);
    });
})
app.post('/add',(req,res) => {
    const rec = req.body;
    let userName = rec.userName;
    let userMail = rec.userMail;
    let userPhone = rec.userPhone;
    let userPassword = rec.userPassword;
    const insertedValue = `insert into userdata(userName,userPhone,userMail,userPassword) values('${userName}','${userPhone}','${userMail}','${userPassword}')`;
    sqlConnection.query(insertedValue, function (err,results,field) {
        if ( err ) throw err;
        else console.log("Pushed")
    });
    res.send("Added")
})


app.get('/showUser',(req,res) => {

    let userName = req.query.userName;
    let userPassword = req.query.userPassword;
    sqlConnection.query(`select * from userdata where userName='${userName}' and userPassword='${userPassword}'`,function (err,results,fields){
        if ( err ) throw err;
        else res.send(results);
    });
    // console.log(result);
    console.log('got');
})
app.delete('/del',(req,res) => {
    const rec = req.body;
    let userName = rec.userName;
    let userPassword = rec.userPassword;
    const deleteStatement = `delete from userdata where (name='${userName}' and userPassword ='${userPassword}')`;
    sqlConnection.query(deleteStatement,function (err,results,field){
        if ( err ) throw err;
        else res.send("Deleted");
    });

})

// function getUserData(name,password) {
//     sqlConnection.query(`select * from userdata where (userName='${name}' and userPassword='${password}')`,function (err,results,fields){
//         if ( err ) return null;
//         else return results;
//     })
// }
//
//
// function getAll() {
//     sqlConnection.query(`select * from userdata`,function (err,results,fields){
//         if ( err ) throw err;
//         else return results;
//     })
// }

// const insertInto = "insert into userdata(userName,userPhone,userMail,userPassword) values('chirag',11233486,'chirag@hotmail','chirag@2108')";
// sqlConnection.query(`${insertInto}`,function (err,results,field) {
//     if ( err ) throw err;
//     else console.log(field)
// })