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

const allowedOrigins = [
  'https://c2-hm11-front.vercel.app',
  'http://localhost:5173' 
];

const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const upload = require('./config/clodinary.config')
app.use(cors())
app.use('/posts', isAuth,postRoute)
app.use('/users',isAuth, usersRoute)
app.use('/auth', authRoute) 

app.post('/upload', upload.single('image'), async (req, res) => {
  res.send(req.file )
});

app.post('/upload/profile', isAuth, upload.single('image'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


app.post('/upload/post', isAuth, upload.single('image'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Post image uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', (req,res)=>{
    res.send('Hello World')
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})


