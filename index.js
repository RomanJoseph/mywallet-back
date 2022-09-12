import express from "express";
import cors from "cors";
import bcrypt from "bcrypt"
import { db } from "./db.js";
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sing-up", async (req, res) => {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);

    const isUserAlreadyRegistred = await db.collection("users").findOne({ email: user.email })

    if (isUserAlreadyRegistred) {
        return res.status(409).send("Usuário já cadastrado")
    }

    await db.collection('users').insertOne({ name: user.name, email: user.email, password: passwordHash })


    res.sendStatus(201)
})

app.post("/sing-in", async (req, res) => {
    const { email, password } = req.body

    const user = await db.collection("users").findOne({ email })

    if (user) {
        console.log("Passou aqui")
        if (bcrypt.compareSync(password, user.password)) {
            const token = uuid()

            await db.collection("session").insertOne({
                userId: user._id,
                token
            })

            return res.send(token)
        } else {
            return console.log("Usuário ou senha incorretos!")
        }
    } else {
        return res.status(404).send("Usuário não encontrado")

    }

})

app.get("/wallet", (req, res) => {
    const token = req.headers.authorization?.replace('Bearer','')
    console.log(token)
    return res.sendStatus(200)
})

app.listen("5000", () => console.log("Listening 5000"))