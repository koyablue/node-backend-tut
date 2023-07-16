import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import * as dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import * as morgan from "morgan"

dotenv.config()

const handleError = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({message: err.message})
}

AppDataSource.initialize().then(async () => {

  // create express app
  const app = express()
  app.use(morgan('tiny'))
  app.use(bodyParser.json())

  // register express routes from defined application routes
  Routes.forEach(route => {
    (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
      try {
        const result = await (new (route.controller as any))[route.action](req, res, next)
        res.json(result)
      } catch (error) {
        next(error)
      }
    })
  })

  // setup express app here
  // ...

  app.use(handleError)

  // start express server
  app.listen(Number(process.env.PORT))

  // insert new users for test
  // await AppDataSource.manager.save(
  //   AppDataSource.manager.create(User, {
  //     firstName: "Timber",
  //     lastName: "Saw",
  //     age: 27
  //   })
  // )

  // await AppDataSource.manager.save(
  //   AppDataSource.manager.create(User, {
  //     firstName: "Phantom",
  //     lastName: "Assassin",
  //     age: 24
  //   })
  // )

  console.log(`Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/users to see results`)

}).catch(error => console.log(error))
