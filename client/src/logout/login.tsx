import * as React from 'react';
import { Component } from 'react-simplified';

//Services
import userService from '../service/user-service';

//Component imports
import { Card, Form, Button, Alert } from '../widgets'; // Adjust as necessary
import { history } from '../index';

class Login extends Component {
  inputUsername: string = "";
  inputPassword: string = "";

  //Code for when you press log in
  handleLogin = async () => {
    if (this.inputUsername === '' || this.inputPassword === '') {
      Alert.danger('Vennligst fyll inn brukernavn og passord');
      return;
    }

    try {
      await userService.login(this.inputUsername, this.inputPassword);
      history.push('/profile');

      //Reload window to update the hashroute used from no authentication to authenticated
      window.location.reload();
    } catch (error) {
      Alert.danger('Feil brukernavn eller passord');
      console.log(error);
    }

    this.inputPassword = '';
    this.inputUsername = '';
  };

  // Source: Use of Ai (ChatGPT) on the Key press event to find the React.Keyboard Event 
  // Prompt: Implement the handleKeyDown function to handle the enter key press event on existing login page (Our original code)
  // Then connect the event to a new handleLogin function instead of having it implemented only in the button
  // Handle enter key press by using React.KeyboardEvent
  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      this.handleLogin();
    }
  };

  // Render the card for Login with fields to input username and password and buttons to login and sign up
  render() {
    return (
      <div className='mainContent'>
        <Card title="">
          <div className='whole-login-box' onKeyDown={this.handleKeyDown}>
            <h3>Logg inn for å kommentere, opprette og redigere sider!</h3> <br />
            <h3>Brukernavn</h3>
            <Form.Input
              type="text"
              name="username"
              value={this.inputUsername}
              onChange={(event) => this.inputUsername = event.currentTarget.value}
            />
            <h3>Passord</h3>
            <Form.Input
              type="password"
              name="password"
              value={this.inputPassword}
              onChange={(event) => this.inputPassword = event.currentTarget.value}
            />

            <div className="center-login-button">
              <Button.Light onClick={() => { history.push('/signup') }}>Lag ny bruker</Button.Light>

              <Button.Success onClick={this.handleLogin}>Logg inn</Button.Success>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default Login;
