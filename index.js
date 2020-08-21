const app = require('./app')
const port = process.env.PORT
//console.log(process.env)

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})