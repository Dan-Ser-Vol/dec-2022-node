 import  express from 'express'

 import {Request, Response} from "express";

 const app = express()

const fileService = require('../services/serviceDB.js')


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/users', async function (req :Request, res: Response) {
    const users = await fileService.readDB()
    if (!users) {
        res.status(404).json({message: 'Користувачі не знайдені'})
    }
    res.json(users)
})



app.listen(3000, () => console.log('server working on port 3000!'))