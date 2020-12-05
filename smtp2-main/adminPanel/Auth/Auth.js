let express = require('express')
let router = express()
let multer = require('multer')
let storage = multer.memoryStorage()
let upload = multer({ storage: storage })
let User = require('../models/User')
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
require('dotenv').config()
let CheckAprofile = require('../middleware/CheckAprofile')
let nodemailer = require('nodemailer')
let async = require('async')
let crypto = require('crypto')


router.post('/Signup', async (req, res) => {

    const { name, email, password } = req.body

    let file = req.file

    if (!name || !email || !password) {
        res.json({ message: `Please fill the fields` })
    }

    try {
        let CheckUser = await User.findOne({ email: email })

        if (CheckUser) {
            res.json({ error: `There is Already a email id exist at this name ${email}` })
        }

        if (!CheckUser) {
            const salt = bcrypt.genSaltSync(10);

            let newUser = {
                name: name,
                email: email,
                password: bcrypt.hashSync(password, salt),

            }


            let saveUser = new User(newUser)

            saveUser.save()

            res.json({ message: "user has been saved" })
        }

    } catch (error) {
        res.status(500).json({ error: 'Internel server Error' })
    }



})


router.get('/profiles', CheckAprofile, async (req, res) => {
    try {

        let Admin = await User.find({}).select('-image')
        let user = await User.find({}).select(['-email', '-password', '-name'])



        if (req.admin.role === 1) {
            res.json({ role: 1, message: Admin })
        }


        if (req.user.role == 0) {

            res.json({ role: 0, message: user.map(item => item.image) })
        }




    } catch (error) {
        res.status(500).json({ error: 'Internel server Error' })
    }

})


router.post('/login', async (req, res) => {
    let { email, password } = req.body
    console.log(email, password)
    if (!email || !password) {
        res.json({ message: `Please fill the fields` })
    }

    try {
        let CheckUser = await User.findOne({ email: email })

        if (!CheckUser) {
            res.json({ error: `There is no  email id exist at this  ${email}` })
        }

        if (CheckUser) {

            let hashPassword = bcrypt.compareSync(password, CheckUser.password)

            if (hashPassword) {
                let token = jwt.sign({ id: CheckUser._id, role: CheckUser.role }, process.env.SECRET, { expiresIn: 60 * 60 });
                res.json({ token: token })
            } else {
                res.json({ error: "password Incorrect" })
            }


        }

    } catch (error) {
        res.status(500).json({ error: 'Internel server Error' })
    }

})



router.put('/resetPassword', CheckAprofile, async (req, res) => {
    let { email, prevpassword, password } = req.body

    console.log(email, prevpassword, password)
    if (!email && !password) {
        res.json({ error: 'please provide email or passsword' })
    }


    let CheckUser = await User.findOne({ email })

    try {

        if (CheckUser) {

            let checkPrevPassword = bcrypt.compareSync(prevpassword, CheckUser.password);

            if (checkPrevPassword) {

                const salt = bcrypt.genSaltSync(10);

                let hashpassword = bcrypt.hashSync(password, salt)

                var checkUpdate

                await User.findOneAndUpdate({ email: email }, { $set: { password: hashpassword } }, { new: true, upsert: true }, (err, update) => {
                    if (err) {
                        checkUpdate = false
                    }

                    if (update) {
                        checkUpdate = true
                    }
                })

                if (checkUpdate) {
                    res.json({ message: "Password update succesfully" })
                } else {
                    res.json({ error: "Password not updated succesfully" })
                }

            } else {
                if (!checkPrevPassword) {
                    res.json({ message: 'password does not match' })
                }
            }
        }

    } catch (err) {
        res.json({ error: "Internel Server Error" })
    }


})

router.post('/FORGETPASSWORD', (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({
                email: req.body.email
            }).exec(function (err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function (user, done) {
            // create the random token

            crypto.randomBytes(20, function (err, buffer) {
                var token = jwt.sign({ id: 1 }, process.env.SECRET, { expiresIn: 60 * 60 });
                done(err, user, token);
            });
        },
        function (user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function (err, new_user) {
                done(err, token, new_user);
            });
        },
        function (token, user, done) {
            var data = {
                to: user.email,
                from: req.body.email,
                template: 'forgot-password-email',
                subject: 'Password help has arrived!',
                text: 'http://localhost:3000/sent_password/' + token
            };

            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    return res.json({ message: 'Kindly check your email for further instructions' });
                } else {
                    return done(err);
                }
            });
        }
    ], function (err) {
        return res.status(422).json({ message: err });
    });

})



router.put('/update_password', async (req, res) => {
    let { email, password, token } = req.body

    if (!email && !password) {
        res.json({ error: 'please provide email or passsword' })
    }


    let CheckUser = await User.findOne({ email })

    try {

        let verifyToken = await jwt.verify(token, process.env.SECRET)

        if (verifyToken) {

            if (CheckUser) {

                const salt = bcrypt.genSaltSync(10);

                let hashpassword = bcrypt.hashSync(password, salt)

                var checkUpdate

                await User.findOneAndUpdate({ email: email }, { $set: { password: hashpassword } }, { new: true, upsert: true }, (err, update) => {
                    if (err) {
                        checkUpdate = false
                    }

                    if (update) {
                        checkUpdate = true
                    }
                })

                if (checkUpdate) {
                    res.json({ message: "Password update succesfully" })
                } else {
                    res.json({ error: "Password not updated succesfully" })
                }

            }
        } else {
            res.json({ error: 'expires' })
        }


    } catch (err) {
        res.json({ error: "Internel Server Error" })
    }


})




module.exports = router