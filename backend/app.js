// const { redisClient } = require('./redis.config')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 1337
const verifyToken = require('./middleware/validateToken')
const dashboardRoutes = require('./routes/dashboard')
const connectToMongoDB = require('./config/db')
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
})

//.
const redis = require('redis');
const redisClient = redis.createClient();

redisClient.connect() // necessary if you're using redis v4+

redisClient.on('connect', () => {
  (async () => {
    console.log('Connected to our redis instance!')
  })()
})
// module.exports = { redisClient };

const { socketHandler } = require('./sockets/socket')

dotenv.config()

app.use(cors())
app.use(express.json())

socketHandler(io)

connectToMongoDB();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb' }));

//import routes
const authRoutes = require('./routes/auth')
const faceRoutes = require('./routes/faceRoute')

// route middlewares
app.use('/api/user', authRoutes)
app.use('/api/auth', faceRoutes)

// this route is protected with token
app.use('/api/dashboard', verifyToken, dashboardRoutes)

server.listen(port, () => {
  console.log('listening on port 1337')
})

// module.export = io;
