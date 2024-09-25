const Mongoose=require('mongoose')
const {userModel}=require('./UserModel.js')
const {docModel}=require('./DocModel.js')
const requestschema=new Mongoose.Schema(
    {
        senderId:{
            type:Mongoose.Schema.Types.ObjectId,
            ref:userModel
        },
        receiverId:{
            type:Mongoose.Schema.Types.ObjectId,
            ref:userModel
        },
        documentId:{
            type:Mongoose.Schema.Types.ObjectId,
            ref:docModel
        }
    },
    {collection:'Requests'}
)

const requestModel=Mongoose.model('Requests',requestschema)

module.exports={requestModel}