import React from 'react';
import lock from './lock.png'

class Decode extends React.Component {
    state = {
        imageArray: null,
        imageURI: null,
    }
    // Sends image to backend and returns the decoded message to the parent to be displayed
    // Catch error and output error message!
    getCryptoMsg = async (e) => {
        e.preventDefault();

        const lockLoadAnime = this.props.getLockLoadAnime();
        lockLoadAnime.play();
        this.props.setLockRotating();

        const pageLoadAnime = this.props.getPageLoadAnime();
        pageLoadAnime.play();

        fetch('http://localhost:5000/decode', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ imageArray: this.props.arrToBase64(this.state.imageArray) })
        })
        .then((res) => res.text())
        .then((msg) => {
            this.props.decodeMsg(msg);
            lockLoadAnime.pause();
            pageLoadAnime.pause();
            this.props.revertMainDisplay();
            this.props.setLockNotRotating();
        })
        .catch((err) => {
            lockLoadAnime.pause();
            pageLoadAnime.pause();
            this.props.revertMainDisplay();
            this.props.setLockNotRotating();
            this.props.obtainError('Oops! The image does not contain a message.');
        });
    }
    // Takes in an image file and converts it both to URI to display to website + to an array to send to the backend
    processImage = (e) => {
        const readerArray = new FileReader(), readerURI = new FileReader();
        const imageFile = e.target.files[0];

        if (imageFile) {
            readerArray.readAsArrayBuffer(imageFile);
            readerURI.readAsDataURL(imageFile);
            document.querySelector('.image-display').classList.remove('hidden');
        }

        readerArray.addEventListener('load', () => {
            this.setState({
                imageArray: readerArray.result,
            });
        });

        readerURI.addEventListener('load', () => {
            this.setState({
                imageURI: readerURI.result,
            });
            setTimeout(() => {
                this.props.scaleImage(document.querySelector('.input-image'));
            }, 10);
        });
    }
    render() {
        return (
            <form id="decode-form" onSubmit={this.getCryptoMsg}>
                <div>
                    <input type="file" accept="image/*" onChange={this.processImage} name="imageFile" required/>
                </div>
                <div className="image-display hidden">
                    <h3>Image Preview</h3>
                    <img className="input-image" src={this.state.imageURI} alt="Cannot render"/>
                </div>
                <div className="lock">
                    <img src={lock} alt="Decodify"/>
                    <input type="submit" onMouseOver={this.props.shakeLock}/>
                </div>
            </form>
        );
    }
}

export default Decode;