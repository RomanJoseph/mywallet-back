import { db } from "../db/db.js"

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ","")

    if(!token){
        return res.sendStatus(400)
    }

    try{
        const session = await db.collection("sessions").findOne({token})

        if(!session){
            return res.sendStatus(401)
        }

        const user = await db.collection("users").findOne({
            _id: session.userId
        })

        res.locals.session = session
        res.locals.user = user
        console.log(user)
        next()
    }catch(error){
        console.log(error)
        return res.sendStatus(500)
    }
}

export { authMiddleware }