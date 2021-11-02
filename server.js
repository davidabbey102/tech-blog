const express = require('express')
const sequelize = require('./config/connection.js')
const session = require('express-session')
const exphbs = require('express-handlebars')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const app = express()
const PORT = process.env.PORT || 3001

const helpers = require('./utils/helpers')
const hbs = exphbs.create({ helpers })

const routes = require('./controllers')
const path = require('path')

app.engine('handlebars', hbs.engine)
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'handlebars')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2
    },
    store: new SequelizeStore({
        db: sequelize
    })
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT)
    })
})