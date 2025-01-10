import * as React from "react";
import { Component } from "react-simplified";
import { createHashHistory } from "history";

//Service imports
import userService, { User } from "../service/user-service";

//Component imports
import { Card, Button, Alert } from "../widgets";

export const history = createHashHistory();

// Profile page for the user to see their avatar and username with buttons to edit and delete user
class Profile extends Component {
  //Needed, check (1,1)
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  users: User[] = [];

  //Render -- Display user's avatar and username with buttons to edit user and delete user
  render() {
    return (
      <div className="mainContent">
        <Card title="">
          <div className="own-profile-view">
            <img
              className="imgstyle"
              src={this.user.avatar}
              alt="Ingen Avatar"
            />{" "}
            {/* Display user's avatar */}
            <h1 className="hero-title">Velkommen {this.user.username}</h1>{" "}
            {/* Show Username for the profile page by retrieving user id from auth*/}
            <h3 className="hero-title-small">Bio</h3>{" "}
            {/* Show Bio for the profile page */}
            <p>{this.user.bio}</p>
            <h3 className="hero-title-small">Administrer profilen min</h3>
            <Button.Light
              onClick={() => {
                history.push("/useredit");
              }}
            >
              Tilpass profil og bio
            </Button.Light>
            &nbsp;
            <Button.Danger
              onClick={() => {
                this.handleDeleteUser();
              }}
            >
              Slett bruker
            </Button.Danger>
          </div>
        </Card>
      </div>
    );
  }

  // Mount for the profile page
  //--------------------------------------------------------------------------------//
  //Mount -- Get avatar photo linked to user id

  async mounted() {
    this.users = await userService.getAllUsers();

    this.authUser = await userService.getAuthenticatedUser();
    // Using Func Alg to find user that matches the authUser id to show the user's avatar and username after an update
    const userResult = this.users.find((x) => x.id == this.authUser.id);

    if (userResult) {
      this.user = userResult;
    }
  }

  async handleDeleteUser() {
    try {
      await userService.deleteUserComments(this.user.id);
      await userService.deleteUser(this.user.id);
      await userService.logout();
      history.push("/"); // Redirect to home page after deleting the user
      window.location.reload(); //Reload to update the navbar from auth to non auth
    } catch (error) {
      console.error("Failed to delete user:", error); // Print error message to console in case the user was not deleted
      Alert.danger("Kunne ikke slette bruker!"); // Alert message if user has not been deleted successfully
    }
  }
}

export default Profile;
