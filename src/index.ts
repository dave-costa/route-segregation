import { Request, Response } from "express"
import { mapControllers, mapMethods } from "./helpers"

import path = require("node:path")
const rootDirectory = process.cwd()
const jsonconfig = require(path.join(
  rootDirectory,
  "",
  "route.segregation.json"
))

const route = async ({ mainPath, app }: IRouter) => {
  return app.all(mainPath, async (req: Request, res: Response) => {
    const method = req.method
    const dataQueries = req.query.data
    const dataQueryFiltred = String(dataQueries)
      .split(",")
      .reduce(
        (dataControllersAndControllersAndApi: any, values: any) => {
          let filterArrayAndId = values.split("=")

          if (filterArrayAndId.length > 1) {
            let controller = filterArrayAndId[0]
            let payload = filterArrayAndId[1]
            dataControllersAndControllersAndApi.controllers.push(controller)
            let dataControllersAndApi = {
              controller: controller,
              payload: payload,
            }

            dataControllersAndControllersAndApi.controllersAndId.push(
              dataControllersAndApi
            )
          } else {
            dataControllersAndControllersAndApi.controllers.push(
              filterArrayAndId[0]
            )
            dataControllersAndControllersAndApi.controllersAndId.push({
              controllers: filterArrayAndId[0],
              payload: null,
            })
          }

          return dataControllersAndControllersAndApi
        },
        { controllers: [], controllersAndId: [] }
      )

    const controllersFromApi = dataQueryFiltred.controllers.join(",")
    if (
      typeof controllersFromApi === "string" &&
      controllersFromApi.length > 0
    ) {
      const controllersFromApiArray = controllersFromApi.split(",")

      const controllersDirectory = path.join(
        rootDirectory,
        jsonconfig.controllers
      )
      const controllersData: any = []
      for (const controllerFile of controllersFromApiArray) {
        const controllerFromMap = mapControllers(
          controllerFile,
          dataQueryFiltred.controllersAndId
        )
        let methodFromMapMethod = mapMethods(method, controllerFromMap.payload)
        const controllerPath = path.join(controllersDirectory, controllerFile)
        let ControllerModule = require(controllerPath).default
        console.log(controllerFromMap)
        if (controllerFromMap.payload != null) {
          try {
            controllersData.push(
              new ControllerModule()[methodFromMapMethod](
                req,
                controllerFromMap.payload
              )
            )
          } catch (error: any) {
            if (
              error.message ==
              "(intermediate value)[methodFromMapMethod] is not a function"
            ) {
              throw new Error(
                `Method ${methodFromMapMethod} does not exist in ${controllerFile}`
              )
            }
            throw new Error(error.message)
          }
        } else {
          try {
            controllersData.push(
              new ControllerModule()[methodFromMapMethod](req)
            )
          } catch (error: any) {
            if (
              error.message ==
              "(intermediate value)[methodFromMapMethod] is not a function"
            ) {
              throw new Error(
                `Method ${methodFromMapMethod} does not exist in ${controllerFile}`
              )
            }
            throw new Error(error.message)
          }
        }
      }
      const computedData = Object.assign({}, ...controllersData)
      return res.json(computedData)
    }
    return
  })
}

type IControllerFunctions = (req: any, res: any, next: any) => any
interface IRouter {
  mainPath: string
  app: any
  //method: "get" | "post" | "put" | "delete"
  //middlewares?: IControllerFunctions[]
  //controllerNames: IControllerFunctions
}

export { route }
