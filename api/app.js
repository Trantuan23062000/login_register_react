const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken")
const brcypt = require('bcryptjs')

const JWT = "hfshfsjfhdsjfsdhfsdfhsfldsflskdfsjfsl;ffeeufie";


require("./usersdetail");


app.use(express.json());
app.use(cors());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    next();
});


const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
    const { fname, lname, email, password } = req.body;
    const brcyptpassword = await brcypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            res.send({ error: "User exits" });
        }
        await User.create({
            fname, lname, email, password: brcyptpassword,
        });
        res.send({ status: "OK" })
    } catch (error) {
        res.send({ status: "error" })
    }
})


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User khong ton tai" });

    }
    if (await brcypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT, {
            expiresIn: 10
        });

        if (res.status(201)) {
            return res.json({ status: "ok", data: token })
        } else {
            return res.json({ error: "error" });
        }
    }


    res.json({ status: "error", error: "password and email not exits !" })
});


app.post('/user', async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT, (err, res) => {
            if (err) {
                return "token expired";
            }
            console.log(err);
            return res;
        });
        if (user === "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }
        const useremail = user.email;
        User.findOne({ email: useremail }).then((data) => {
            res.send({ status: "ok", data: data });
        })

    } catch (error) {
        res.send({ status: "error", data: error });
    }
})





const url = "mongodb+srv://tuan:tuan123@cluster0.dxscbtu.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
mongoose.connect(url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connect database !");

}).catch((e) => console.log(e));

const PORT = process.env.PORT || 3000;


app.listen(PORT, console.log(`Server dang chay http://localhost:${PORT}`));




