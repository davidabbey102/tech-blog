const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const bcrypt = require('bcrypt')
const session = require('express-session')

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['[password'] }
    }).then(dbUserData => {
        res.json(dbUserData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ]
        }, {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
                model: Post,
                attributes: ['title']
            }
        }, {
            model: Post,
            attributes: ['title'],
        }]
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.post('/', (req, res) => {

    User.create({
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.user_name = dbUserData.user_name;
            req.session.logged_in = true;

            res.json(dbUserData);
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            user_name: req.body.user_name
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            req.session.destroy()
            res.status(400).json({ message: 'Incorrect username or password!' });
            return;
        } else {
            const validPassword = bcrypt.compareSync(req.body.password, dbUserData.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect username or password!' })
                return;
            } else {
                req.session.user = {
                    user_name: dbUserData.user_name,
                    email: dbUserData.email,
                    id: dbUserData.id
                }
                res.json({ user: dbUserData, message: 'You are now logged in!' });
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy()
    console.log("session destroyed")
    res.redirect('/')
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with provided ID' });
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with provided ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;