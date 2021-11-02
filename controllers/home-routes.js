const router = require('express').Router()
const { Post, User, Comment } = require('../models')

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: { model: User, attributes: ['user_name'] }
        },
        {
            model: User,
            attributes: ['user_name']
        }]
    }).then(dbPost => {
        const allPosts = dbPost.map(post => post.get({ plain: true }))
        res.render('homepage', { allPosts, logged_in: req.session.logged_in })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    res.render('login')
})

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    res.render('signup')
})

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'content', 'title', 'created_at'],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: { model: User, attributes: ['user_name'] }
        }, {
            model: User,
            attributes: ['user_name']
        }]
    }).then(dbPost => {
        if (!dbPost) {
            res.status(404).json({ message: 'No post found with provided ID.' })
        }
        const post = dbPost.get({ plain: true })
        res.render('single-post', { post, logged_in: req.session.logged_in })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router