const express = require('express');
const fs = require('fs')
const PORT = 5200;
const app = express()
app.use(express.json())
// import route external
const expenseRouter = require('./routers/expenseRouter')
// url route external
app.use("/expense",expenseRouter)
//get list minimum
app.get("/expense",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let filtered = expenseDb.expense.reduce((newarr,current)=>(
        newarr.push({
                title:current.title,
                nominal:current.title
            })
    ,newarr),[])
    return res.status(200).send(filtered)
})
// get detail
app.get("/expense/:id",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json')).expense
    expenseDb = expenseDb.filter(x=>x.id==req.params.id)
    return res.status(200).send(expenseDb[0])
})
// get total
app.get("/total",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let totalin = 0,totalout = 0
    let message = "Total expense"
    let typeon = false
    Object.keys(req.body).forEach(x=>{
        if(x == "startDate"){
            if(req.body.startDate != undefined 
                && req.body.startDate != ""
                && req.body.endDate != undefined
                && req.body.endDate != ""
                ){
                let startDate = new Date(req.body.startDate)
                let endDate = new Date(req.body.endDate)
                expenseDb.expense = expenseDb.expense.filter(x=>{
                    let check = new Date(x.date)
                    return (check>=startDate && check <= endDate)
                })
                message += ` dari tanggal ${req.body.startDate} sampai ${req.body.endDate} `
            }
        }
        if(x == "type"){
            expenseDb.expense = expenseDb.expense.filter(x=>x.type==req.body.type)
            message += ` dengan type ${req.body.type}`
            typeon = true
        }
    })

    if(typeon){
        totalin = expenseDb.expense.reduce((total, item)=>(total+=item.nominal,total),0)
        message += `\n total = ${totalin} `
    }else{
        totalin = expenseDb.expense.filter(x=>x.type=="pemasukan").reduce((total, item)=>(total+=item.nominal,total),0)
        totalout = expenseDb.expense.filter(x=>x.type=="pengeluaran").reduce((total, item)=>(total+=item.nominal,total),0)
        message += `\n total pemasukan = ${totalin} \n total pengeluaran = ${totalout}`
    }
    return res.status(200).send(message)
})
// create
app.post("/expense",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let id = expenseDb.expense.length+1
    while(expenseDb.expense.filter(y=>y.id==id).length>0){
        id++;
    }
    expenseDb.expense.push({
        id:id,
        ...req.body
    })
    fs.writeFileSync("./db.json",JSON.stringify(expenseDb))
    expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    return res.status(201).send(expenseDb.expense)
})
// update
app.put("/expense/:id",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let getIdx = expenseDb.expense.findIndex(x=>x.id==req.params.id)

    if(getIdx < 0){
        return res.status(404).send('Data Not Found')
    }else{
        expenseDb.expense[getIdx] = {
            id:parseInt(req.params.id),
            ...req.body
        }

        fs.writeFileSync('./db.json',JSON.stringify(expenseDb))
        
        return res.status(201).send(expenseDb.expense)
    }
})

app.patch("/expense/:id",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let getIdx = expenseDb.expense.findIndex(x=>x.id==req.params.id)

    if(getIdx < 0){
        return res.status(404).send('Data Not Found')
    }else{
        expenseDb.expense[getIdx] = {
            ...expenseDb.expense[getIdx],
            ...req.body
        }
        fs.writeFileSync('./db.json',JSON.stringify(expenseDb))
        
        return res.status(201).send(expenseDb.expense)
    }
})
//delete
app.delete("/expense/:id",(req,res)=>{
    let expenseDb = JSON.parse(fs.readFileSync('./db.json'))
    let getIdx =expenseDb.expense.findIndex(x=>x.id==req.params.id)
    if(getIdx < 0){
        return res.status(404).send('Data Not Found')
    }else{
        expenseDb.expense.splice(getIdx,1)
        fs.writeFileSync('./db.json',JSON.stringify(expenseDb))
        expenseDb = JSON.parse(fs.readFileSync('./db.json'))
        return res.status(200).send(expenseDb.expense)
    }
})

app.listen(PORT,()=>console.log("EXPRESSS API RUNNING"))