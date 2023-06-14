export { mapMethods }

const mapMethods = (method: string, payload: any = null) => {
  let methods: any = {
    GET: "index",
    "GET/ID": "show",
    POST: "store",
    PUT: "update",
    DELETE: "update",
  }
  if (method == "GET" && payload != null) {
    return methods["GET/ID"]
  }
  return methods[`${method}`]
}
