import * as React from 'react';
import { Component } from 'react-simplified';

//Component imports
import { Card } from '../widgets'; // Adjust the path as necessary
import { history } from '../index';

// Sitemap for non logged in users / non authenticated users where they can see all the pages and navigate to them 
// The sitemap is used to create a better user experience for the user to navigate through the pages of the wiki if they have a disability or are not able to use the interface
class Sitemap extends Component {

  render() {
    return (
      <div className='mainContent'>
        <Card title="">
        <h1 className="hero-title">Sitemap</h1>
        <p className="Hero-text"> Her er en oversikt over undersider </p>
                <li><u onClick={() => {history.push("/")}}>Hjem</u></li>
                <li><u onClick={() => {history.push("/allpages")}}>Alle Sider</u></li>
                <li><u onClick={() => {history.push("/login")}}>Logg inn</u></li>              
        </Card>
      </div>
    );
  }
}

export default Sitemap;