const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const brcypt = require('bcryptjs')
app.set("view engine", "ejs");



const JWT = "hfshfsjfhdsjfsdhfsdfhsfldsflskdfsjfsl;ffeeufie";
var nodemailer = require('nodemailer');


require("./usersdetail");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());



const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;

    const encryptedPassword = await brcypt.hash(password, 10);
    try {
        const old_User = await User.findOne({ email });

        if (old_User) {
            return res.json({ error: "User Exists" });
        }
        await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
            userType,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
    }
});



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
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tttuan_19pm@student.agu.edu.vn',
                pass: 'pbohxjclgbojbgya'
            }
        });

        var mailOptions = {
            from: 'tuantran',
            to: old_User.email,
            subject: 'Cap lai mat khau',
            text: link
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

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
    } catch (error) {
        console.log(error);
        res.json({ status: "That bai" });
    }
});


app.get("/getuser", async (req, res) => {
    try {
        const allUser = await User.find({});
        res.send({ status: "ok", data: allUser });
    } catch (error) {
        console.log(error);
    }
});

app.post("/deleteuser", async (req, res) => {
    const { user_id } = req.body
    try {
        User.deleteOne({ _id: user_id }, function (err, res) {
            console.log(err);
        })
        res.send({ status: "ok", data: "deleted" })
    } catch (error) {
        console.log(error);
    }
})

app.get("/paginationUser", async (req, res) => {
    const all_User = await User.find({})
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}

    results.totalUser = all_User.length
    results.pageCout = Math.ceil(all_User.length / limit)

    if (lastIndex < all_User.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1
        }
    }

    results.result = all_User.slice(startIndex, lastIndex)
    res.json(results)


})

const url = "mongodb+srv://trantuan2306:trantuan2306@tuan.udd7jr3.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
mongoose.connect(url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connect database !");

}).catch((e) => console.log(e));

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`Server dang chay http://localhost:${PORT}`));




