import React from 'react';

class Decode extends React.Component {
    state = {
        imageArray: null,
        imageURI: null,
        receivedMsg: ''
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
    getCryptoMsg = async (e) => {
        e.preventDefault();
        this.props.decodeMsg('');
        const res = await fetch('http://localhost:5000/decode', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ imageArray: this.arrToBase64(this.state.imageArray) })
        })
        const data = await res.text();
        this.props.decodeMsg(data);
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
    render() {
        return (
            <div id="file-container">
                <form onSubmit={this.getCryptoMsg}>
                    <p>Please select an image to cryptify</p>
                    <input type="file" accept="image/*" onChange={this.processImage} name="imageFile" required/>
                    <div id="product-display" className="hidden">
                        <h3>Image Preview</h3>
                        <img src={this.state.imageURI} alt="Cannot render"/>
                    </div>
                    <input type="submit" value="Decodify"/>
                </form>

                { this.state.receivedMsg.length > 0 &&
                <div>
                    <h3>{this.state.receivedMsg}</h3>
                </div> }
            </div>   
        );
    }
}

export default Decode;