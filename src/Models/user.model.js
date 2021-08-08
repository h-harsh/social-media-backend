const mongoose  = require('mongoose')

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"]
    },
    userName: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "mail is required"]
    },
    password: {
        type: String,
        required: [true, "Password ke liye bhi bole kya ab"]
    },
    profilePicture:{
        type:String
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
    followers:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications:[],
    bio:String,
    gender:String,
    dob:Date
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}