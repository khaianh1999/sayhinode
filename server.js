const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("./config/passport"); // Import file auth.js (NÊN IMPORT TRƯỚC passport.initialize())

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();

app.use(bodyParser.json());
app.use(session({ secret: "mysecret", resave: false, saveUninitialized: true }));

app.use(passport.initialize()); 
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.listen(3001, () => console.log("Server chạy tại http://localhost:3001"));
