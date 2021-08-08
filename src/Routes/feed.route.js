const express = require('express');
const router = express.Router();
const {User} = require('../Models/user.model');
const {Posts} = require('../Models/posts.model')
const { authVerify } = require('../utils/authVerify');

router.route('/')
.get(authVerify, async(req,res) => {
    const {userId} = req.user
    const currentUser = await User.findById(userId).populate({
        path:'following',
        model:'User'
    }).populate({
        path:'following',
        populate:{
            path:'posts',
            model:'Posts'
        }
    })
    let newAllPosts = []
    const allPosts = currentUser.following.map(item => {
        return item.posts.map(item2 => {
             return newAllPosts.push(item2)
         })
    })
     sortedArray = newAllPosts.sort((a,b) => a.createdAt - b.createdAt)

    res.json({feedData:sortedArray})
})


module.exports = router