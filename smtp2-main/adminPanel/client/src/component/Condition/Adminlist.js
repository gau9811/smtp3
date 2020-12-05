import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Row } from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import Axios from 'axios';



const Adminlist = () => {

    let [array, setArray] = useState([])
    let [role, setRole] = useState()

    useEffect(() => {
        Axios('/api/profiles', {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "token": localStorage.getItem("token")
            },
        }).then(res => {
            if (res.data.message) {
                setRole(res.data.role)
                setArray(res.data.message)
            }
        })
    }, [])

    return (
        <div>
            <div style={{ marginLeft: '25px' }}>
                <div className="w3-container w3-teal">
                    {role == 1 && <h1>Hey Admin</h1>}
                    {role == 0 && <h1>Hey USER</h1>}
                </div>
                <div className="w3-container"></div>
            </div>
            {role == 1 &&
                <Grid Container>
                    {array.map((item, i) => {
                        return (
                            <Card key={i} className="mt-5">
                                <CardContent>
                                    <Grid sm={4}>
                                        <Typography color="textSecondary" gutterBottom>
                                            {item.name}
                                        </Typography>
                                    </Grid>
                                    <Grid sm={4}>
                                        <Typography color="textSecondary" gutterBottom>
                                            {item.email}
                                        </Typography>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </Grid>
            }
        </div>
    )
}

export default Adminlist
