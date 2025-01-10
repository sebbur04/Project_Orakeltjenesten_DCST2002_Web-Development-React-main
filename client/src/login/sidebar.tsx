// LOGGED IN

import * as React from "react";
import { Component } from "react-simplified";
import Markdown from "markdown-to-jsx";

//Services used
import pageService from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Components and widgets used
import { Card, Row, Button, Form, Column, Alert } from "../widgets"; // Adjust as necessary
import TagComp from "./tag";
import { history } from "../index";

// Sidebar Navigation
class Sidebar extends Component {
  //Information
  tags: Tag[] = []; // List of tags
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 }; // Authenticated user details
  userPerm: Permission = {
    id: 0,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  }; // User permissions

  //Inputs
  newTag: boolean = false; // Flag to show/hide new tag input
  errorMessage: boolean = false; // Flag to show/hide error message
  newTagName: string = ""; // New tag name input

  render() {
    return (
      <div className="sidebar">
        <Card title="">
          <Row>
            <Button.Light
              onClick={async () => {
                //Checks for permission
                if (this.userPerm.alterpages) {
                  const pageId = await pageService.createPage();

                  history.push(`/pages/${pageId}/new`);
                } else {
                  console.log("access denied");
                }
              }}
            >
              Opprett ny side [+]
            </Button.Light>
          </Row>

          <Row>
            <Button.Light
              onClick={() => {
                //Checks for permission
                if (this.userPerm.tags) {
                  this.newTag = true;
                } else {
                  Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                  console.log("access denied");
                }
              }}
            >
              Opprett ny tag [+]
            </Button.Light>
          </Row>
          {/*Check (2,1), only shows input if newTag is true */}
          {this.newTag && (
            <div>
              <Row>
                <Form.Input
                  maxlength={25}
                  type="text"
                  value={this.newTagName}
                  onChange={(event) => {
                    if (event.currentTarget.value.length < 21) {
                      this.newTagName = event.currentTarget.value;
                    } else {
                      console.log("Tag name too long");
                    }
                  }}
                ></Form.Input>
              </Row>
              {this.errorMessage && (
                <Row>
                  <p style={{ color: "red", fontSize: "18px" }}>
                    Mangler innhold eller Tag eksisterer
                  </p>
                </Row>
              )}
              <Row>
                <Column>
                  <Button.Light
                    onClick={() => {
                      this.newTagName = "";
                      this.newTag = false;
                      this.errorMessage = false;
                    }}
                  >
                    Avbryt
                  </Button.Light>
                </Column>
                <Column>
                  <Button.Success
                    onClick={async () => {
                      //Check for tag with same name. Replace function removes whitespace at the start of the string.
                      const nameExists = this.tags.find(
                        (x) =>
                          x.name.toLowerCase() ==
                          this.newTagName.replace(/^[ ]+/g, "").toLowerCase()
                      );

                      //Checks for whitespace
                      const noWhiteName = this.newTagName.replace(/\s+/g, "");

                      if (
                        this.newTagName.length != 0 &&
                        noWhiteName.length != 0 &&
                        !nameExists
                      ) {
                        try {
                          const tagId = await tagService.createTag(
                            this.newTagName
                          );

                          this.tags.push({ id: tagId, name: this.newTagName });

                          this.newTagName = "";
                          this.newTag = false;
                          this.errorMessage = false;
                        } catch (error) {
                          console.log(error);
                        }
                      } else {
                        this.errorMessage = true;
                      }
                    }}
                  >
                    Lag tagg
                  </Button.Success>
                </Column>
              </Row>
            </div>
          )}

          <Row>
            <br />
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
                //Checks in case there are Null pages, this is due to the possibility of pressing "opprett ny side", thus creating an empty page, then clicking to a new link, which does not delete the page. If "Avbryt" is clicked beforehand then there is no problem as the page gets deleted.
                try {
                  await pageService.checkForEmptyPages();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Alle sider
            </a>
            <Markdown>---</Markdown>
          </Row>
          <Row>
            {/*Checks for "users" permission, which gives access to change permissions and delete other users */}
            <div>
              <a
                className="blue-link"
                onClick={() => {
                  if (this.userPerm.users) {
                    history.push("/users");
                  } else {
                    Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                  }
                }}
              >
                Brukere
              </a>
            </div>
          </Row>
          {this.tags.map((tag) => (
            <Row key={tag.id}>
              <Markdown>---</Markdown>

              <a
                className="blue-link"
                onClick={() => {
                  history.push(`/tags/${tag.id}`);
                  //Reload the TagComp mounted function to update the page. Similar issue to (2,3)
                  TagComp.instance()?.mounted();
                }}
              >
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
      this.tags = await tagService.getAllTags(); // Fetch all tags
      this.authUser = await userService.getAuthenticatedUser(); // Fetch authenticated user details
      this.userPerm = await permissionService.getPermission(
        this.authUser.permid
      ); // Fetch user permissions
    } catch (error) {
      console.error(error);
    }
  }
}

export default Sidebar;
