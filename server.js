const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const database = {
    users: [
        {
        id: "123",
        name: "John",
        email: "john@gmail.com",
        password: "cookies",
        entries: 0,
        joined: new Date(),
        },
        {
        id: "124",
        name: "Sally",
        email: "sally@gmail.com",
        password: "bananas",
        entries: 0,
        joined: new Date(),
        }
    ],
    login: [
        {
            id: "987",
            hash: "",
            email: "john@gmail.com"
        }

    ]
}

app.get("/",(req,res)=>{

    res.send(database.users);
})

app.post("/signin",(req,res) =>{
    bcrypt.compare(req.body.password, "$2a$10$Op1j0D2DhEGt230hC/SwiuKVsfVLgnzhW1l0GX.Wq0pN2BXnTdSKe", function(err, res) {
        console.log("first try is "+res);
    });
    bcrypt.compare(req.body.password, "$2a$10$Op1j0D2DhEGt230hC/SwiuKVsfVLgnzhW1l0GX.Wq0pN2BXnTdSKe", function(err, res) {
        console.log("second try is "+res);
    });

    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json("login-error");
    }
})

app.post("/register",(req,res)=>{
    const{email,name,password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    })
    res.json(database.users[database.users.length-1]);
})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    const founded = false;
    database.users.forEach(user => {
        if(user.id === id){
            return res.json(user);
            founded = true;
        } 
    })
    if (!founded){
        res.status(404).json("no such user");
    }
})

app.put("/image", (req,res)=>{
    const {id} = req.body;
    const founded = false;
    database.users.forEach(user => {
        if(user.id === id){
            return res.json(user.entries++);
            founded = true;
        } 
    })
    if (!founded){
        res.status(404).json("no such user");
    }
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