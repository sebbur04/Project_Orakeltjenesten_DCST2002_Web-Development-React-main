import * as React from "react";
import { Card, Button, Form, Row, Column, Alert } from "../widgets"; // Adjust the path as necessary
import { Component } from "react-simplified";
import { createHashHistory } from "history";
import userService, { User } from "../service/user-service";

export const history = createHashHistory();

// Component to edit user information properties

class ProfileEdit extends Component {
  //Needed, check (1,1)
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  users: User[] = [];
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };

  //Inputs
  inputUsername: string = "";
  inputPassword1: string = "";
  inputPassword2: string = "";
  selectedAvatar: string = "";

  // Render a card of the user interface for profile-edit page
  render() {
    return (
      <div className="mainContent">
        <Card title="Brukeradministrasjon">
          <div>
            <h4 className="hero-title-small">Personalisering</h4>
            <h6>Bio </h6>
            <Form.Textarea
              value={this.user.bio}
              onChange={(event) => (this.user.bio = event.currentTarget.value)}
            ></Form.Textarea>
            <br />
            <br />

            <Row>
              <p>Velg profilbilde / avatar:</p>
              {["1", "2", "3", "4", "5"].map((num) => (
                <Column width={1} key={num}>
                  <div>
                    <Form.Checkbox
                      id={`avatar${num}`}
                      name="avatar"
                      checked={
                        this.selectedAvatar ===
                        `/user-avatars/img_avatar_${num}.png`
                      }
                      onChange={() =>
                        (this.selectedAvatar = `/user-avatars/img_avatar_${num}.png`)
                      }
                    />
                    <img
                      src={`/user-avatars/img_avatar_${num}.png`}
                      alt={`Avatar ${num}`}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <br />
                  </div>
                </Column>
              ))}
            </Row>
            <br />
            <br />
            <h3 className="hero-title-small">Brukernavn og passord</h3>
            <form>
              <h6>Brukernavn</h6>
              <Form.Input
                width="40vw"
                type="text"
                name="username"
                value={this.inputUsername}
                onChange={(event) =>
                  (this.inputUsername = event.currentTarget.value)
                }
                placeholder="Nytt brukernavn"
                aria-label="Username"
              />
              <br />
              <br />
              <h6>Passord</h6>
              <Form.Input
                width="40vw"
                type="password"
                name="password1"
                value={this.inputPassword1}
                onChange={(event) =>
                  (this.inputPassword1 = event.currentTarget.value)
                }
                placeholder="Nytt passord"
                aria-label="Password"
              />
              <br />
              <Form.Input
                width="40vw"
                type="password"
                name="password2"
                value={this.inputPassword2}
                onChange={(event) =>
                  (this.inputPassword2 = event.currentTarget.value)
                }
                placeholder="Gjenta passord"
                aria-label="PasswordVerify"
              />
              <br />
              <br />
            </form>
            <Row>
              <Column width={2}>
                <Button.Success
                  onClick={() => {
                    this.updateUser();
                  }}
                >
                  Lagre endringer
                </Button.Success>
              </Column>
              <Column width={1}>
                <Button.Danger
                  onClick={() => {
                    history.push("/profile");
                  }}
                >
                  Avbryt
                </Button.Danger>
              </Column>
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  // Mount for the profile-edit page
  //--------------------------------------------------------------------------------//
  // Mounted method to get the authenticated user and set the user variable with new username and password, and preview bio in the field

  async mounted() {
    this.users = await userService.getAllUsers();

    this.authUser = await userService.getAuthenticatedUser();
    // Using Func Alg to find user that matches the authUser id to show the user's avatar and username after an update
    const userResult = this.users.find((x) => x.id == this.authUser.id);

    if (userResult) {
      this.user = userResult;

      //Set initial value, so that the users avatar is already checked.
      this.selectedAvatar = this.user.avatar;
    }
  }
  // Async method to check if the password is correct and update the user information
  // Async also checks and can update password and/or avatar regardless if password is changed or not
  async updateUser() {
    if (this.inputPassword1 !== this.inputPassword2) {
      Alert.danger("Feil: Passordene er ikke like.");
      console.log("Error: Passwords do not match");
      return;
    }

    // Check if username and passwords have no whitespaces, and if they have too many characters
    if (
      this.inputUsername.replace(/\s+/g, "") == this.inputUsername &&
      this.inputPassword1.replace(/\s+/g, "") == this.inputPassword1 &&
      this.inputPassword2.replace(/\s+/g, "") == this.inputPassword2 &&
      this.inputUsername.length < 20 &&
      this.inputPassword1.length < 20 &&
      this.inputPassword2.length < 20
    ) {
      try {
        // Update username if provided
        if (this.inputUsername != "") {
          await userService.updateUsername(this.user.id, this.inputUsername);
        }
        // Update password if provided
        if (this.inputPassword1 != "") {
          await userService.updatePassword(this.user.id, this.inputPassword1);
        }
        // Update avatar if selected
        if (this.selectedAvatar) {
          await userService.updateUserAvatar(this.user.id, this.selectedAvatar);
        }
        await userService.updateUserBio(this.user.id, this.user.bio);

        // Redirect to profile page after successful update or console log in case any error occurs
        history.push("/profile");
      } catch (error) {
        console.log(error);
        Alert.danger("Feil: Brukeren ble ikke oppdatert, prøv igjen: " + error);
      }
    } else if (
      this.inputUsername.length >= 20 ||
      this.inputPassword1.length >= 20 ||
      this.inputPassword2.length >= 20
    ) {
      Alert.danger("Feil: Brukernavn eller passord er for langt.");
    } else {
      Alert.danger("No whitespaces in username and password fields.");

      this.inputUsername = this.inputUsername.replace(/\s+/g, "");
      this.inputPassword1 = "";
      this.inputPassword2 = "";
    }
    
  }
}

export default ProfileEdit;
