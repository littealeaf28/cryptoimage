import React from 'react';
import lock from './lock.png';

class Encode extends React.Component {
    state = {
        imageArray: null,
        imageURI: null,
        msg: '',
    }
    // Sends image and message to backend and returns the image URI to display to website
    getCryptoImage = async (e) => {
        e.preventDefault();

        const lockLoadAnime = this.props.getLockLoadAnime();
        lockLoadAnime.play();
        this.props.setLockRotating();

        const pageLoadAnime = this.props.getPageLoadAnime();
        pageLoadAnime.play();

        fetch('http://localhost:5000/encode', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ msg: this.state.msg, imageArray: this.props.arrToBase64(this.state.imageArray) })
        })
        .then((res) => res.blob())
        .then((imageData) => {
            this.props.encodeImg(URL.createObjectURL(imageData));
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
            this.props.obtainError('Oops! Looks like we cannot work with your image for some reason. Please check that you are using png, jpg, or other similar images. Certain file types like svg are not supported.');
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
    // Ensures that the value of message is in sync with that of the input
    updateMsg = (e) => {
        this.setState({ msg: e.target.value });
    }
    render() {
        return (
            <form id="encode-form" onSubmit={this.getCryptoImage}>
                <div>
                <input type="file" accept="image/*" onChange={this.processImage} name="imageFile" required/>
                </div>
                <div className="image-display hidden">
                    <h3>Image Preview</h3>
                    <img className="input-image" src={this.state.imageURI} alt="Cannot render"/>
                </div>
                <div>
                    <textarea placeholder="Enter in the message you wish to cryptify within in the image here..." onChange={this.updateMsg} required></textarea>
                </div>
                <div className="lock">
                    <img src={lock} alt="Encodify"/>
                    <input type="submit" onMouseOver={this.props.shakeLock}/>
                </div>
            </form>
        );
    }
}

export default Encode;