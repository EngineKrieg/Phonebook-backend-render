const mongoose = require("mongoose")
const url = process.env.MONGODB_URI
console.log("____connecting to mongoDB____")

mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result=> {
    console.log("connected to mongoDB",url)
})
    .catch(error => {
        console.log("failed to connect to mongodb", error)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v){
                return /\d{2,3}-\d{5,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true,'User phone number required']
    }
})

personSchema.set("toJSON",{
   transform:  (doc, returnObj) =>{
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
   }
})

module.exports = mongoose.model("Person", personSchema)
