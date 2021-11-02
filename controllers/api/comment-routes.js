const router = require('express').Router()
const { Comment, Post, User } = require('../../models')
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Comment.findAll({
        include: [{ model: User }]
    }).then(dbComments => {
        res.json(dbComments)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        }).then(dbComments => {
            res.json(dbComments)
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }
})

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbComments => {
        if (!dbComments) {
            res.status(404).json({ message: 'No comment found with provided ID.' })
            return
        }
        res.json(dbComments)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router