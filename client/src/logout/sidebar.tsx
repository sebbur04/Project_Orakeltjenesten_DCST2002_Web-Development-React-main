//LOGGED OUT

import * as React from "react";
import { Component } from "react-simplified";
import Markdown from "markdown-to-jsx";

//Services
import pageService from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";

//Component imports
import { Card, Row } from "../widgets"; // Adjust as necessary

// Sidebar Navigation, different from logged in sidebar by removing new page and new tag buttons.
class Sidebar extends Component {
  tags: Tag[] = [];

  render() {
    return (
      <div className="sidebar">
        <Card title="">
          <Row>
            <a className="blue-link" href="/#/">
              Hjem
            </a>
            <Markdown>---</Markdown>
          </Row>
          <Row>
            <a
              className="blue-link"
              href="/#/allpages"
              onClick={async () => {
                //Check for null pages and delete them due to a very specific problem that can occur. explained more in login/sidebar.tsx
                await pageService.checkForEmptyPages();
              }}
            >
              Alle sider
            </a>
          </Row>

          {this.tags.map((tag) => (
            <Row key={tag.id}>
                 <Markdown>---</Markdown>
              <a className="blue-link" href={"/#/tags/" + tag.id}>
                {tag.name}
              </a>
            </Row>
          ))}
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      this.tags = await tagService.getAllTags();
    } catch (error) {
      console.error(error);
    }
  }
}

export default Sidebar;
