import * as React from "react";
import moment from "moment";
import Markdown from "markdown-to-jsx";
import { Component } from "react-simplified";

//Services
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Component imports
import { history } from "../index";
import { Card, Button, Row, Column, Form, Alert } from "../widgets"; // Adjust the path as necessary

class Version extends Component<{
  match: { params: { pageid: number; versionnum: number } };
}> {
  // Initialize state variables and props for the Version component

  //Needed, check (1,1)
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  permission: Permission = {
    id: 0,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  };
  users: User[] = [];

  //Stores information
  page: Page = { id: this.props.match.params.pageid, name: "", num_views: 0 };
  version: Versionlog = {
    id: 0,
    content: "",
    userid: 0,
    date: "",
    changelog: "",
    version: this.props.match.params.versionnum,
    pageid: 0,
  };
  otherVersion: Versionlog = {
    id: 0,
    content: "",
    userid: 0,
    date: "",
    changelog: "",
    version: 0,
    pageid: 0,
  };
  versions: Versionlog[] = [];

  //Input
  selectValue: number = 0;
  compare: boolean = false;

  render() {
    return (
      <div className="mainContent">
        <div className="compare-section">
          <Card title="">
            <Row>
              {/* Column for version selection */}
              <Column width={3}>
                Sammenlign med &nbsp;
                <Form.Select
                  value={this.selectValue}
                  onChange={async (event) => {
                    //Updates other version information on change
                    this.selectValue = Number(event.currentTarget.value);
                    this.otherVersion = await versionlogService.getVersion(
                      this.page.id,
                      this.selectValue
                    );
                  }}
                >
                  {this.versions.map((version) => (
                    <option
                      key={version.id}
                      value={version.version}
                    >{`versjon ${version.version}`}</option>
                  ))}
                </Form.Select>
              </Column>
              {/* Column for compare checkbox */}
              <Column width={2}>
                <div> Sammenlign </div>
                <Form.Checkbox
                  checked={this.compare}
                  onChange={(event) =>
                    (this.compare = event.currentTarget.checked)
                  }
                ></Form.Checkbox>
              </Column>
              {/* Column for delete button */}
              <Column width={3}>
                <Button.Danger
                  onClick={() => {
                    //Checks permissions
                    if (this.permission.versions) {
                      if (this.versions.length < 2) {
                        pageService.deletePage(this.page.id);
                        history.push("/");
                      } else {
                        versionlogService.deleteVersion(
                          this.page.id,
                          this.version.version
                        );
                        history.push(`/pages/${this.page.id}/versionlog`);
                      }
                    } else {
                      Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                      console.log("access denied");
                    }
                  }}
                >
                  Slett versjon {this.version.version}
                </Button.Danger>
              </Column>
              {/* Column for restore button */}
              <Column width={3}>
                <Button.Success
                  onClick={async () => {
                    if (this.permission.versions) {
                      //Updates this.version data.
                      this.version.date = moment().format(
                        "YYYY-MM-DD HH:mm:ss"
                      );
                      this.version.changelog = `Gjenopprettet versjon ${this.version.version} som nyeste versjon.`;
                      this.version.version =
                        this.versions[this.versions.length - 1].version + 1;
                      this.version.userid = this.user.id;

                      //Restoring in practice just creates a new version with the old version content.
                      versionlogService.createVersion(this.version);
                      history.push(`/pages/${this.page.id}/versionlog`);
                    } else {
                      Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                      console.log("access denied");
                    }
                  }}
                >
                  Gjenopprett {this.version.version} som nyeste
                </Button.Success>
              </Column>
            </Row>
          </Card>
        {/* Section for displaying both versions */}
        <div className="bothVersions">
          <div className="currentVersion">
            <Card title={`"${this.page.name}" versjon ${this.version.version}`}></Card>
            <Card title=''>
              <Row>
                <Column width={12}>
                  <Markdown>{this.version.content}</Markdown>
                </Column>
              </Row>
            </Card>
          </div>
          {/* Section for displaying the compared version */}
          <div className="compareVersion">
            {this.compare && (
              <div>
                <Card
                  title={`"${this.page.name}" versjon ${this.otherVersion.version}`}
                  ></Card>
                <Card title="">
                  <Row>
                    <Column>
                      <Markdown>{this.otherVersion.content}</Markdown>
                    </Column>
                  </Row>
                </Card>
              </div>
            )}
        </div>
        </div>
      </div>
  </div>
    );
  }

  async mounted() {
    try {
      //Check (1,1), Gets the logged in user + permissions.
      this.authUser = await userService.getAuthenticatedUser();
      this.permission = await permissionService.getPermission(
        this.authUser.permid
      );
      this.users = await userService.getAllUsers();
      this.user = this.users.find((u) => u.id == this.authUser.id)!;

      //Gets information.
      this.version = await versionlogService.getVersion(
        this.page.id,
        this.version.version
      );
      this.page = await pageService.getPage(this.page.id);
      this.versions = await versionlogService.getAllPageVersions(this.page.id);

      //Sets start value, so that one version is already selected, without this immediately clicking compare would not work, since a version has technically not been selected yet.
      this.otherVersion = this.versions[0];
      this.selectValue = this.versions[0].version;
    } catch (error) {
      Alert.danger("Du har ikke tillatelse til å gjøre dette.");
      console.log(error);
    }
  }
}

export default Version;
