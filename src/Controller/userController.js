const userModel = require("../Models/userModel")
const { hassPassWord, comparePassword } = require("../Util/bcrypt")
const jwt = require("jsonwebtoken")
const { isValidRequestBody, isValidPass ,isValid,isValidEmail} = require("../Util/validations")

const createUser = async function(req,res){
    
    try{
        let {name,email,password,date} = req.body
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false,message:"Please provide data in for registering user"})
        }
        if(!name || !email || !password ){
            return res.status(400).send({status: false,message:"Please provide all data fields"})
        }
        if(!isValid(name)|| name.length<3 ||!isValidEmail(email)||!isValidPass(password)){
            return res.status(400).send({status: false,message:"Please provide data in correct format"})
        }

        let dupliEmail = await userModel.findOne({email:email})
        if(dupliEmail){
            return res.status(400).send({status: false,message:"Please provide unregistered email"})
        }
        const hasspassword=await hassPassWord(password)
        let user =await userModel.create({name,email ,password:hasspassword,date })
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"1d"})
        return res.status(200).send({
            status: true,
            message: "User is registered successfully",
            data:
        {id:user._id,token:token}})
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
    
}
const loginUser =async function (req,res){
    try{
        let {email,password} = req.body
        if(!email || !password){
            return res.status(400).send({status: false,message:"Please provide data for logging in"})
        }
        if(!isValidEmail(email)||!isValidPass(password)){
            return res.status(400).send({status: false,message:"Please provide data in correct format"})
        }
        let user = await userModel.findOne({email:email})
        if(!user){
            return res.status(401).send({status: false,message:"There is no user with this email"})
        }
        const passwordStatus = await comparePassword(password,user.password)
        if(!passwordStatus) return res.status(401).send({status: false,message:"Incorrect password"})
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"1d"})
        return res.status(200).send({
            status: true,
            message: "Logged In Successfully",
            data:
        {id:user._id,token:token}})
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}
const getUser = async function(req,res){
    try{
        let userId = req.head
        let user = await userModel.findById(userId).select({password:0})
        // if(!user) return res.status(400).send("There is no user ")
        return res.status(200).send({data:user})
    }catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}
module.exports ={createUser ,loginUser , getUser}
