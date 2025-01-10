import * as React from "react";
import { Component } from "react-simplified";

//Services
import pageService, { Page } from "../service/page-service";

//Component imports
import { Card, Row, Button } from "../widgets"; // Adjust as necessary
import { history } from "../index";

// Render the main page of the Orakeltjenesen website with the most visited pages and contact information
// Page also contains a sitemap easily accessible for the user to navigate through the pages in case of disability or issues with the interface
// Main Content Component
class Main extends Component {
  pages: Page[] = [];

  render() {
    return (
      <div className="mainContent">
        <Card title="">
          <h2>Velkommen til Orakeltjenesten</h2>
          <br />
          <p>Her kan du stille spørsmål og få svar på det du lurer på.</p>
          <p>
            Orakeltjenesten ved NTNU kan hjelpe studenter og ansatte med
            IT-problemstillinger. <br></br>
            Vi kan nås gjennom NTNU Hjelp, ved å ringe oss på telefon, eller ved
            å besøke en av våre fysiske skranker på campus. <br></br>
            Aldri oppgi passord til oss når du tar kontakt med Orakeltjenesten.
          </p>
          <br />
          <h4>Våre mest besøkte sider</h4> <br />
          {this.pages.map((page) => (
            <Row key={page.id}>
              <a className="blue-link" href={`/#/pages/${page.id}`}>
                {page.name}
              </a>
            </Row>
          ))}
          <br />
          <h4>Kontakt oss</h4> <br />
          <Button.Light
            onClick={() => {
              window.location.href =
                "https://hjelp.ntnu.no/tas/public/login/saml";
            }}
          >
            Kontakt oss via NTNU Hjelp
          </Button.Light>
          <br></br>
          <br></br>
          <b>
            Orakeltjenesten kan også nås for øyeblikelig hjelp ved å ringe tlf:
            73 59 15 00
          </b>
          <br></br>
          <br></br>
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      // Fetch ordered pages from the page service, ordered pages returns the 3 most visited pages in order
      const pagesResult = await pageService.getOrderedPages();
      // If pages are successfully fetched, assign them to this.pages
      if (pagesResult) {
        this.pages = pagesResult;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Main;
