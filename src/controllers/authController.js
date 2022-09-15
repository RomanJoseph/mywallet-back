import { db } from "../db/db.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

import { registerSchema, loginSchema } from "../schemas/authSchema.js"


async function register(req,res){
    let { name, email, password } = req.body
    const isValid = registerSchema.validate({name, email, password})

    password = bcrypt.hashSync(password,10)

    if(await db.collection("users").findOne({email})){
        return res.sendStatus(409)
    }

    if(isValid.error){
        return res.sendStatus(400)
    }

    try{
        const result = await db.collection("users").insertOne({name, email, password})
        return res.sendStatus(201)
    } catch(error){
        console.error(error)
        return res.sendStatus(500)
    }
}

async function login(req, res){
    const { email, password } = req.body
    const isValid = loginSchema.validate({ email, password})

    if(isValid.error){
        return res.sendStatus(401)
    }

    try{
        const user = await db.collection("users").findOne({email})
        const isPasswordValid = bcrypt.compareSync(password, user.password)

        if(!user || !isPasswordValid){
            return res.sendStatus(401)
        }

        const token = uuid()
        db.collection("sessions").insertOne({
            userId: user._id,
            token
        })
        
        return res.status(200).send(token)
    } catch(error){
        res.sendStatus(500)
    }
}

export { register, login }