// all the things we need to import
const express = require('express')
// const Enforcer = require('openapi-enforcer-middleware')
const path = require('path')
const {log_path_middleware} = require('./middleware')
const mongoose = require('mongoose')
const userController = require('./controllers/users')
const eventController = require('./controllers/events')
const assignmentController = require('./controllers/assignments')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const session = require('express-session')
const bcrypt = require('bcrypt');
const userHelper = require('./helpers/users')
const assignmentHelper = require('./helpers/assignments')

// set configuration options
const port = 3000
const saltRounds = 10;
const controllerDirectory = path.resolve(__dirname, 'controllers')
const mockDirectory = path.resolve(__dirname, 'mock-controllers') 
const vueDirectory = path.resolve(__dirname, '../client/dist') 
const staticPath = path.resolve(__dirname, 'public')
const sessionSecretKey = 'abcdef'

const mongoHost = "class_mongo"; // use this in docker
// const mongoHost = "localhost"; // use this when testing locally

// make salt for hashing passwords
const salt = bcrypt.genSaltSync(saltRounds);
const hashMe = (password) => {
  return bcrypt.hashSync(password, salt);
}
const hashMatches = (plaintextPassword, hashedPassword) => {
  return bcrypt.compareSync(plaintextPassword, hashedPassword);
}

// connect to mongodb
mongoose.connect(`mongodb://${mongoHost}:27017/`, { useUnifiedTopology: true, useNewUrlParser: true })
const connection = mongoose.connection;
connection.once('open', async () => {
  console.log("MongoDB connection established.");
  
  // add users to db just for fun
  let newUser = await userHelper.createUser({
    firstName: "John",
    lastName: "Galt",
    phoneNumber: "8011234567",
    email: "whois@gmail.com",
    password: hashMe("abcdef"),
    teacher: false,
  })
  newUser = await userHelper.createUser({
    firstName: "Mary",
    lastName: "Lamb",
    phoneNumber: "8011234321",
    email: "littleLamb@gmail.com",
    password: hashMe("baabaa"),
    teacher: false,
  })
  newUser = await userHelper.createUser({
    firstName: "Mike",
    lastName: "Scott",
    phoneNumber: "8012222222",
    email: "mscarn@gmail.com",
    password: hashMe("momoneymoproblems"),
    teacher: false,
  })
  newUser = await userHelper.createUser({
    firstName: "Ina",
    lastName: "Robertson",
    phoneNumber: "5558675309",
    email: "iRobertson@gmail.com",
    password: hashMe("rosiePosie"),
    teacher: true,
  })

  // add 10 assignments to db just for fun
  let newAssignment = await assignmentHelper.createAssignment({
    title: "Unit 1 Summary",
    queryTitle: "U1Summary",
    description: "Fill out the study guide for unit 1, 1776 - 1810.",
    dueDate: "January 6, 2020"
  })

  newAssignment = await assignmentHelper.createAssignment({
    title: "Unit 2 Summary",
    queryTitle: "U2Summary",
    description: "Fill out the study guide for unit 2, 1810 - 1830.",
    dueDate: "January 18, 2020"
  })

  newAssignment = await assignmentHelper.createAssignment({
    title: "Unit 3 Summary",
    queryTitle: "U3Summary",
    description: "Fill out the study guide for unit 3, 1830 - 1860.",
    dueDate: "January 30, 2020"
  })

});
//error message false
mongoose.set('useFindAndModify', false);

// configure how sessions and authentication work
const authenticateUser = async (email, password) => {
  // look up user in mongodb
  const user = await userHelper.getUserByEmail(email);
  // if user not found return false
  if (!user) return false
  // if password is wrong then return false
  if (!hashMatches(password, user.password)) return false
  // email and password are correct so return user
  return user
}
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await authenticateUser(username, password)
  return done(null, user);
}))
passport.serializeUser((user, done) => {
  // store email in our session
  done(null, user._id)
})
passport.deserializeUser(async (userId, done) => {
  // Look up the user record from mongodb using the user from session
  const user = await userHelper.getUserById(userId);
  done(null, user);
})


// enable node express
const app = express()
app.use(express.json())
app.use(log_path_middleware)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: sessionSecretKey, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// Add error handling middleware
app.use((err, req, res, next) => {
  // If the error was in the client's request then send back a detailed report
  if (err.statusCode >= 400 && err.statusCode < 500 && err.exception) {
    res.set('Content-Type', 'text/plain')
    res.status(err.statusCode)
    res.send(err.message)

  // If it's unsafe to send back detailed errors then send back limited error information
  } else {
    console.error(err.stack)
    res.sendStatus(err.statusCode || 500)
  }
})

// serve static public files
app.use('/', express.static(staticPath))

// serve vue client
app.use('/', express.static(vueDirectory))

//Authentication
// define authentication endpoints
app.post(
  '/api/login', 
  passport.authenticate('local'),
  (req, res) => {
    res.send(req.user.toResult());
  }
);
app.get('/api/logout', function(req, res){
  req.logout();
  res.send("Logged out")
});

// define protected endpoints
app.get('/api/protected',
    function(req, res) {
      // if user doesn't exist on request then deny access  
      if (!req.user) return res.sendStatus(401)
      // otherwise give them what they are asking for
      res.send('You have access.')
    }
)

app.get('/api/users', userController.getUserList)

// endpoints we have not reviewed yet
// app.get('/api/checkUser', function(req, res) {
//   if (req.user) return res.send('Hello ' + req.user.username + "!")
//   res.send('Hello Stranger!')
// })
// app.get('/api/protected',
//     function(req, res) {
//         if (!req.user) return res.sendStatus(401)
//         res.send('You have access.')
//     }
// )
// app.put('/api/auth',
//     passport.authenticate('local'),
//     function(req, res) {
//         res.send('You are authenticated, ' + req.user.username)
//     })
// app.delete('/api/auth', function(req, res) {
//     req.logout()
//     res.send('You have logged out.')
// })

//Users


//app.get('/api/user/:email', userController.getUserByEmail)

app.post('/api/users', userController.createUser)

app.put('/api/user', userController.updateUser)

app.delete('/api/users/:id', userController.deleteUser)

app.get('/api/users/:id', userController.getUser)


//Assignments
app.get('/api/assignments', assignmentController.getAssignmentList)

app.post('/api/assignments', assignmentController.createAssignment)

app.get('/api/assignment/:queryTitle', assignmentController.getAssignment)

app.put('/api/assignments/:queryTitle', assignmentController.updateAssignment)

app.delete('/api/assignments/:queryTitle', assignmentController.deleteAssignment)

// app.get('/index.html', (req, res) => res.send('Hi Maddy!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// app.get('/events', eventController.getEventList)

const listener = app.listen(port, err => {
  if (err) return console.error(err.stack)
  console.log('Server listening on port ' + listener.address().port)
})

