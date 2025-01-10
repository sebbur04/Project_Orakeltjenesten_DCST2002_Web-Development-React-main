import * as React from "react";
import { Component } from "react-simplified";
import Markdown from "markdown-to-jsx";

//Services
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Component imports
import { Button, Card, Column, Row, Form } from "../widgets"; // Adjust the path as necessary
import { history } from "../index";

// ------------------------------------------- ------------------------------------------- //
// Page for user management, where admins can delete or change user permissions or delete users from the database
// ------------------------------------------- ------------------------------------------- //

class Users extends Component {
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

  //Input
  searchInput: string = "";

  //Used to store all users
  allUsers: User[] = [];

  //used to show the users from the search
  users: User[] = [];

  // Check if the user has permission to access the page, check (1,2)
  render() {
    if (!this.permission.users) {
      return (
        <div className="mainContent">
          <h3>Mangler rettigheter</h3>
        </div>
      );
    }
    // If user has the right permissions, render card with users edit page for admins to delete or change user permissions
    return (
      <div className="mainContent">
        <div className="useredit">
          <Card title="Brukere">
            <Row>
              {/* Searchbar for specific user */}
              <Column>
                <Form.Input
                  width="40vw"
                  type="text"
                  placeholder="Søk etter bruker"
                  value={this.searchInput}
                  onChange={(event) => {
                    this.searchInput = event.currentTarget.value;

                    //Updates this.users to only include usernames which match the filter condition.
                    this.users = this.allUsers.filter((user) =>
                      user.username.includes(this.searchInput)
                    );
                  }}
                ></Form.Input>
              </Column>
            </Row>
            {this.users.map((u) => (
              <Row key={u.id}>
                <Markdown>---</Markdown>
                <Column width={4}>
                  {/*Takes you to profile of user */}
                  <a className="blue-link" href={`/#/users/${u.id}`}>
                    {u.username}
                  </a>
                </Column>
                <Column width={3}>
                  {/*Takes you to permissions page to change the user permissions */}
                  <Button.Light
                    onClick={() => {
                      history.push(`/users/${u.id}/permissions`);
                    }}
                  >
                    Endre rettigheter
                  </Button.Light>
                </Column>
                <Column width={2}>
                  <Button.Danger
                    onClick={async () => {
                      //Deletes user, and usercomments and permission.
                      await userService.deleteUserComments(u.id);
                      await userService.deleteUser(u.id);
                      if (u.permid) {
                        await permissionService.deletePermission(u.permid);
                      }
                      //Removes user from the user view.
                      this.users = this.users.filter((x) => u.id != x.id);
                    }}
                  >
                    Slett bruker
                  </Button.Danger>
                </Column>
              </Row>
            ))}
          </Card>
        </div>
      </div>
    );
  }

  // Mount for the user management page
  //--------------------------------------------------------------------------------//

  async mounted() {
    try {
      this.authUser = await userService.getAuthenticatedUser();
      this.permission = await permissionService.getPermission(
        this.authUser.permid
      );
      this.user = this.users.find((u) => u.id == this.authUser.id)!;

      this.users = await userService.getAllUsers();

      //user 'admin' and own user removed from search results
      this.users = this.users.filter(
        (u) => u.username != "admin" && u.id != this.authUser.id
      );
      this.allUsers = this.users;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Users;
