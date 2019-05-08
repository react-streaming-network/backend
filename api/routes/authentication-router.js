const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

const db = require('../../db/helpers/usersDb');
const errorHandler = require('../../db/errorHandler');
const authMiddleware = require('../../custom_middleware/authMiddleware')

const router = express.Router();

const getToken = user => {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    }
    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, process.env.JWT_SECRET, options)
}

router.post('/register', (req, res) => {
    try {
        if(req.body.role){
            res.status(401).json({
                message: "You should not be setting the role on this http request"
            })
        }else{
            req.body.password = bcrypt.hashSync(req.body.password, 12)
            db
                .add(req.body)
                .then(user => {
                    res.status(201).json(user)
                })
                .catch(error => {
                    res.status(400).json(errorHandler(error))
                })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server could not register user",
            error
        })
    }
});

router.post('/login', (req, res) => {
    const {username, password} = req.body
    db.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = getToken(user);
                res.status(200).json({ 
                    message: `Welcome ${user.username}`,
                    token,
                    role: user.role
                })
            }else{
                res.status(401).json({ message: 'Invalid Credentials'})
            }
        })
        .catch(error => {
            res.status(500).json({
                message:"Server could not login user",
                error
            })
        })
});

router.get('/users', authMiddleware.restricted, authMiddleware.checkIfAdmin, (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({
                message:"Server could not get users",
                error
            })
        })
});

router.get('/users/:id', authMiddleware.restricted, authMiddleware.checkIfAdmin, (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({
                    message: "User with given id could not be found"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message:"Server could not get user",
                error
            })
        })
});

module.exports = router;