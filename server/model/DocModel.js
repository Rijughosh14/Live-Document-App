const Mongoose=require('mongoose')
const {userModel}=require('./UserModel.js')

const DocSchema= new Mongoose.Schema(
    {
        DocumentName:String,
        DocumentAdminId:String,
        DocumentFile:String,
        Group:[{
            type:Mongoose.Schema.Types.ObjectId,
            ref:userModel
        }]
    },
    {collection:'Documents'}
)

const docModel=Mongoose.model('Documents',DocSchema)

module.exports={docModel}