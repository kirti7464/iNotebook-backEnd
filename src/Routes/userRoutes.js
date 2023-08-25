const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUser} = require("../Controller/userController")
const {authenticate} = require("../Middleware/authenticate")


router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/info",authenticate,getUser)

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


module.exports = router