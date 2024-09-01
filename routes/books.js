const express = require('express')
const router = express.Router()
const books = require('../schemas/book')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/middleware')
const JWT_SECRET = process.env.secret

router.post('/', async (req, res)=>{
    switch (req.body.command) {
        case 'create':
            let book = await books.create({
                "name":req.body.name
            })
            res.json(book)
            break;

        case 'changeBorrow':
            let b = await books.findById(req.body.id.toString())
            if(!b){
                return res.status(400).send("NotFound")
            }
            if(b._id!=req.body.id){
                return res.status(400).send("Not found")
            }
            b = await books.findByIdAndUpdate(req.body.id.toString(), {$set:{borrower:req.body.user.toString()}}, {new:true})
            res.send("Done")
            break;

        case 'del':
            let m1 = await books.findById(req.body.id.toString())
            // console.log(m1)
            if(!m1){
                return res.status(400).json({error:'NotFound'})
            }
            if(m1._id!=req.body.id){
                return res.status(400).json({error:"NotFound"})
            }
            m1 = await books.findByIdAndDelete(req.body.id)
            res.send("Deleted")
            break;
            
        default:
            console.log("Something else this is")
            break;
    }
})

router.post('/getbooks', async(req, res)=>{
})
router.post('/getbooks', middleware, async(req, res)=>{
    console.log("Hi")
    const data = jwt.verify(req.header('token'), JWT_SECRET)
    let findBooks = await books.find()
    res.json(findBooks)
    console.log(findBooks)
    // try{
    // }
    // catch{
    //     res.send("Please a valid token")
    // }
})

module.exports = router