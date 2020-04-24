
const log_path_middleware = (req, res, next) => {
    console.log(req.path)
    console.log(req.method)
    next()
}

// const add_property = (req, res, next) => {
//     //connect
//     next()
// }

// // module.exports = {log_path_middleware, add_property}
module.exports = {log_path_middleware}