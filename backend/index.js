const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("./config/env")
const customerRoutes = require("./routes/customer")
const accountRoutes = require("./routes/account")
const transactRoutes = require("./routes/transact")
const app = express()
app.use(express.json())
app.use(cors())
app.use("/customer",customerRoutes)
app.use("/account",accountRoutes)
app.use("/transact", transactRoutes)
const {PORT,DB_URL} = process.env

//2. Database connection
mongoose.connect(DB_URL).then(() => {
    console.log("MongoDB connection established")
}).catch(error => {
    console.log("Error in MongoDB connection= ",error)
})

//To start the node server
app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`)
})

