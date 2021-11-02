const { User } = require('../models');

const userData = [{
    user_name: 'John',
    email: 'john@joe.joe',
    password: '$2b$05$4C9TpL09IiPxekQ/T50ct.Oy0liVAgolrw1z6frO9Guz.NUoeeSey'
}, {
    user_name: 'Jake',
    email: 'jake@joe.joe',
    password: '$2b$05$4C9TpL09IiPxekQ/T50ct.Oy0liVAgolrw1z6frO9Guz.NUoeeSey'
}, {
    user_name: 'Joe',
    email: 'joe@joe.joe',
    password: '$2b$05$4C9TpL09IiPxekQ/T50ct.Oy0liVAgolrw1z6frO9Guz.NUoeeSey'
}];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;