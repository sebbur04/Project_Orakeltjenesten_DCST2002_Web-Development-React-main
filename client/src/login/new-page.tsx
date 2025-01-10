import * as React from "react";
import { Component } from "react-simplified";
import Markdown from "markdown-to-jsx";

//Services
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";
import pageTagService from "../service/page-tags-service";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Components
import { Card, Button, Form, Row, Column, Alert } from "../widgets";
import SearchBar from "../same/searchbar";
import { history } from "../index";

//This component is the same as edit-page, check comments there. Needed own component because new-page does not have any information yet, except for id, using the same comp as edit-page therefore caused a lot of problems.
class NewPage extends Component<{ match: { params: { id: number } } }> {
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  permission: Permission = {
    id: 0,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  };
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  users: User[] = [];

  version: Versionlog = {
    id: 0,
    pageid: this.props.match.params.id,
    content: "",
    userid: 0,
    date: "",
    changelog: "",
    version: 0,
  };
  page: Page = { id: this.props.match.params.id, name: "", num_views: 0 };
  pages: Page[] = [];
  tags: Tag[] = [];
  originalTags: Tag[] = [];
  allTags: Tag[] = [];
  addedTags: number[] = [];
  removedTags: number[] = [];

  inputChangeLog: string = "";
  tagSelectInput: number = 0;
  pageId: number = 0;
  addLink: boolean = false;

