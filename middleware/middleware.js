const jwt = require('jsonwebtoken')
const JWT_SECRET = "Books$helves"

const middleware = async(req, res, next)=>{
    const token = await req.header('auth-token')
    if(!token){
        res.status(401).send({error: "Please give a token"})
    }
    try{
        const data = jwt.verify(token, JWT_SECRET)
        // req.user = data.user
        next()
    }
    catch(error){
        res.send({error: "invalid"})
    }
}

module.exports = middleware;