const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 3001


const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern-todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected To DB'))
    .catch(console.error)

const Todo = require('./models/Todo')

// CREATE==================================================

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    })

    todo.save()
    res.json(todo)
})

// READ==================================================

app.get('/todos', async (req, res) => {
    const todos = await Todo.find()
    res.json(todos)
})

// UPDATE==================================================
app.route('/todo/update/:id').post(async (req, res) => {
    try {
        const id = req.params.id
        const todo = await Todo.findByIdAndUpdate(id, { text: req.body.text })
        todo.save()
        res.json(todo)
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)
    todo.complete = !todo.complete
    todo.save()
    res.json(todo)
})

// DELETE==================================================

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndRemove(req.params.id)
    res.json(result)
})

if (process.env.NODE_ENV === 'production') {
    const reqPath = path.join(__dirname, "client", "build")
    app.use(express.static(reqPath))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

app.listen(PORT, () => console.log('server started'))