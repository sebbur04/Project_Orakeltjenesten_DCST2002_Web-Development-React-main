import * as React from "react";
import Markdown from "markdown-to-jsx";
import moment from "moment";
import { Component } from "react-simplified";

//Services
import pageService, { Page } from "../service/page-service";
import versionlogService, { Versionlog } from "../service/versionlog-service";
import userService, { User } from "../service/user-service";

//Component imports
import { Card, Row, Column } from "../widgets"; // Adjust the path as necessary

// Render a list of all page entries on the wiki
class allPages extends Component {
  //Initial state variable values
  pages: Page[] = [];
  versions: Versionlog[] = [];
  users: User[] = [];

  render() {
    return (
      <div className="mainContent">
        <Card title="Alle sider">
          {this.pages.map((page) => {
            //We have a getLatestVersion service, but to make that work we would have to make many calls to the database, instead we get all pages, then filter out the latest version on the frontend.
            const pageVersions: Versionlog[] = this.versions.filter(
              (ver) => ver.pageid == page.id
            );
            let latestVersions = pageVersions[0];
            let userOutput: React.ReactElement = <Row></Row>;

            //Finds latest version of page
            for (const version of pageVersions) {
              if (version.version > latestVersions.version) {
                latestVersions = version;
              }
            }

            let user = this.users.find((u) => u.id == latestVersions.userid);

            //In case user has been deleted, we still want to keep the version
            if (!user) {
              userOutput = <span>Slettet Bruker</span>;
            } else {
              userOutput = (
                <div>
                  <span>Av: &nbsp;</span>
                  <a className="blue-link" href={`/#/users/${user.id}`}>
                    {" "}
                    {user.username}
                  </a>
                </div>
              );
            }

            //Gets date, check (2,2)
            const date = moment
              .utc(latestVersions.date)
              .format("YYYY-MM-DD HH:mm");

            return (
              <Row key={page.id}>
                <Markdown>---</Markdown>
                <Column width={6}>
                  <a className="blue-link" href={"/#/pages/" + page.id}>
                    {page.name}
                  </a>
                </Column>
                <Column width={3}>{`Sist endret: ${date}`}</Column>
                <Column width={3}>{userOutput}</Column>
              </Row>
            );
          })}
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      const pagesResult = await pageService.getAllPages();
      const versionsResult = await versionlogService.getAllVersions();

      this.users = await userService.getAllUsers();

      if (pagesResult) {
        this.pages = pagesResult;
      }

      if (versionsResult) {
        this.versions = versionsResult;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default allPages;
