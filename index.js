const { application } = require('express');
const express = require('express');
const app = express();

const session = require('express-session');

//gerador de código
const crypto = require("crypto");
 
const sendEmail = require('./email/sendEmail');


//DATABASE
const connection = require('./database/database')

const User = require('./database/User')

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());


connection.authenticate()
    .then(()=>{console.log('conexão com o database ok!')})
    .catch(()=>{console.log('erro no database!')})

//

//SESSIONS
app.use(session({
    secret: '0d12d12312312dqsdujk3tn34',
    cookie: {maxAge: 300000}
}))

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register/save', (req, res)=>{

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.create({
        username,
        email,
        password
    }).then(()=>{
        res.redirect('/login')
    }).catch((err)=>{
        res.redirect('/register')
    })
})

app.get('/verify', (req, res)=>{

    res.render('verify')
})

app.post('/verify/authenticate', (req,res)=>{

    var code = req.body.code;

    console.log('chegou aqui ' + req.session.code + ' dadw' + code)

    if (code == req.session.code) {

        User.update({verified: true}, {
            where: {
                email: req.session.email
            }
        }).then(()=>{
            res.redirect('/verified')
        }).catch((err)=>{
            res.redirect('/login')
        })
    } else {
        res.redirect('/verified')
    }

})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login/authenticate', (req, res)=>{
    
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user =>{


        if (user.password == password) {

            //session
            req.session.email = email;
                
            if (user.verified) {
                res.render('verified', {user:user})
            } else {

                //gerar código de verificação
                var code = crypto.randomBytes(3).toString("hex");  
                req.session.code = code;

                console.log('------------------------')
                console.log(req.session.email + ' + ' + code)
                console.log('------------------------')

                //mandar email
                sendEmail(req.session.email, code);
    

                res.redirect('/verify')
            }

        } else {
            res.redirect('/login')
        }
       
    }).catch((err)=>{
        res.redirect('/register')
    })
})


app.get('/verified', (req,res)=>{

    console.log(req.session.email)

    User.findOne({
        where: {
            email: req.session.email 
        }
    }).then((user)=>{
        res.render('verified', {user:user})
    })
})

//função para gerar código


app.listen(2000, ()=>{
    console.log('Servidor rodando na porta 2000!')
})


