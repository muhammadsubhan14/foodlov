const express = require("express")
const session = require("express-session")
const app = express()
const port = 3000
const AdminController = require("./controllers/UserController")
const qrcode = require('qrcode')
const CustomerController = require("./controllers/CustomerController")
const transaction = require("./models/transaction")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended : false}))
app.use(session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : false,
    cookie : { 
    secure : false,
    sameSite : true}
}))

// middleware
// const isLogin = (req, res, next) => {
//     const { userId } = req.session;

//     if (userId) {
//         return res.redirect("/products");
//     }

//     next();
// };

app.get("/register", AdminController.registerUserForm)
app.post("/register", AdminController.postRegisterUser)
app.get("/login",AdminController.loginUser)
app.post("/login",AdminController.loginUserPost)
app.get("/logout", AdminController.logoutUser)
app.get("/create-profile", AdminController.createProfile)
app.post("/create-profile", AdminController.createProfilePost)

app.get("/", (req, res) => {
    res.render("home")
})

app.use(function(req,res,next) {
    if (!req.session.user){
        const error = "Please Login to Access"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

app.get("/products", CustomerController.getProduct)
// app.get("/showProfile/:id", CustomerController.showProfile)
app.get("/transaction/:id", CustomerController.addToCart)
app.post("/transaction/:id", (req,res,next) => {
    const body = req.body
    const dataForQRCode = `${body.Delivery}-${body.Payment}`
    qrcode.toDataURL(dataForQRCode, (err,src) => {
        if (err) {
            return next(err)
        }
        res.render("qrcode", {
            qr_code: src,
        })
    })
})

app.use(function(req,res,next) {
    // console.log(req.session)
    if (req.session.user.role !== "admin"){
        const error = "You have no access"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

app.get("/admin", (req , res, next) => {
    if (!req.session.user){
        const error = "Please Login to Access" 
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

app.get("/admin", AdminController.showListProduct)
app.get("/admin/add", AdminController.getAddProduct)
app.post("/admin/add", AdminController.addPostProduct)
app.get("/admin/:productid/increase-stock", AdminController.getIncrementProduct)
app.get("/admin/:productid/decrease-stock", AdminController.getDecreaseProduct)
app.get("/admin/:productid/delete", AdminController.deleteProduct)

app.listen(port, () => {
    console.log(`Food To Good Love ${port}`)
})