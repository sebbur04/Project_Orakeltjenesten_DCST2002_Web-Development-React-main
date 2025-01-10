import * as React from "react";
import { Component } from "react-simplified";

//Component imports
import { history } from '../index'
import { Button } from "../widgets";
import DarkModeButton from "../darkmode";
import SearchBar from "../same/searchbar";

// Render the top bar of Oraketjenesten with search bar, dark mode button and login button for non autheticated users
class TopBar extends Component {
  render() {
    return (
        <div className="top-container">
          <div className="title">
            
          <a className="orakel-title" href="/#/">Orakeltjenesten</a>

          </div>
          
          <SearchBar />

          <div className="top-right-container">
            
            <DarkModeButton />
          
            <Button.Light onClick={()=> {history.push('/login')}}>Logg inn</Button.Light>

            
          </div>
        </div>
    );
  }
}

export default TopBar;