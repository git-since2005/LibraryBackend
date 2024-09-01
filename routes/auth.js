const express = require('express')
const router = express.Router()
const member = require('../schemas/member')
const librarian = require('../schemas/librarian')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const middleware = require('../middleware/middleware')

let JWT_SECRET = process.env.secret

router.post('/member', async (req, res)=>{
    switch (req.body.command) {
        case 'create':
            let m = await member.findOne({email:req.body.email.toString()})
            if (m){
                return res.json({error:"Sorry a user with this email already exists"})
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
            break;
            
        case 'sign':
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
            break;
        case 'update':
            let findUser = await member.findById(req.body.id.toString())
            console.log(findUser)
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
            res.send("Done")
            break;

        case 'del':
            let m1 = await member.findById(req.body.id.toString())
            // console.log(m1)
            if(!m1){
                return res.json({error:'NotFound'})
            }
            if(m1._id!=req.body.id.toString()){
                return res.json({error:"NotFound"})
            }
            m1 = await member.findByIdAndDelete(req.body.id.toString())
            res.json()
            break;
            
        default:
            console.log("Something else this is")
            break;
    }
})

router.get('/getmembers', async(req, res)=>{
    let members = await member.find()
    let array = []
    for (let i = 0; i < members.length; i++) {
        array.push(members[i].name)
    }
    res.send(array)
})

router.post('/librarian', async(req, res)=>{
    let find2 = await librarian.findOne({name : req.body.uname.toString()})
    const salt1 = await bcrypt.genSalt(10)
    const sec1 = await bcrypt.hash(req.body.password.toString(), salt1)
    let comp = await bcrypt.compare(req.body.password.toString(), sec1)
    if(!comp){
        return res.json({error:"Password"})
    }
    const token = jwt.sign({user:find2._id}, JWT_SECRET)
    res.json({msg:token})
    
})

module.exports = router