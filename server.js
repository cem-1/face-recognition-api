const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const knex = require("knex");

const db = knex({
    client: "pg",
    connection:{
        host: "127.0.0.1",
        user: "postgres",
        password: "root",
        database: "face-recognition-db",
    }
})

app.post("/signin",(req,res) =>{
    db.select("email","hash").from("login")
        .where("email", "=", req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
            if(isValid){
                return db.select("*").from("users").where("email","=",req.body.email).then(user=>{
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json("unable to get user"))
            } else{
            res.status(400).json("wrong credentials")
            }
        }).catch(err => res.status(400).json("wrong credentials"));
})

app.post("/register",(req,res)=>{
    const{email,name,password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email,
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {
            return trx("users").returning("*").insert({
                email:loginEmail[0].email,
                name:name,
                joined:new Date(),
            }).then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable ro register"));;
})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    db.select("*").from("users").where({
        id: id,
    }).then(user => {
        res.json(user[0]);
        console.log("###LOG RECORD###");
        console.log("fetched data");
        console.log(Date());
        console.log(user[0]);
    })

})

app.put("/image", (req,res)=>{
    const {id} = req.body;
    db("users").where("id","=",id).increment("entries",1).returning("entries").then(entries => {
        res.json(entries[0].entries);
    }).catch(err=> res.status(400).json("unable to catch data"));
})

/*  ENDPOINTS  
 *  --> res = this is working
 *  /signin --> POST = success/fail
 *  /register --> POST = user
 *  /profile/:userId --> GET = user
 *  /image --> PUT = user
 */




app.listen(4000, () => {
    console.log("App is live!");
});