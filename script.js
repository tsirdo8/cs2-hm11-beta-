const express = require('express');
const app = express();

connectDB = require('./db/db')
connectDB()
app.use(express.json());


const usersRoute = require('./routes/users.route')
const postRoute = require('./routes/posts.route')
const authRoute = require('./auth/auth.route');
const isAuth = require('./middleware/isAuth.middleware');
const cors = require('cors')

app.use(cors())
app.use('/posts', isAuth,postRoute)
app.use('/users',isAuth, usersRoute)
app.use('/auth', authRoute) 


app.get('/', (req,res)=>{
    res.send('Hello World')
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})


