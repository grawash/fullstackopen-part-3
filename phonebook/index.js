require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
  

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    const date = new Date();
    Person.find({}).then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people<p/><br/><p>${date.toString()}<p/>`)
    })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
    // const userFound = persons.find(per => per.name === body.name)
    // if (userFound){
    //     return response.status(400).json({ 
    //         error: 'The name already exists in the phonebook' 
    //       })
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
      response.send(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response) => {
  const {name, number} = request.body
  Person.findById(request.params.id)
    .then(person =>{
      if(!person){
        return response.status(404).end()
      }
      person.name = name
      person.number = number

      person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`)
})