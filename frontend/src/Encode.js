import React from 'react';

class Encode extends React.Component {
    state = {
        imageArray: null,
        imageURI: null,
        msg: '',
        receivedImg: ''
    }
    processImage = (e) => {
        const readerArray = new FileReader(), readerURI = new FileReader();
        const imageFile = e.target.files[0];

        if (imageFile) {
            readerArray.readAsArrayBuffer(imageFile);
            readerURI.readAsDataURL(imageFile);
            document.getElementById('product-display').classList.remove('hidden');
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
        });
    }
    getCryptoImage = async (e) => {
        e.preventDefault();
        this.props.encodeImg('')
        const res = await fetch('http://localhost:5000/encode', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ msg: this.state.msg, imageArray: this.arrToBase64(this.state.imageArray) })
        })
        const data = await res.blob();
        const url = URL.createObjectURL(data)
        this.props.encodeImg(url);
    }
    arrToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    updateMsg = (e) => {
        e.preventDefault();
        this.setState({ msg: e.target.value });
    }
    render() {
        return (
            <div id="file-container">
                <form onSubmit={this.getCryptoImage}>
                    <p>Please select an image to cryptify</p>
                    <input type="file" accept="image/*" onChange={this.processImage} name="imageFile" required/>
                    <div id="product-display" className="hidden">
                        <h3>Image Preview</h3>
                        <img src={this.state.imageURI} alt="Cannot render"/>
                    </div>
                    <div>
                        <textarea placeholder="Enter in the message you wish to cryptify within in the image here..." name="msg" required value={this.state.msg} onChange={this.updateMsg}></textarea>
                    </div>
                    <input type="submit" value="Encodify"/>
                </form>

                { this.state.receivedImg.length > 0 &&
                <div>
                    <img src={this.state.receivedImg} alt="Cannot render"></img>
                    <a href={this.state.receivedImg} download>Click here to download!</a>
                </div> }
            </div>   
        );
    }
}

export default Encode;