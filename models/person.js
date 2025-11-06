const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

//const password = process.argv[2]
// const newName = process.argv[3]
// const newNumber = process.argv[4]
//const password = process.env.password



// const url = `mongodb+srv://amish2g:${password}@cluster0.xtbuvch.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
// mongoose.set('strictQuery',false)

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

//mongoose.connect(url)

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: newName,
//   number: newNumber,
// })


module.exports = mongoose.model('Person', personSchema)