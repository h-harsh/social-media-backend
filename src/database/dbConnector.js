const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

async function dbConnector() {
  try{
    await mongoose.connect(`mongodb+srv://Adminsat:${process.env.KEY}@neog-cluster.ceqpa.mongodb.net/Social-media?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Connected To Database")
  } catch(error) {
    console.log(error, "error connecting to database")
  }
  
}

module.exports = {dbConnector}