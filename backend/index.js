import express from "express";
const app  = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({message :"Chef claude server is running !"})
})

app.listen(env.PORT, ()=> {
    console.log("Server running on port 5000");
})