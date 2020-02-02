import React from 'react';
import Encode from './Encode'
import Decode from './Decode'
import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom'
import Display from './Display';
import Redirect from './Redirect'

class App extends React.Component {
  state = {
    receivedMsg: '',
    receivedImg: ''
  }
  encodeImg = (receivedImg) => {
    this.setState({
      receivedImg: receivedImg,
      receivedMsg: ''
    })
  }
  decodeMsg = (receivedMsg) => {
    this.setState({
      receivedMsg: receivedMsg,
      receivedImg: ''
    })
  }
  render() {
    return (
      <BrowserRouter>
        <div id="App">
          <nav>
            <h1>CryptoImage</h1>
            <p>Fun way to encrypt messages to friends!</p>
          </nav>
          <div id="main">
              <Switch>
                <Route path="/encode" render={(props) => <Encode {...props} encodeImg={this.encodeImg}/>}/>
                <Route path="/decode" render={(props) => <Decode {...props} decodeMsg={this.decodeMsg}/>}/>
                <Route path="/*" component={Redirect}/>
              </Switch>
          </div>
          <div id="options">
            <NavLink to="/encode">Encode</NavLink>
            <NavLink to="/decode">Decode</NavLink>
          </div>
          <Display receivedImg={this.state.receivedImg} receivedMsg={this.state.receivedMsg}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
