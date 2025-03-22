const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req) {
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

const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000000000)
    return String(randomId)
}
  

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date();
    const personsLength = persons.length

    response.send(`<p>Phonebook has info for ${personsLength} people<p/><br/><p>${date.toString()}<p/>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const foundPerson = persons.find(per => per.id === id)
    if(foundPerson){
        response.json(foundPerson)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(per => per.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
    const userFound = persons.find(per => per.name === body.name)
    if (userFound){
        return response.status(400).json({ 
            error: 'The name already exists in the phonebook' 
          })
    }
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    response.send(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`)
})