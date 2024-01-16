const express = require('express')
const morgan = require('morgan')
const cors  = require('cors')
const app = express()
const PORT = process.env.PORT||3001

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :person'))
morgan.token('person', (request,response)=>JSON.stringify(request.body))

let contacts = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]


app.get("/api/persons", (request,response)=> {
    response.json(contacts)
})

app.get("/info", (request, response) => {
  response.send(`<p>phonebook has info about ${contacts.length} people</p><p>${Date()}</p>`);
  
})

app.get("/api/persons/:id", (request,response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if(contact){
    response.json(contact)
  }
  else{
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request,response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 10000000)
  console.log(id)
  return id;
}

app.post("/api/persons", (request,response)=> {

  const body = request.body
  console.log(body)
  if(!body.name || !body.number){
    return response.status(404).json({
      error: "name or number is missing"
    })
  }
  
  if(contacts.some(contact => contact.name === body.name)){
    return response.status(409).json({
      error: "name already exists in the phonebook"
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  contacts = contacts.concat(person)
  response.json(person)
})

app.listen(PORT, ()=> {

    console.log(`Server running at port: ${PORT}`)
})


