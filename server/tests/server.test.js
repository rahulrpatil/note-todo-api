const expect = require('chai').expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
let {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done()
                }).catch((e) => done(e));
            })
    });

    it('should not create a new todo for invalid input', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done()
                }).catch((e) => done(e));
            })
    })
});

describe('GET /todos', () => {
   it('should get all todos', (done) => {
       request(app)
           .get('/todos')
           .expect(200)
           .expect((res) => {
               expect(res.body.todos.length).to.equal(2);
           })
           .end(done)
   });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app).get(`/todos/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {
        request(app).get('/todos/12345')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app).delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(todos[0].text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(1);
                    done()
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found', (done) => {
        request(app).delete(`/todos/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {
        request(app).delete('/todos/12345')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({completed: true})
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo.completed).to.equal(true);
                    done()
                }).catch((e) => done(e));
            })

    });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({completed: false})
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo.completed).to.equal(false);
                    expect(todo.completedAt).to.equal(null);
                    done()
                }).catch((e) => done(e));
            })
    });
})