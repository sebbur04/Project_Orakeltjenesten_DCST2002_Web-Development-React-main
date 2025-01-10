import * as React from "react";
import { Component } from "react-simplified";

//Services
import userService, { User } from "../service/user-service";

//Component imports
import { Card } from "../widgets"; // Adjust the path as necessary

// Profile page for the user to see their avatar and username with buttons to edit and delete user
class ProfileView extends Component<{ match: { params: { id: number } } }> {
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };

  //Render -- Display user's avatar and username allongside with bio
  //This profile-view.tsx is for a 3 party to view a profile without possibility to edit or delete the user
  render() {
    return (
      <div className="mainContent">
        <Card title="">
          <div>
            <img
              className="imgstyle"
              src={this.user.avatar}
              alt="No avatar chosen"
            />{" "}
            {/* Display user's avatar */}
            <h1 className="hero-title">{this.user.username}</h1>{" "}
            {/* Show Username for the profile page by retrieving user id from auth*/}
            <h3>Bio:</h3>
            <p>{this.user.bio}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Mount for the profile page
  //Mount -- Get avatar photo linked to user id

  async mounted() {
    this.user = await userService.getUser(this.props.match.params.id);
  }
}

export default ProfileView;
