const Mongoose=require('mongoose')


const UserSchema= new Mongoose.Schema(
    {
        Name:String,
        Password:String
    },
    { collection: 'Users' }
)

const userModel=Mongoose.model('Users',UserSchema)


module.exports={userModel}
