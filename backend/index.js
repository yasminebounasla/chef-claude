import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app  = express()

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get("/", (req, res) => {
    res.json({message :"Chef claude server is running !"})
})

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})