const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')


//postman

//we will pass the middleware funtion as second argument
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    

    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})


 
router.post('/users/login', async (req, res) => {

 
  
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user,token});
     
    } catch (e) {
        res.status(400).send({status : "error occured" , error : e})
    }
})


// router.get('/users',auth , async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.get('/users/me',auth , async (req,res) => {
    res.send(req.user )
  
})


//end point for logout
router.post('/users/logout', auth , async( req,res) => {
    console.log(req.token)
    // req.user.tokens = req.user.tokens.filter((token) => {
    //     return token.token !== req.token
    // } )

   
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        } )

        await req.user.save();
        res.send()

    }
    catch(e)
    {
        res.status(500).send("unable to connect to server")
    }


} )


//postman
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


//postman
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//postman
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router