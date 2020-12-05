import React from 'react'
import { Redirect, Route } from 'react-router-dom'
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={
                props => localStorage.getItem("token")
                    ?
                    <Component {...props} />
                    :
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: props.location }
                        }}
                    />
            }
        />
    )
}

export default PrivateRoute
