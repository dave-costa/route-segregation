export { mapControllers }

const mapControllers = (controller: any, dataControllers: any) => {
  for (const dataController of dataControllers) {
    if (dataController.controllers == controller) {
      return dataController
    }
  }
}
