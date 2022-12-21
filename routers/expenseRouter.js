const { getExpense, getDetail, getTotal, create, update, hapus } = require('../controller/expenseController');
const route = require('express').Router();
// list route external
route.get("/list",getExpense)
route.get("/detail/:id",getDetail)
route.get("/total",getTotal)
route.post("/create",create)
route.patch("/update/:id",update)
route.delete("/delete/:id",hapus)

module.exports = route;