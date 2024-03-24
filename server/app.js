import express from "express";
import Student from "./routers/Student.js"
import Admin from "./routers/Admin.js"
import cors from 'cors'

export const app = express();

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use("/student",Student)
app.use("/admin",Admin)

