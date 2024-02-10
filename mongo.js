const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


mongoose.set('strictQuery',false)
mongoose.connect(url)



const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number
})

if(name && number){
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })    
}

console.log(process.argv)

if(process.argv.length==3){
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })

        mongoose.connection.close()
    })
}
