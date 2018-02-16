const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// let data = {
//     id: 23,
//     password: 'bla bla'
// }
// let encode = jwt.sign(data, 'hmmm');
// console.log(encode);
//
// let decode = jwt.verify(encode, 'hmmm');
// console.log(decode);

bcryptjs.genSalt(10, (err, salt) => {
    console.log(salt);
    bcryptjs.hash('pass', salt, (err, hash) => {
        console.log(hash);
    })
});

bcryptjs.compare('pass', '$2a$10$Y0O4Kl42pAL1YY1OBhrWYeMzuBdTS8Z/EPRdBH2gMLIlNE.j37irq', (err, res) => {
    console.log(res);
})
