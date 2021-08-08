const express = require('express')
const router = express.Router()
const {User} = require('../Models/user.model')
const { authVerify } = require('../utils/authVerify')

router.route('/clear')
.delete(authVerify, async(req, res) => {
    console.log("j")
    const token = req.token
    const {userId} = req.user
    const currentUser = await User.findById(userId)
    currentUser.notifications = []
    await currentUser.save();
    res.json({message:"successfully cleared notifications", user:currentUser, token:token})
})

module.exports = router