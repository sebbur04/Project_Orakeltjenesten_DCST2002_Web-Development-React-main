import * as React from "react";
import { Card, Form, Button, Alert } from "../widgets"; // Adjust as necessary
import { Component } from "react-simplified";
import userService, { User } from "../service/user-service";
import { createHashHistory } from "history";

export const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class SignUp extends Component {
  inputUsername: string = "";
  inputPassword: string = "";

  //Code for when you press log in
  handleSignUp = async () => {
    //Checks for no only whitespaces in username and password
    const noWhiteUsername = this.inputUsername.replace(/\s+/g, "");
    const noWhitePassword = this.inputPassword.replace(/\s+/g, "");
    const noLongUsername = this.inputUsername.length < 20;
    const noLongPassword = this.inputPassword.length < 20;

    if (
      noWhiteUsername == this.inputUsername &&
      noWhitePassword == this.inputPassword &&
      noLongUsername == true &&
      noLongPassword == true
    ) {
      try {
        await userService.signUp(this.inputUsername, this.inputPassword);

        history.push("/login");
      } catch (error) {
        Alert.danger("Brukernavn er allerede i bruk.");

        this.inputPassword = "";
        this.inputUsername = "";
      }
    } else if (noLongUsername == false || noLongPassword == false) {
      Alert.danger("Brukernavn eller passord er for langt.");

      this.inputPassword = "";
      this.inputUsername = "";
    } else {
      Alert.danger("Mellomrom er ikke tillatt i brukernavn eller passord.");

      this.inputPassword = "";
      this.inputUsername = "";
    }
  };

  // Source: Use of Ai (ChatGPT) on the Key press event to find the React.Keyboard Event
  // Prompt: Implement the handleKeyDown function to handle the enter key press event on existing login page (Our original code)
  // Then connect the event to a new handleLogin function instead of having it implemented only in the button
  // Handle enter key press by using React.KeyboardEvent
  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      this.handleSignUp();
    }
  };

  render() {
    return (
      <div className="mainContent">
        <Card title="">
          <div className="whole-login-box " onKeyDown={this.handleKeyDown}>
            <h2>Lag ny bruker</h2>
            <div>Brukernavn</div>
            <Form.Input
              type="text"
              name="username"
              value={this.inputUsername}
              onChange={(event) =>
                (this.inputUsername = event.currentTarget.value)
              }
            />
            <div>Passord</div>
            <Form.Input
              type="password"
              name="password"
              value={this.inputPassword}
              onChange={(event) =>
                (this.inputPassword = event.currentTarget.value)
              }
            />

            <div className="center-login-button">
              <Button.Light
                onClick={() => {
                  history.push("/login");
                }}
              >
                Avbryt
              </Button.Light>
              <Button.Success
                onClick={async () => {
                  this.handleSignUp();
                }}
              >
                Opprett
              </Button.Success>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default SignUp;
