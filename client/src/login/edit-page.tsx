import * as React from "react";
import Markdown from "markdown-to-jsx";
import { Component } from "react-simplified";

//Service Imports
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";
import pageTagService from "../service/page-tags-service";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Component imports
import { Card, Button, Form, Row, Column, Alert } from "../widgets";
import SearchBar from "../same/searchbar";
import { history } from "../index";

class Edit extends Component<{ match: { params: { id: number } } }> {
  //Initializers needed for component

  //Needed (1,1)
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

  //Used for showing information
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

  //Used for showing possible tags to add.
  allTags: Tag[] = [];
  //In case you remove and add back tag
  originalTags: Tag[] = [];
  //Stores tags to be removed
  removedTags: number[] = [];
  //Stores tags to be added
  addedTags: number[] = [];

  //Inputs
  tagSelectInput: number = 0;
  pageId: number = 0;
  inputChangeLog: string = "";
  addLink: boolean = false;

  render() {
    //Needed, check (1,2)
    if (!this.permission.alterpages) {
      return (
        <div className="mainContent">
          <h3>Missing Permissions</h3>
        </div>
      );
    }
    return (
      <div className="mainContent">
        <Card title="Rediger side">
          {/* Renders the edit-page. Including input for page.name, all tags belonging to page,
          dropdown of all available tags*/}
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
                    //Checks if the tag to be removed has been added earlier, or if it exists in db.
                    if (this.addedTags.includes(tag.id)) {
                      //removes the tag from the tags to be added. Does not need to remove it with service as its not in db
                      this.addedTags = this.addedTags.filter(
                        (x) => x != tag.id
                      );
                    } else {
                      this.removedTags.push(tag.id);
                    }

                    //Updates this.tags so that the deleted tag is no longer there
                    this.tags = this.tags.filter((x) => x.id != tag.id);
                    //Need to add tag back to list of tags to add.
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
                  //Checks if tag has been removed earlier, if not add it.
                  if (this.removedTags.includes(this.tagSelectInput)) {
                    this.addedTags.push(this.tagSelectInput);
                    this.removedTags = this.removedTags.filter(
                      (x) => x != this.tagSelectInput
                    );
                  } else {
                    this.addedTags.push(this.tagSelectInput);
                  }

                  //The option only stores id, so we need to get the full tag information
                  const addedTag = this.allTags.find(
                    (y) => y.id == this.tagSelectInput
                  );

                  //Must run because there is a chance that addedTag is undefined, ts complained
                  if (addedTag) {
                    this.tags.push(addedTag);
                  }

                  //Checks if the addedtags already exist in db.
                  this.addedTags = this.addedTags.filter(
                    (x) => !this.originalTags.some((y) => x == y.id)
                  );

                  //Updates this.alltags after having added tag
                  this.allTags = this.allTags.filter(
                    (x) => x.id != this.tagSelectInput
                  );
                  //Must update the value so that it doesn't crash after having chosen the first value (see mounted)
                  if (this.allTags && this.allTags.length > 0) {
                    this.tagSelectInput = this.allTags[0].id;
                  } else {
                    // Handle the case where there are no tags
                    this.tagSelectInput = 0;
                  }
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
            {/*Check (2.1). Code finds all pages, giving user a template for implementing the link to the page in markdown. */}
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
            <Column width={7}>
              <Button.Danger
                onClick={async () => {
                  if (this.permission.deletepages) {
                    await pageService.deletePage(this.page.id);

                    SearchBar.instance()?.mounted();

                    history.push(`/`);
                  } else {
                    Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                    console.log("access denied");
                  }
                }}
              >
                Slett denne siden
              </Button.Danger>
            </Column>

            <Column width={2}>
              <Button.Light
                onClick={() => {
                  history.push(`/pages/${this.page.id}`);
                }}
              >
                Avbryt
              </Button.Light>
            </Column>

            <Column width={2}>
              <Button.Success
                onClick={async () => {
                  //Check (2.2), Gets date
                  this.version.date = require("moment")().format(
                    "YYYY-MM-DD HH:mm:ss"
                  );

                  //prepares correct values in this.version
                  this.version.version++;
                  this.version.changelog = this.inputChangeLog;
                  this.version.userid = this.authUser.id;

                  //Input-validatin, also checks if name is only whitespace.
                  if (
                    this.page.name.length != 0 &&
                    this.version.content.length != 0 &&
                    this.tags.length != 0 &&
                    this.authUser.id != 0 &&
                    this.page.name.replace(/\s+/g, "").length != 0
                  ) {
                    await pageService.updatePageName(this.page);

                    await versionlogService.createVersion(this.version);

                    if (this.addedTags.length != 0) {
                      this.addedTags.map((tagId) =>
                        pageTagService.addTagToPage(this.page.id, tagId)
                      );
                    }

                    if (this.removedTags.length != 0) {
                      this.removedTags.map((tagId) =>
                        pageTagService.deleteTagFromPage(this.page.id, tagId)
                      );
                    }

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
      //Check (1,1), ultimately gets the user, and its permissions.
      this.authUser = await userService.getAuthenticatedUser();
      this.permission = await permissionService.getPermission(
        this.authUser.permid
      );
      this.users = await userService.getAllUsers();
      this.user = this.users.find((u) => u.id == this.authUser.id)!;

      //Get data from db
      this.tags = await pageService.getTagsFromPage(this.page.id);
      this.originalTags = await pageService.getTagsFromPage(this.page.id);
      this.page = await pageService.getPage(this.page.id);
      this.version = await versionlogService.getLatestVersion(this.page.id);
      const pagesResult = await pageService.getAllPages();
      const allTagsResult = await tagService.getAllTags();

      if (pagesResult) {
        this.pages = pagesResult;
        //Put in startvalue for the dropdown.
        this.pageId = this.pages[0].id;
      } else {
        console.error("Missing pages.");
      }

      //Filters out tags already in use by page
      this.allTags = allTagsResult.filter(
        (x) => !this.tags.some((y) => y.id == x.id)
      );

      //Allows that default value in form.select can be chosen without error.
      if (this.allTags && this.allTags.length > 0) {
        this.tagSelectInput = this.allTags[0].id;
      } else {
        // Handle the case where there are no tags
        this.tagSelectInput = 0; // Or some default value
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default Edit;
