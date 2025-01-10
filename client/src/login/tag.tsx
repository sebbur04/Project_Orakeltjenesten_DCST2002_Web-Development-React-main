import * as React from "react";
import { Button, Card, Column, Row, Form, Alert } from "../widgets"; // Adjust the path as necessary
import { Component } from "react-simplified";
import pageService, { Page } from "../service/page-service";
import tagService, { Tag } from "../service/tag-service";
import { history } from "../index";
import Sidebar from "./sidebar";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

class TagComp extends Component<{ match: { params: { id: number } } }> {
  pages: Page[] = [];
  tag: Tag = { id: 0, name: "" };
  //In case of "Avbryt" when changing tag name.
  oldTag: Tag = { id: 0, name: "" };

  //To check if name exists
  tags: Tag[] = [];

  //Input
  changeTag: boolean = false;

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

  title() {
    //Checks if you want to change tag name.
    if (!this.changeTag) {
      return (
        <div>
          <Row>
            <Column width={4}>
              <h3>{this.tag.name}</h3>
            </Column>
            <Column width={4}>
              <Button.Light
                onClick={() => {
                  if (this.permission.tags) {
                    this.changeTag = true;
                  } else {
                    Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                    console.log("access denied");
                  }
                }}
              >
                Endre tag
              </Button.Light>
            </Column>
          </Row>
        </div>
      );
    } else {
      return (
        <div className="edit-tag-container">
          <Row>
              <Form.Input
                width="20vw"
                type="text"
                value={this.tag.name}
                onChange={(event) => {
                  if (event.currentTarget.value.length < 21) {
                    this.tag.name = event.currentTarget.value;
                  } else {
                    console.error("Too many chars");
                  }
                }}
              ></Form.Input>
              <Button.Light
                onClick={() => {
                  this.tag.name = this.oldTag.name;
                  this.changeTag = false;
                }}
              >
                Avbryt
              </Button.Light>
              <Button.Success
                onClick={async () => {
                  //Check for tag with same name. Replace function removes whitespace at the start of the string.
                  const nameExists = this.tags.find(
                    (x) =>
                      x.name.toLowerCase() ==
                      this.tag.name.replace(/^[ ]+/g, "").toLowerCase()
                  );

                  //Checks if tagname empty or includes only whitespaces
                  if (this.tag.name.replace(/\s+/g, "") == "") {
                    Alert.danger("Tag mangler navn.");
                    console.error("No tag name");
                  } else if (nameExists) {
                    Alert.danger("Tag already exists");
                    console.error("Tag exists");
                  } else {
                    try {
                      await tagService.updateTag(this.tag);
                      this.oldTag = this.tag;
                    } catch (error) {
                      console.log(error);
                    }

                    //Updates the tags in sidebar, check (2,4)
                    Sidebar.instance()?.mounted();

                    this.changeTag = false;
                  }
                }}
              >
                Lagre
              </Button.Success>

              <Button.Danger
                onClick={async () => {
                  try {
                    await tagService.deleteTag(this.tag.id);
                  } catch (error) {
                    console.log(error);
                  }
                  //Updates tags in sidebar, check (2,4)
                  Sidebar.instance()?.mounted();

                  this.changeTag = false;

                  history.push("/");
                }}
              >
                Slett
              </Button.Danger>
          </Row>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="mainContent">
        <Card title="">
          <div className="tag-box-style">
            <Row>{this.title()}</Row>
            <Row>
              {this.pages.map((page) => (
                <Row key={page.id}>
                  <a
                    className="blue-link"
                    href={`/#/pages/${page.id}`}
                    onClick={() => {
                      //Increments page_views by 1
                      pageService.updatePageViews(page.id);
                    }}
                  >
                    {page.name}
                  </a>
                </Row>
              ))}
            </Row>
            <Row>
              {/*Show amount of pages under tag */}
              <Column>{`Antall sider: ${this.pages.length}`}</Column>
            </Row>
          </div>
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

      // Fetch pages associated with the tag
      this.pages = await pageService.getPageFromTag(this.props.match.params.id);

      //Fetch all tags
      this.tags = await tagService.getAllTags();

      // Fetch the tag details to get the name for the Card title
      this.tag = await tagService.getTag(this.props.match.params.id);
      this.oldTag = await tagService.getTag(this.props.match.params.id);

      //In case someone goes to another tag view without pressing "Angre"
      this.changeTag = false;
    } catch (error) {
      console.error("Failed to load pages or tag data:", error);
    }
  }
}

export default TagComp;
