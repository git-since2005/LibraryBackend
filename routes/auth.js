const express = require('express')
const router = express.Router()
const member = require('../schemas/member')
const librarian = require('../schemas/librarian')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const middleware = require('../middleware/middleware')

let JWT_SECRET = process.env.secret

router.post('/member', async (req, res)=>{
    let m = await member.findOne({email:req.body.email.toString()})
    if (m){
        return res.json({error:"Email"})
    }
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password.toString(), salt)
    
    user = await member.create({
        'name': req.body.name.toString(),
        "email":req.body.email.toString(),
        "password":secPass
    })
    const auth = jwt.sign({user:user._id}, JWT_SECRET)
    res.json({msg:auth})
})

router.post('/sign',async(req, res)=>{
    let s = await member.findOne({email:req.body.email.toString()})
    if(s){
        const passCompare = await bcrypt.compare(req.body.password.toString(), s.password)
        if (!passCompare){
            return res.json({error:"Password"})
        }
        const authtoken = jwt.sign({user:s._id}, JWT_SECRET)
        return res.json({msg:authtoken})
    }
    else{
        return res.json({error:"Email"})
    }
})

router.post('/delete/:id',async(req, res)=>{
    let m1 = await member.findById(req.params.id.toString())
    if(!m1){
        return res.json({error:'NotFound'})
    }
    m1 = await member.findByIdAndDelete(req.params.id.toString())
    res.json({msg:"Deleted"})
})

router.post('/update',async(req, res)=>{
    let findUser = await member.findById(req.body.id.toString())
    if(!findUser){
        return res.json({error:"NotFound"})
    }
    if(req.body.id.toString() != findUser._id){
        return res.json({error:"NotFound"})
    }
    if(req.body.name){
        findUser = await member.findByIdAndUpdate(req.body.id, {$set:{name:req.body.name}}, {new:true})
    }
    if(req.body.email){
        findUser = await member.findByIdAndUpdate(req.body.id, {$set:{email:req.body.email}}, {new:true})
    }
    res.json({msg:"Done"})
})

router.get('/getmembers', async(req, res)=>{
    let members = await member.find()
    res.send(members)
})

router.post('/librarian', async(req, res)=>{
    const salt1 = await bcrypt.genSalt(10)
    const sec1 = await bcrypt.hash(req.body.password.toString(), salt1)
    let find2 = await librarian.create({
        name:req.body.uname.toString(),
        password:sec1
    })
    const token = jwt.sign({user:find2._id}, JWT_SECRET)
    res.json({msg:token})
    
})

router.post('/librariansign', async(req, res)=>{
    let find2 = await librarian.findOne({name:req.body.uname.toString()})
    if(!find2){
        return res.json({error:"N"})
    }
    const passCompare = await bcrypt.compare(req.body.password.toString(), find2.password)
    if(!passCompare){
        return res.json({error:"P"})
    }
    let sec1 = await jwt.sign({user:find2._id}, JWT_SECRET)
    res.json({msg:sec1})
})

module.exports = router