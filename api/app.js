const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const brcypt = require('bcryptjs')
app.set("view engine", "ejs");


const JWT = "hfshfsjfhdsjfsdhfsdfhsfldsflskdfsjfsl;ffeeufie";


require("./usersdetail");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());



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

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const old_User = await User.findOne({ email });
        if (!old_User) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = JWT + old_User.password;
        const token = jwt.sign({ email: old_User.email, id: old_User._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:5000/reset-password/${old_User._id}/${token}`;
        console.log(link);

    } catch (error) {

    }
})

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const old_User = await User.findOne({ _id: id });
    if (!old_User) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT + old_User.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
});


app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const old_User = await User.findOne({ _id: id });
    if (!old_User) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT + old_User.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await brcypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );

        res.render("index", { email: verify.email, status: "verified" });
        res.send('doi duoc roi');
    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
});





const url = "mongodb+srv://trantuan2306:trantuan2306@tuan.udd7jr3.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
mongoose.connect(url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connect database !");

}).catch((e) => console.log(e));

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`Server dang chay http://localhost:${PORT}`));




