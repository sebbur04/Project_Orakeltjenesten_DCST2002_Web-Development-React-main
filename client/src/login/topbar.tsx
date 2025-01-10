import * as React from "react";
import { Component } from "react-simplified";
import { Button } from "../widgets"; // Adjust as necessary
import { history } from "../index";
import DarkModeButton from "../darkmode";
import userService from "../service/user-service";
import SearchBar from "../same/searchbar"; // import SearchBar from logout folder, because it has the same function for both logged in and logged out users

// Render a top bar with a search bar, dark mode button, profile button and a logout button for authenticated users
// Different from non autheticted users by having possibility to log out and go to profile page
class TopBar extends Component {
  render() {
    return (
      <div className="top-container">
        <div className="title">
          <a className="orakel-title" href="/#/">
            Orakeltjenesten
          </a>
        </div>
        <SearchBar />
        <div className="top-right-container">
          <DarkModeButton />

          <div>
            <Button.Light onClick={() => {history.push('/profile')}}>Profil</Button.Light>
          </div>

          <Button.Danger
            onClick={async () => {
              await userService.logout();
              history.push("/");
              //Need to reload to update change to logged out hashrouter.
              window.location.reload();
            }}
          >
            Logg ut
          </Button.Danger>
        </div>
      </div>
    );
  }
}

export default TopBar;
