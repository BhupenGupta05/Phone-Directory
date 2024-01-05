const { config } = require('dotenv');
config()
const express = require('express');
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');


//REQUEST LOGGER
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//ERROR HANDLER
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

//FOR DISPLAYING ADDRESSES OTHER THAN OURS
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json()) //express JSON parser
app.use(requestLogger)
app.use(express.static('dist'))


// let data = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
//   ]


//INFO

// app.get('/api/data/info', (request, response) => {
//   response.end(`${`Phonebook has info of ${data.length} ${data.length !== 1 ? 'people' : 'person'}`}\n${new Date()}`)
// })

app.get('/api/data/info', async(request, response) => {
  try {
    const count = await Person.countDocuments({})
    const mssg = `Phonebook has info of ${count} ${count !== 1 ? 'people' : 'person'}`
    response.end(`${mssg}\n${new Date()}`)
  } catch (error) {
    console.error('Error counting documents:', error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

//FETCHING ALL THE DATA

app.get('/api/data', (request, response) => {
  Person.find({}).then(contacts => {
    response.json(contacts)
  })
})

//FETCH OPERATION

// app.get('/api/data/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const contact = data.find(item => item.id === id)

//   if (contact) {
//       response.json(contact)
//   } else {
//       response.status(404).end()
//   }
// })

app.get('/api/data/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


//DELETE OPERATION

// app.delete('/api/data/:id', (request, response) => {
//   const id = Number(request.params.id)
//   data = data.filter(item => item.id !== id)

//   response.status(204).end()
// })

app.delete('/api/data/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :req-body', {})
)



//   const generateRandomId = () => {
//     const minId = 1
//     const maxId = 1000000

//     const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId
//     return randomId
//   }


//   app.post('/api/data', (request, response) => {
//     const body = request.body;
//     console.log('Received POST request with body:', body);

//     if (!body.name || !body.number) {
//         console.log('Both name and number are empty');
//         return response.status(400).json({
//             error: 'Name and number must not be empty',
//         });
//      } else {
//       const checkName = data.some((item) => item.name === body.name);

//       if (checkName) {
//         console.log('Name already exists');
//         return response.status(400).json({
//             error: 'Name already exists',
//         });
//       } else {
//         const contact = {
//             id: generateRandomId(),
//             name: body.name,
//             number: body.number,
//         };

//         data = [...data, contact];
//         console.log('Added contact:', JSON.stringify(contact));
//         response.status(201).json(contact);
//     }
//     }

// });


//ADD OPERATION

app.post('/api/data', async (request, response, next) => {
  try {
    const { name, number } = request.body

    if (!name || !number) {
      return response.status(400).json({
        error: 'Name and number must not be empty',
      })
    }

    // Check if the contact already exists in the database
    const existingContact = await Person.findOne({ name })

    if (existingContact) {
      return response.status(409).json({
        error: 'Contact with the same name already exists',
      })
    }

    // Create and save a new contact
    const newContact = new Person({
      name,
      number,
    })

    newContact.save().then(savedContact => {
      response.json(savedContact)
    })

  } catch (error) {
    next(error)
  }
})


//UPDATING NUMBER
//For updating a contact, we will find it by id not by name

app.put('/api/data/:id', async (request, response, next) => {
  try {
    const contactId = request.params.id
    const { number } = request.body

    // Find the contact by its ID
    const existingContact = await Person.findById(contactId)

    if (!existingContact) {
      return response.status(404).json({
        error: 'Contact not found',
      })
    }

    // Update the phone number of the existing contact
    existingContact.number = number

    // Save the updated contact
    const updatedContact = await existingContact.save()
    response.json(updatedContact)
  } catch (error) {
    next(error)
  }
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
