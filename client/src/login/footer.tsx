import * as React from "react";
import { Component } from "react-simplified";
import { history } from "../index";
import { Button, Card } from '../widgets';


class Footer extends Component {
    render() {
        return (
            <Card title=''>
                
                <a href="/#/sitemap" className="blue-link">Sitemap</a>

              </Card>    
        );
      }
    }
    
    export default Footer;
    