  render() {
    if (!this.permission.alterpages) {
      return (
        <div className="mainContent">
          <h3>Missing permissions</h3>
        </div>
      );
    }
    return (
      <div className="mainContent">
        <Card title="Ny side">
          <Row>
            <Column width={1}>Tittel </Column>
            <Column width={2}>
              <Form.Input
                width="50vw"
                maxlength={25}
                type="text"
                value={this.page.name}
                onChange={(event) =>
                  (this.page.name = event.currentTarget.value)
                }
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column>
              <b>Tagger</b>
            </Column>
          </Row>
          {this.tags.map((tag) => (
            <Row key={tag.id}>
              <Column width={3}>{tag.name}</Column>
              <Column width={2}>
                <Button.Danger
                  onClick={() => {
                    if (this.addedTags.includes(tag.id)) {
                      this.addedTags = this.addedTags.filter(
                        (x) => x != tag.id
                      );
                    } else {
                      this.removedTags.push(tag.id);
                    }

                    this.tags = this.tags.filter((x) => x.id != tag.id);
                    this.allTags.push(tag);
                  }}
                >
                  Fjern tagg
                </Button.Danger>
              </Column>
            </Row>
          ))}
          <Row>
            <Column width={3}>
              <Form.Select
                value={this.tagSelectInput}
                onChange={(event) => {
                  this.tagSelectInput = Number(event.currentTarget.value);
                }}
              >
                {this.allTags.map((tag) => (
                  <option value={tag.id} key={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Form.Select>
            </Column>
            <Column width={2}>
              <Button.Success
                onClick={() => {
                  if (this.removedTags.includes(this.tagSelectInput)) {
                    this.addedTags.push(this.tagSelectInput);
                    this.removedTags = this.removedTags.filter(
                      (x) => x != this.tagSelectInput
                    );
                  } else {
                    this.addedTags.push(this.tagSelectInput);
                  }

                  const addedTag = this.allTags.find(
                    (y) => y.id == this.tagSelectInput
                  );

                  if (addedTag != undefined) {
                    this.tags.push(addedTag);
                  }

                  this.addedTags = this.addedTags.filter(
                    (x) => !this.originalTags.some((y) => x == y.id)
                  );

                  this.allTags = this.allTags.filter(
                    (x) => x.id != this.tagSelectInput
                  );

                  this.tagSelectInput = this.allTags[0].id;
                }}
              >
                Legg til tagg
              </Button.Success>
            </Column>
          </Row>
          <Row>
            <Column width={2}>Endringslogg:</Column>
            <Column width={6}>
              <Form.Input
                width="50vw"
                placeholder="Skriv hva du har endret her"
                type="text"
                value={this.inputChangeLog}
                onChange={(event) =>
                  (this.inputChangeLog = event.currentTarget.value)
                }
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Row>
              <Column width={2}>Generer lenke: </Column>
              <Column>
                <Form.Checkbox
                  checked={this.addLink}
                  onChange={(event) => {
                    this.addLink = event.currentTarget.checked;
                  }}
                ></Form.Checkbox>
              </Column>
            </Row>
            {this.addLink && (
              <Row>
                <Column width={4}>
                  <Form.Select
                    value={this.pageId}
                    onChange={(event) => {
                      this.pageId = Number(event.currentTarget.value);
                    }}
                  >
                    {this.pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Column>
                <Row>
                <Column width={2}>{`Lenke: `}</Column>
                <Column
                  width={8}
                >{`[LinkNavn](http://localhost:3000/#/pages/${this.pageId})`}</Column>
              </Row>
              </Row>
            )}
            <Row>
              <div className="wide-textarea">
                <textarea
                  className="textarea"
                  rows={10}
                  value={this.version.content}
                  onChange={(event) =>
                    (this.version.content = event.currentTarget.value)
                  }
                ></textarea>
              </div>
            </Row>
          </Row>
          <Row>
            <Column width={7}></Column>

            <Column width={2}>
              <Button.Light
                onClick={async () => {
                  await pageService.deleteEmptyPage(this.page.id);

                  history.push(`/`);
                }}
              >
                Avbryt
              </Button.Light>
            </Column>

            <Column width={2}>
              <Button.Success
                onClick={async () => {
                  this.version.date = require("moment")().format(
                    "YYYY-MM-DD HH:mm:ss"
                  );

                  this.version.version++;
                  this.version.changelog = this.inputChangeLog;
                  this.version.userid = this.user.id;

                  if (
                    this.page.name.length != 0 &&
                    this.version.content.length != 0 &&
                    this.tags.length != 0 &&
                    this.user.id != 0 &&
                    this.page.name.replace(/\s+/g, "").length != 0
                  ) {
                    await pageService.updatePageName(this.page);

                    await versionlogService.createVersion(this.version);

                    if (this.addedTags.length != 0) {
                      this.addedTags.map(
                        async (tagId) =>
                          await pageTagService.addTagToPage(this.page.id, tagId)
                      );
                    }

                    if (this.removedTags.length != 0) {
                      this.removedTags.map(
                        async (tagId) =>
                          await pageTagService.deleteTagFromPage(
                            this.page.id,
                            tagId
                          )
                      );
                    }

                    SearchBar.instance()?.mounted();

                    history.push(`/pages/${this.page.id}`);
                  } else {
                    console.error("Missing input or tag");
                    Alert.danger("Mangler tittel, innhold og/eller tagg");
                  }
                }}
              >
                Lagre
              </Button.Success>
            </Column>
          </Row>
        </Card>
        <Card title="Forhåndsvisning">
          <Row>
            <Markdown>---</Markdown>
          </Row>
          <Row>
            <Markdown>{this.version.content}</Markdown>
          </Row>
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      this.authUser = await userService.getAuthenticatedUser();
      this.permission = await permissionService.getPermission(
        this.authUser.permid
      );
      this.users = await userService.getAllUsers();
      this.user = this.users.find((u) => u.id == this.authUser.id)!;

      this.allTags = await tagService.getAllTags();

      const pagesResult = await pageService.getAllPages();

      if (!pagesResult) {
        console.error("No pages found");
      } else {
        this.pages = pagesResult.filter((p) => p.id != this.page.id);
        this.pageId = this.pages[0].id;
      }

      this.tagSelectInput = this.allTags[0].id;
    } catch (error) {
      console.error(error);
    }
  }
}

export default NewPage;
