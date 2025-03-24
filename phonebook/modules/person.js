const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
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
        validate:[
            {
                validator: function(v) {
                    return /^[^a-zA-Z]*$/.test(v);
                },
                message: 'must not contain any alphabetic characters (A-Z or a-z).'
            },
            {
               validator: function(v) {
                   const numberSections = v.split('-')
                   return numberSections.length === 2
               },
               message: 'must contain exactly one "-" separating two parts.'
            },
           {
                validator: function(v) {
                    const numberSections = v.split('-')
                    const firstPartLength = numberSections[0].length;
                    return firstPartLength >= 2 && firstPartLength <= 3;
 
                },
                message: 'first part of number should be 2 or 3 digits long'
            }

        ]
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)