const jwt = require('jsonwebtoken');

let data = {
    id: 23,
    password: 'bla bla'
}
let encode = jwt.sign(data, 'hmmm');
console.log(encode);

let decode = jwt.verify(encode, 'hmmm');
console.log(decode);
