import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col } from 'reactstrap'
import Grid from '@material-ui/core/Grid';
import Adminlist from './Condition/Adminlist';

const Homepage = () => {

    let handleClick = () => {
        localStorage.removeItem("token")
    }


    return (
        <>
            <Grid container>
                <Grid item xs={3}>
                    <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: "25%" }}>
                        <h3 className="w3-bar-item">Menu</h3>
                        <Link to="/" className="w3-bar-item w3-button" onClick={handleClick}>Signout</Link>
                        <Link to='/reset' className="w3-bar-item w3-button">reset Password</Link>
                    </div>
                </Grid>
                <Grid item xs={9}>

                    <Adminlist />

                </Grid>
            </Grid>
        </>
    )
}

export default Homepage
