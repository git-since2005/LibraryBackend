const express = require('express')
const router = express.Router()
const books = require('../schemas/book')

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

router.get('/getbooks', async(req, res)=>{
    let allBooks = await books.find()
    let array = []
    for (let i = 0;i<allBooks.length;i++) {
        array.push(allBooks[i].name)
    }
    res.json(array)
})

module.exports = router