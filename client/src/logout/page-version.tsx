import * as React from "react";
import Markdown from "markdown-to-jsx";
import { Component } from "react-simplified";

//Services
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";

//Component imports
import { Card, Row, Column, Form } from "../widgets";

class Version extends Component<{
  match: { params: { pageid: number; versionnum: number } };
}> {
  //Initializes state variables
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

  //Renders content and data from specific version.
  render() {
    return (
      <div className="mainContent">
        <div className="compare-section">
          <Card title="">
            <Row>
              <Column width={3}>
                Sammenlign med &nbsp;
                {/*Dropdown of versions to compare to */}
                <Form.Select
                  value={this.selectValue}
                  onChange={async (event) => {
                    this.selectValue = Number(event.currentTarget.value);

                    //Updates otherVersion data onChange
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

              <Column width={2}>
                <div> Sammenlign </div>
                <Form.Checkbox
                  checked={this.compare}
                  onChange={(event) =>
                    (this.compare = event.currentTarget.checked)
                  }
                ></Form.Checkbox>
              </Column>
            </Row>
          </Card>
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
        <div className="compareVersion">
          {/*Check (2,1), Only shows other version if checbox is checked.*/}
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
      this.version = await versionlogService.getVersion(
        this.page.id,
        this.version.version
      );
      this.page = await pageService.getPage(this.page.id);
      this.versions = await versionlogService.getAllPageVersions(this.page.id);

      //Set initial value to prevent errors with dropdown
      this.otherVersion = this.versions[1];
      this.selectValue = this.versions[1].version;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Version;
