let jwt = require('jsonwebtoken')
require('dotenv').config()



module.exports = async (req, res, next) => {
    let token = req.header('token')

    if (!token) {
        res.json({ error: 'There is no token' })
    }


    try {

        if (token) {
            let user = await jwt.verify(token, process.env.SECRET)

            if (user.role === 0) {
                req.user = user
                next()
            }

        }
    } catch (error) {
        res.json({ error: 'internel server error' })
    }

}

