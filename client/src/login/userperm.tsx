import * as React from "react";
import { Component } from "react-simplified";

//Imported services
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Imports from components
import { Button, Card, Column, Row, Form } from "../widgets";
import { history } from "../index";

class UserPermissions extends Component<{ match: { params: { id: number } } }> {
  //The authenticated user
  authUser: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
  //The user whose permissions are being changed
  user: User = { id: 0, username: "", avatar: "", bio: "", permid: 0 };

  //Permissions of auth user
  authUserPermission: Permission = {
    id: 0,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  };

  //Permissions of user whose permissions are being changed
  userPermission: Permission = {
    id: 0,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  };

  permissionTopOutput() {
    //Renders the top part of the permissions. A little bit of chatGpt to find a way to loop and get name of keys. id is needed because of uniques identifier for column.
    let output: React.ReactElement[] = [];
    let id = 0;
    for (const key in this.userPermission) {
      if (key != "id") {
        output.push(<Column key={id}>{key}</Column>);
        id++;
      }
    }
    if (!output) {
      return <div>Brukeren mangler rettigheter</div>;
    }
    return output;
  }

  permissionBottomOutput() {
    //Renders the bottom part of the permissions. Id used to give unique identifier.
    let output: React.ReactElement[] = [];
    let id = 10;
    for (const key in this.userPermission) {
      //A bit of chatGPT used here to find a way to loop through the keys, and give each checkbox the correct value. There are some errors, but these are under control.
      if (key != "id") {
        output.push(
          <Column key={id}>
            <Form.Checkbox
              checked={this.userPermission[key as keyof Permission]}
              onChange={(event) =>
                (this.userPermission[key as keyof Permission] =
                  event.currentTarget.checked)
              }
            ></Form.Checkbox>
          </Column>
        );
        id++;
      }
    }
    if (!output) {
      return <div>Brukeren mangler rettigheter</div>;
    }
    return output;
  }

  render() {
    if (
      //Checks for permissions, also checks if the user is the admin user, we dont want anyone with "users" permission to change the admin users permissions. We have removed the admin user from the users list, but this is in case someone tries to go through the url, check (1,2)
      !this.authUserPermission.users ||
      this.authUser.id == this.props.match.params.id ||
      this.user.username == "admin"
    ) {
      return (
        <div className="mainContent">
          <h3>Mangler rettigheter</h3>
        </div>
      );
    }
    return (
      <div className="mainContent">
        <Card title={`Rettigheter for "${this.user.username}"`}>
          <Row>{this.permissionTopOutput()}</Row>
          <Row>{this.permissionBottomOutput()}</Row>
          <Row>
            <Column>
              <Button.Success
                onClick={async () => {
                  await permissionService.updatePermissions(
                    this.userPermission
                  );

                  history.push("/users");
                }}
              >
                Lagre
              </Button.Success>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      this.authUser = await userService.getAuthenticatedUser();
      this.authUserPermission = await permissionService.getPermission(
        this.authUser.permid
      );

      this.user = await userService.getUser(this.props.match.params.id);

      //If user has no entry in permissions table, then make a new entry and link it.
      if (!this.user.permid) {
        let permId = await permissionService.createPermission();

        this.user.permid = permId;

        await userService.updateUserPermId(this.user);
      }

      this.userPermission = await permissionService.getPermission(
        this.user.permid
      );
    } catch (error) {
      console.error();
    }
  }
}

export default UserPermissions;
