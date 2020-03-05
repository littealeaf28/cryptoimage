import React from 'react';
import Encode from './Encode'
import Decode from './Decode'
import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom'
import Display from './Display';
import Redirect from './Redirect';
import anime from 'animejs/lib/anime.es'

class App extends React.Component {
  state = {
    receivedMsg: '',
    receivedImg: '',
    lockIsRotating: false,
    errorMsg: ''
  }
  // Way for Encode component to pass image to App component
  encodeImg = (receivedImg) => {
    this.setState({
      receivedImg: receivedImg,
    });
    setTimeout(() => {
      this.scaleImage(document.getElementById('output-image'));
    }, 10);
  }
  // Way for Decode component to pass message to App component
  decodeMsg = (receivedMsg) => {
    this.setState({
      receivedMsg: receivedMsg,
    });
  }
  // Way for subcomponents to pass error message to App component
  obtainError = (errorMsg) => {
    this.setState({
      errorMsg: errorMsg
    });
  }
  // Converts image array to base 64 string; used to shrink file size in order successfully send to backend
  arrToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  scaleImage = (image) => {
    image.classList.remove('fill-width');
    image.classList.remove('fill-height');

    const widthScale = 0.8 * window.innerWidth / image.clientWidth;
    const heightScale = 0.4 * window.innerHeight / image.clientHeight;

    const fillClass = (widthScale <= heightScale) ? 'fill-width' : 'fill-height';

    image.classList.add(fillClass);
  }
  
  resetReceivedState = () => {
    this.setState({
      receivedMsg: '',
      receivedImg: '',
      errorMsg: ''
    });
  }

  getPageLoadAnime = () => {
    const mainDisplay = document.querySelector('.main-display');
    const mainDisplayObj = {
        height: mainDisplay.clientHeight + 'px'
    }
    const pageLoadAnime = anime({
        targets: mainDisplayObj,
        height: (window.innerHeight - 52) + 'px',
        duration: 4000,
        easing: 'linear',
        update: function() {
            mainDisplay.style.height = mainDisplayObj.height;
        }
    });
    return pageLoadAnime;
  }
  revertMainDisplay = () => {
    document.querySelector('.main-display').style.height = 'initial';
  }
  getLockLoadAnime = () => {
    const lockLoadAnime = anime({
      targets: '.lock img',
      rotate: 360,
      loop: true,
      duration: 2000
    });
    return lockLoadAnime;
  }

  setLockRotating = () => {
    this.setState({
      lockIsRotating: true
    });
  }
  setLockNotRotating = () => {
    this.setState({
      lockIsRotating: false
    });
  }
  shakeLock = () => {
    if (!this.state.lockIsRotating) {
      anime({
          targets: '.lock img',
          keyframes: [
              { rotate: 10 },
              { rotate: -10 },
              { rotate: 0 }
          ]
      });
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div id="App">
          <div className="wrapper">
            <section className="main-display">
              <h1>CryptoImage</h1>
              <p><em>Fun way to encrypt messages to friends!</em></p>
              <NavLink to="/encode" onClick={this.resetReceivedState}>Encode</NavLink>
              <NavLink to="/decode" onClick={this.resetReceivedState}>Decode</NavLink>
              <div id="main">
                <Switch>
                  <Route path="/encode" render={(props) => <Encode {...props} encodeImg={this.encodeImg} getPageLoadAnime={this.getPageLoadAnime} revertMainDisplay={this.revertMainDisplay} getLockLoadAnime={this.getLockLoadAnime} setLockNotRotating={this.setLockNotRotating} setLockRotating={this.setLockRotating} shakeLock={this.shakeLock} arrToBase64={this.arrToBase64} scaleImage={this.scaleImage} obtainError={this.obtainError}/>}/>
                  <Route path="/decode" render={(props) => <Decode {...props} decodeMsg={this.decodeMsg} getPageLoadAnime={this.getPageLoadAnime} revertMainDisplay={this.revertMainDisplay} getLockLoadAnime={this.getLockLoadAnime} setLockNotRotating={this.setLockNotRotating} setLockRotating={this.setLockRotating} shakeLock={this.shakeLock} arrToBase64={this.arrToBase64} scaleImage={this.scaleImage} obtainError={this.obtainError}/>}/>
                  <Route path="/*" component={Redirect}/>
                </Switch>
              </div>
            </section>
          </div>
          <svg className="border-curve" viewBox="0 0 1038 37" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h1038v37H0z"/>
            <path d="M173 21.82C112 2.78 56 2.264 0 19.246V37h1038V19.247c-61 19.04-117 19.554-173 2.572-61-19.04-117-19.554-173-2.572-61 19.04-117 19.554-173 2.572-61-19.04-117-19.554-173-2.572-61 19.04-117 19.554-173 2.572z"/>
          </svg>
          <Display receivedImg={this.state.receivedImg} receivedMsg={this.state.receivedMsg} errorMsg={this.state.errorMsg}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
