import React, { useState, useEffect } from 'react'
import { Sent_Link } from '../helper/ApiCalls'
import { Button, Col, Row, Input } from 'reactstrap'

const SentLink = ({ match }) => {


    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [msg, setMsg] = useState('')
    let [msg2, setMsg2] = useState('')
    let [toggle, setToggle] = useState(false)
    let [toggle2, setToggle2] = useState(false)


    let handleSubmit = () => {

        if (email === '' && password === '') {
            setMsg(true)
            setMsg("The field is empty")
        } else {


            console.log(email, password)

            let token = match.params.token

            Sent_Link({ email, password, token })
                .then(res => {
                    if (res?.data?.message) {
                        setToggle2(true)
                        setMsg2('password changed')
                    } else {
                        setTimeout(() => {
                            setToggle2(false)
                            setMsg('')
                        }, 2000)
                    }

                    if (res?.data?.error) {
                        setToggle(true)
                        setMsg(res.data.error)
                    } else {
                        setTimeout(() => {
                            setToggle(false)
                            setMsg('')
                        }, 2000)
                    }



                }).catch(err => console.log(err))
        }
    }



    return (
        <div>
            <div>
                {toggle && (
                    <p className="text text-danger text-center">{msg}</p>
                )}
                {toggle2 && (
                    <p className="text text-success text-center">{msg2}</p>
                )}
                <div>
                    <div>
                        <div className="wrapper fadeInDown" style={{ marginTop: "100px" }}>
                            <div className="formContent">
                                <div className="fadeIn first">
                                </div>
                                <Row>
                                    <Col sm="12">
                                        <Input type="text" className="fadeIn second mt-4 w-50" name="login" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </Col>
                                    <Col sm="12">
                                        <Input type="text" className="fadeIn second mt-4 w-50" name="login" placeholder="new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </Col>
                                    <Col sm="12">
                                        <Button type="button" className="fadeIn fourth btn btn-primary mb-2 mt-5" onClick={handleSubmit}>Change Password</Button>
                                    </Col>
                                    <Col sm="12">
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </div>

        </div>
    )
}

export default SentLink
