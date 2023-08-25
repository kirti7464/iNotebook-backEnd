const notesModel = require("../Models/notesModel")
const { isValidRequestBody ,isValid,isValidEmail,isValidObjectId} = require("../Util/validations")

const createNotes = async function (req,res){
    try{
        let {title,description,tag,date} = req.body
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false,message: "Please provide data in for registering user"})
        }
        if(!title || !description ){
            return res.status(400).send({status: false,message: "Please provide all data fields"})
        }
        if(!isValid(title)|| !isValid(description)){
            return res.status(400).send({status: false,message: "Please provide data in correct format"})
        }
        let user = req.head
        let notes = await notesModel.create({user,title,description,tag,date})
        return res.status(200).send({
            status: true,
            message: "Note is created",
            data: notes,
        })
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}
const getNotes = async function (req,res){
    try{
        let user = req.head
        let notes = await notesModel.find({user:user})
        // if(notes.length==0){
        //     return res.status(404).send({status: false,message:"There is no notes with this user"})
        // }
        return res.status(200).send({
            status: true,
            message: "Notes data",
            data: notes,
        })
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}
const updateNotes = async function (req,res){
    try{
        let noteId = req.params.id
        if(!isValidObjectId(noteId)){
            return res.status(400).send({status: false,message: "Please provide data in for registering user"})
        }
        let {title,description,tag} = req.body
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false,message: "Please provide data in for registering user"})
        }
        if(!title || !description || !tag ){
            return res.status(400).send({status: false,message: "Please provide all data fields"})
        }
        if(!isValid(title)|| !isValid(description)||!isValid(tag)){
            return res.status(400).send({status: false,message: "Please provide data in correct format"})
        }
        let user = req.head
        let notes = await notesModel.findById(noteId)
        if(!notes) return res.status(404).send({status: false,message: "There is no notes with this ID"})
        if(notes.user != user){
            return res.status(401).send("Not authorized")
        }
        let updatedNote = await notesModel.findByIdAndUpdate(noteId,{title:title,description:description,tag:tag},{new:true})
        return res.status(200).send({
            status: true,
            message: "Note is updated successfully",
            data: updatedNote
        })
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}
const delNotes = async function (req,res){
    try{
        let noteId = req.params.id
        if(!isValidObjectId(noteId)){
            return res.status(400).send({status: false,message: "Please provide data in for registering user"})
        }
        let notes = await notesModel.findById(noteId)
        if(!notes) return res.status(404).send({status: false,message: "There is no notes with this ID"})
        let user = req.head
        if(notes.user != user){
            return res.status(401).send({status: false,message: "Not authorized"})
        }
        let updatedNote = await notesModel.findByIdAndDelete(noteId)
        return res.status(200).send({status: true,message:"Successfully deleted",data:updatedNote})
    }
    catch(er){
        return res.status(500).send({
            status: false,
            message: er.message
        })
    }
}

module.exports ={createNotes,getNotes,updateNotes,delNotes}