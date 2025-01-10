// ------------------------------------------- -------------------------------------------
// Component for displaying pages associated with a tag in the Orakel application.
// ------------------------------------------- -------------------------------------------

import * as React from "react";
import { Component } from "react-simplified";

//Services
import pageService, { Page } from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";

//Component imports
import { Card, Column, Row } from "../widgets"; // Adjust the path as necessary

class TagComp extends Component<{ match: { params: { id: number } } }> {
  //Set initial state variables
  pages: Page[] = [];
  tag: Tag = { id: 0, name: "" };

  //Renders all pages which has tag
  render() {
    return (
      <div className="mainContent">
        <div className="tag-box-style">
          <Card title={this.tag.name}>
            <Row>
              {this.pages.map((page) => (
                <Row key={page.id}>
                  <a
                    className="blue-link"
                    href={`/#/pages/${page.id}`}
                    onClick={() => {
                      //Increment pageview when clicked on
                      pageService.updatePageViews(page.id);
                    }}
                  >
                    {page.name}
                  </a>
                </Row>
              ))}
            </Row>
            <Row>
              <Column>{`Antall sider: ${this.pages.length}`}</Column>
            </Row>
          </Card>
        </div>
      </div>
    );
  }

  async mounted() {
    try {
      // Fetch pages associated with the tag
      this.pages = await pageService.getPageFromTag(this.props.match.params.id);

      // Fetch the tag details to get the name for the Card title
      this.tag = await tagService.getTag(this.props.match.params.id);
    } catch (error) {
      console.error("Failed to load pages or tag data:", error);
    }
  }
}

export default TagComp;
