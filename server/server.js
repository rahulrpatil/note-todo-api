require('./config/config');

let express = require('express');
let bodyParser = require('body-parser');
const _  = require('lodash');

let {mongoose} = require('./db/mongoose');
let {ObjectID} = require('mongodb');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
    console.log(req.body);
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({
           todos
       })
   }, (e) => {
       res.status(400).send(e)
   });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (todo) {
            return res.send(todo);
        } else {
            return res.status(404).send();
        }
    }, (e) => {
        return res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (todo) {
            return res.send(todo);
        } else {
            return res.status(404).send();
        }
    }, (e) => {
        return res.status(400).send();
    });

});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id ,{ $set: body } ,{ new: true })
        .then((todo) => {
            if (todo) {
                return res.send({todo});
            } else {
                return res.status(404).send();
            }
    }, (e) => {
        return res.status(400).send();
    });

});

app.listen(3000, () => {
   console.log('Started on port 3000');
});

module.exports = { app };
