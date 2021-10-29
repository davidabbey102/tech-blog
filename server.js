const express = reqiure('express')
const sequelize = require('./config/connection')
const session = require('express-session')
const exphbs = require('express-handlebars')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const routes = require('./controllers')
const path = require('path')
const helpers = require('./utils/helpers')

const app = express()
const PORT = process.env.PORT || 3001

const hbs = exphbs.create({ helpers })

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT)
    })
})