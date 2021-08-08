// 1. follow
// 2.unfollow
const express = require('express')
const router = express.Router()
const {User} = require('../Models/user.model')
const { authVerify } = require('../utils/authVerify')


router.route('/')
.get(authVerify, async (req, res) => {
    const {userId} = req.user
    const followers = await User.findById(userId).populate({
        path:'followers',
        model:'User'
    })
    const following = await User.findById(userId).populate({
        path:'following',
        model:'User'
    })
    res.json({message:"success", followers:followers.followers, following:following.following})
})

router.route('/follow/:otherUserId')
.post(authVerify, async(req,res) => {
    const {userId} = req.user
    const {otherUserId} = req.params
    const currentUser = await User.findById(userId);
    
    // Appne kisiko folow kiya so we add him in our following
    currentUser.following.push(otherUserId)
    await currentUser.save()

    const otherUser = await User.findById(otherUserId);
    otherUser.notifications.push(`${currentUser.fullName} followed you`)
    // And we became his follower so we will be added in his followeres
    otherUser.followers.push(userId)
    await otherUser.save()

    const followers = await User.findById(userId).populate({
        path:'followers',
        model:'User'
    })
    const following = await User.findById(userId).populate({
        path:'following',
        model:'User'
    })

    res.json({message:"Followed user", followers:followers.followers, following:following.following})
})
router.route('/unfollow/:otherUserId')
.post(authVerify, async(req,res) => {
    const {userId} = req.user;
    const {otherUserId} = req.params;
    const currentUser = await User.findById(userId);
    // Appne kisiko unfollow kiya, so we remove him from our following
    currentUser.following.pull(otherUserId)
    await currentUser.save()

    const otherUser = await User.findById(otherUserId);
    // And we are not not his follower so wer removed from his followers
    otherUser.followers.pull(userId)
    await otherUser.save()

    const followers = await User.findById(userId).populate({
        path:'followers',
        model:'User'
    })
    const following = await User.findById(userId).populate({
        path:'following',
        model:'User'
    })

    res.json({message:"UNFollowed user", followers:followers.followers, following:following.following})
})
module.exports = router 



// fetch profiile on click
// matlb when id come send populated user data to display
// like his all details and timeline

// basically timeline page