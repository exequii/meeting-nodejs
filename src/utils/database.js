const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    try {
        mongoose.set("strictQuery", false);
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster-meeting.vi0ksfc.mongodb.net/${process.env.MONGODB_DBNAME}`
        await mongoose.connect(uri)
        .then(()=>{ console.log('Connected to database!') })
        .catch((err)=>{ console.log(err) })
    }catch (error) {
        console.error(error);
    }
};

module.exports = { connectToDatabase };