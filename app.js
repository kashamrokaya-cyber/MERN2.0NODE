const express = require('express');
const app = express();








app.get('/',(req,res)=>{
    
    res.send("Bye kushal")
})








app.listen(3000,()=>{
    console.log("App is listening...")
})

















