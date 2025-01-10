import * as React from "react";
import { Component } from "react-simplified";
import moment from "moment";
import Markdown from "markdown-to-jsx";

//Services
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";
import userService, { User } from "../service/user-service";

//Component imports
import { Card, Row, Column } from "../widgets"; // Adjust the path as necessary

//This component gives a list of all versions belonging to a page, including other information
class VersionLog extends Component<{ match: { params: { id: number } } }> {
  //Set initial state variables values
  versions: Versionlog[] = [];
  page: Page = { id: this.props.match.params.id, name: "", num_views: 0 };
  users: User[] = [];

  render() {
    return (
      <div className="mainContent">
        <Card title={`Versjonslogg for "${this.page.name}"`}>
          {/*Checks that there are versions */}
          {this.versions.length > 0 ? (
            this.versions.map((version) => {
              //Finds user who edited the version
              let user = this.users.find((x) => x.id == version.userid);

              let userOutput: React.ReactElement = <Row></Row>;

              //Checks if user has been deleted
              if (!user) {
                userOutput = <span>Slettet Bruker</span>;
              } else {
                userOutput = (
                  <a className="blue-link" href={`/#/users/${user.id}`}>
                    {user.username}
                  </a>
                );
              }
              return (
                <Row key={version.id}>
                  <Markdown>---</Markdown>

                  <Column width={2}>
                    <a
                      className="blue-link"
                      href={
                        "/#/pages/" +
                        version.pageid +
                        "/versionlog/" +
                        version.version
                      }
                    >{`Versjon ${version.version}`}</a>
                  </Column>
                  <Column width={2}>
                    {`Endret av: `}
                    {userOutput}
                  </Column>

                  {/* UTC date fetched from database, must convert. Check (2,2)  */}
                  <Column
                    width={3}
                  >{`Dato: ${moment.utc(version.date).local().format("YYYY-MM-DD HH:mm")}`}</Column>
                  <Column width={5}>{`Logg: ${version.changelog}`}</Column>
                </Row>
              );
            })
          ) : (
            <p>Ingen versjoner funnet for denne siden </p>
          )}
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      this.page = await pageService.getPage(this.page.id);
      this.versions = await versionlogService.getAllPageVersions(this.page.id);
      this.users = await userService.getAllUsers();
    } catch (error) {
      console.log(error);
    }
  }
}

export default VersionLog;
