require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors  = require('cors')
const app = express()
const PORT = process.env.PORT
const Person = require('./model/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :person'))
morgan.token('person', (request,response)=>JSON.stringify(request.body))


app.get("/api/persons", (request,response)=> {

  Person.find({}).then(people=>{
    response.json(people)
  })
})

app.get("/info", (request, response) => {
  Person.find({}).then(people=>{
    response.send(`<p>phonebook has info about ${people.length} people</p><p>${Date()}</p>`)
  })
})


app.get("/api/persons/:id", (request,response,next) => {
  Person.findById(request.params.id).then(person=>{
    response.json(person)
  })
    .catch(error=>next(error))
  })

app.delete("/api/persons/:id", (request,response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

app.post("/api/persons", (request,response,next)=> {
  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })
  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request,response,next)=>{
  const reqPerson = {
    name: request.body.name,
    number: request.body.number
  }
  Person.find({}).then(person=>{
    const filterPerson = person.filter(filtPerson=>filtPerson.name === reqPerson.name)
    Person.findByIdAndUpdate(filterPerson[0]._id.toString(),reqPerson,{new: true, runValidators: true, context: "query"})
      .then(updatedPerson=>{
        response.json(updatedPerson)
      })
      .catch(error=>{
        next(error)
      })
  })
})

const errorHandler = (error,request,response,next) => {

  if(error.name === "CastError"){
    return response.status(400).send({error: "malformatted id"})
  }
  else if(error.name === "ValidationError"){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

app.listen(PORT, ()=> {
    console.log(`Server running at port: ${PORT}`)
})


