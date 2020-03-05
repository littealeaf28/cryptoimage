import React from 'react';

// Redirects the user whenever URL isn't recognized
const Redirect = (props) => {
    props.history.push('/encode');
    return ( <div></div> )
}

export default Redirect