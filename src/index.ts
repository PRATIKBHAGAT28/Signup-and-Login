import 'dotenv/config'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { NextFunction, Request, Response } from 'express'

import { connect, disconnet } from './utils/db'
// routes import
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
//middleware imports
import { validateUser } from './middlewares/auth'

const { PORT = 8080, MONGO_DATABASE_URL } = process.env

const app = express()

app.use(cors())

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())
// app.use(httpContext.middleware);
// app.use(function(req: Request, _res: Response, next: NextFunction) {
//   let reqId = short.generate();
//   httpContext.set('reqId', reqId);
//   req['reqId'] = reqId;
//   next();
// });
app.use(
  morgan(`[] :method :url :status :res[content-length] - :response-time ms`)
)

//routes
app.use('/auth', authRoutes)
app.use('/user', <express.RequestHandler>validateUser, userRoutes)

app.get('/', (_req, res) => {
  res.send('Hello World!')
  return
})

//middleware for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    statusCode: 404,
    message: 'Not Found',
    error: 'Not Found',
  })
  return
})

// midllware to handle general error in app.
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(400).json({
    status: false,
    statusCode: 400,
    message: error?.message ?? error ?? 'Bad Request',
    error: 'Bad Request',
  })
  return
})

// server
let server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  connect({
    connectionUrl: MONGO_DATABASE_URL,
  })
})

// listening termination signals to shutdown server.

// OS shutdown
process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')
  disconnet()
  server.close(() => {
    console.debug('HTTP server closed')
    process.exit(0)
  })
})

// app shutdown manually
process.on('SIGINT', () => {
  console.debug('SIGINT signal received: closing HTTP server')
  disconnet()
  server.close(() => {
    console.debug('HTTP server closed')
    process.exit(0)
  })
})
