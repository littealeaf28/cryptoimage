import React from 'react';

const Display = (props) => {
    let main;
    if (props.receivedImg.length > 0) {
        main = <div id="display"><h3>Finished Image...</h3><div><img src={props.receivedImg} alt="Cannot render" /></div><div><a href={props.receivedImg} download>Click here to download!</a></div></div>;
    }
    else if (props.receivedMsg.length > 0) {
    main = <div id="display"><h3>Encrypted Message</h3><p>{props.receivedMsg}</p></div>
    }
    return (
        <div>{ main }</div>
    )
}

export default Display