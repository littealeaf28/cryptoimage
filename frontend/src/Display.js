import React from 'react';

const Display = (props) => {
    let main;
    if (props.receivedImg.length > 0) {
        main = <div className="image-display result"><h3>Finished Image...</h3><div><img id="output-image" src={props.receivedImg} alt="Cannot render" /></div><div><a href={props.receivedImg} download>Click here to download!</a></div></div>;
    }
    else if (props.receivedMsg.length > 0) {
        main = <div className="msg-display result"><h3>Encrypted Message</h3><p>{props.receivedMsg}</p></div>
    }
    else if (props.errorMsg.length > 0) {
        main = <div className="msg-display result"><h3>Error</h3><p>{props.errorMsg}</p></div>
    }
    return (
        <div>{ main }</div>
    )
}

export default Display