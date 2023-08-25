const express = require("express")
const { createNotes ,getNotes, updateNotes, delNotes} = require("../Controller/notesController")
const { authenticate } = require("../Middleware/authenticate")
const router = express.Router()

router.post("/create",authenticate,createNotes)
router.get("/info",authenticate,getNotes)
router.put("/update/:id",authenticate,updateNotes)
router.delete("/del/:id",authenticate,delNotes)

router.get("/test",(req,res)=>{
    res.send("testinggg...")
})

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


module.exports = router
