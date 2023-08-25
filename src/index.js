const express = require("express")
const app = express()
const DbConn = require("./db")
const  notesRoute  = require("./Routes/notesRoutes")
const  userRoute  = require("./Routes/userRoutes")
require("dotenv").config()
const  cors = require('cors') 

app.use(cors())
const {MONGO_URL,PORT}=process.env
app.use(express.json())
app.use(express.urlencoded({extended:true}))

DbConn(MONGO_URL)

app.use("/notes",notesRoute)
app.use("/user",userRoute)


app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})

