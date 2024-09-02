const express = require('express')
const router = express.Router()
const books = require('../schemas/book')
const members = require('../schemas/member')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/middleware')
const JWT_SECRET = process.env.secret

router.post('/create', async (req, res)=>{
    let book = await books.create({
        "name":req.body.name
    })
    res.json(book)
})
router.post('/update', async(req, res)=>{
    const token = jwt.verify(req.header('auth-token'), JWT_SECRET)
    let m1 = await books.findByIdAndUpdate(req.body.id.toString(), {$set:{name:req.body.name.toString()}}, {new:true})
    res.json({msg:"success"})
})
router.post('/delete/:id', async(req, res)=>{
    const token = jwt.verify(req.header('auth-token'), JWT_SECRET)
    if(!token){
        return res.json({error:"invalid"})
    }
    console.log(req.params.id)
    let m1 = await books.findById(req.params.id)
    if(!m1){
        return res.status(400).json({error:'NotFound'})
    }
    if(m1._id!=req.params.id){
        return res.status(400).json({error:"NotFound"})
    }
    m1 = await books.findByIdAndDelete(req.params.id)
    res.json({msg:"Deleted"})
})


router.post('/borrow/:id/:user',async(req, res)=>{
    let auth = await jwt.verify(req.params.user, JWT_SECRET)
    let member = await members.findById(auth.user)
    if(!member){
        res.send({error:"User"})
    }
    b = await books.findByIdAndUpdate(req.params.id, {$set:{borrower:auth.user}}, {new:true})
    b = await books.find({borrower:req.body.user})
    res.json(b)
})

router.post('/borrowed/:id',async(req, res)=>{
    let auth = await jwt.verify(req.params.id, JWT_SECRET)
    let book = await books.find({borrower:auth.user})
    res.json(book)
})

router.post('/return/:id/:user',async(req, res)=>{
    let auth = await jwt.verify(req.params.user, JWT_SECRET)
    let member = await members.findById(auth.user)
    if(!member){
        res.send({error:"User"})
    }
    b = await books.findByIdAndUpdate(req.params.id, {$set:{borrower:"null"}}, {new:true})
    b = await books.find({borrower:req.body.user})
    res.json(b)
})

router.post('/getbooks', middleware, async(req, res)=>{
    let findBooks = await books.find()
    res.json(findBooks)
})



module.exports = router