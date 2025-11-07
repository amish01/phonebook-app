require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
   
})

// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
 
  if(!(body.name||body.number)) {
    return response.status(400).json({
      error: 'Name or Number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedAddress => {
    response.json(savedAddress)
  })
})

//Ex_3.3
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    console.log(result)
    //response.json(result)
    response.status(204).end()
  })
  .catch(error => next(error))
    // const id = request.params.id
    // persons.filter(person => person.id !== id)

    // response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
   
    if(!body.name || !body.number) {
     return response.status(400).json({
        error: 'something is  missing in your request data'
      })
    }else if(persons.some(person => person.name === body.name)){
      return response.status(400).json({
        error: 'Name must be unique.'
      })
    }

    const newPerson = {
      name: body.name,
      number: body.number,
      id: Math.floor((Math.random() * 1000_000_000)),
    }
  
     persons = persons.concat(newPerson)
    
    response.json(newPerson)
  })

  //update code
  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number  } = request.body
  
    Person.findById(request.params.id)
      .then(person => {
        if (!person) {
          return response.status(404).end()
        }
  
        person.name = name
        person.number = number
  
        return person.save().then((updatedPerson) => {
          response.json(updatedPerson)
        })
      })
      .catch(error => next(error))
  })


//Error handler middleware.
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
