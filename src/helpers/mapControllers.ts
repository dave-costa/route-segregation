export { mapControllers }
// make const called person with very datas about person called dave, things how name, age ... ultil fifty things
const person = {
  name: "dave",
  age: 50,
  address: {
    street: "street",
    city: "city",
    state: "state",
    country: "country",
  },
}

const mapControllers = (controller: any, dataControllers: any) => {
  for (const dataController of dataControllers) {
    if (dataController.controllers == controller) {
      return dataController
    }
  }
}
