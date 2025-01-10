import * as React from "react";
import { Component } from "react-simplified";
import Markdown from "markdown-to-jsx";
import moment from "moment";

//Services
import versionlogService, { Versionlog } from "../service/versionlog-service";
import pageService, { Page } from "../service/page-service";
import { Tag } from "../service/tag-service";
import commentService, { Comment } from "../service/comment-service";
import userService, { User } from "../service/user-service";
import permissionService, { Permission } from "../service/permission-service";

//Components
import { Card, Button, Row, Column, Form, Alert } from "../widgets";
import { history } from "../index";

class PageContent extends Component<{ match: { params: { id: number } } }> {
  //Needed, check (1,1)
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

  //To show information.
  page: Page = { id: 0, name: "", num_views: 0 };
  pageContent: Versionlog = {
    id: 0,
    content: "",
    userid: 0,
    date: "",
    changelog: "",
    version: 0,
    pageid: this.props.match.params.id,
  };
  tags: Tag[] = [];
  comments: Comment[] = [];

  //In case changes to comments are cancelled, must fetch old content.
  oldComments: Comment[] = [];

  //Inputs
  commentInput: string = "";
  changeComment: number = 0;
  commentError = false;

  //Check (2,3). Reloads window on url-change. Needed here because of built in links in the page content.
  async componentDidUpdate(prevProps: { match: { params: { id: number } } }) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      await pageService.updatePageViews(this.props.match.params.id);
      window.location.reload();
    }
  }

  render() {
    return (
      <div className="mainContent">
        <Card title={this.page.name}>
          <Row>
            <Column>Tagger:</Column>
            <div className="tags-flexbox">
              {this.tags.map((tag) => (
                <a
                  key={tag.id}
                  className="blue-link"
                  href={"/#/tags/" + tag.id}
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </Row>

          <div className="page-content">
            <Markdown>{this.pageContent.content}</Markdown>
          </div>

          <Row>
            <Column width={4}>Antall visninger: {this.page.num_views}</Column>
            <Column width={4}>
              <a
                className="blue-link"
                href={`/#/pages/${this.page.id}/versionlog`}
              >
                Versjonslogg
              </a>
            </Column>
            <Column width={1}>
              <Button.Light
                onClick={() => {
                  if (this.permission.alterpages) {
                    history.push(`/pages/${this.page.id}/edit`);
                  } else {
                    Alert.danger("Du har ikke tillatelse til å gjøre dette.");
                    console.log("access denied");
                  }
                }}
              >
                Rediger
              </Button.Light>
            </Column>
          </Row>
        </Card>

        {/* ----------------------------------COMMENT SECTION STARTS HERE ---------------------------------- */}

        <Card title={"Kommentarer"}>
          {this.comments.map((comment) => {
            //Finds user of comment
            let user = this.users.find((u) => u.id == comment.userid);
            if (!user) {
              user = { id: 0, username: "", avatar: "", bio: "", permid: 0 };
            }

            //Gets the original Comment, in case you "avbryt" change of comment.
            let oldComment: Comment | undefined = this.oldComments.find(
              (x) => x.id == comment.id
            );

            //Gets date, check (2,2)
            const date = moment
              .utc(comment.date)
              .local()
              .format("YYYY-MM-DD HH:mm");

            //Used AI to find correct Type of tsx-elements
            let commentOutput: React.ReactElement = <Row></Row>;
            let editButtons: React.ReactElement = <Row></Row>;

            /*View of the comments changes based on if you're the owner of the comment or not, or if you want to edit the comment. */
            //Checks if comments is supposed to be edited
            if (this.changeComment == comment.id) {
              commentOutput = (
                <div>
                  <Row>
                    <Column width={10}>
                      <Form.Textarea
                        width="50vw"
                        maxlength={100}
                        rows={4}
                        value={comment.content}
                        onChange={(event) =>
                          (comment.content = event.currentTarget.value)
                        }
                      ></Form.Textarea>
                    </Column>
                    <Column width={1}>
                      <Button.Light
                        onClick={() => {
                          if (oldComment) {
                            comment.content = oldComment.content;

                            this.changeComment = 0;
                          }
                        }}
                      >
                        Avbryt
                      </Button.Light>
                      <Button.Success
                        onClick={async () => {
                          if (comment.content.length == 0) {
                            this.commentError = true;
                          } else {
                            await commentService.updateComment(comment);

                            if (oldComment) {
                              oldComment.content = comment.content;
                            }

                            this.commentError = false;

                            this.changeComment = 0;
                          }
                        }}
                      >
                        Lagre
                      </Button.Success>
                    </Column>
                  </Row>
                  <Row>
                    {/*Code from student assistant, clean way to show built in error if variable is true. */}
                    {this.commentError && (
                      <p style={{ color: "red" }}>Mangler innhold</p>
                    )}
                  </Row>
                </div>
              );
            } else if (
              //Checks if you're the owner, or if you have the allcomments permission
              this.authUser.id == comment.userid ||
              this.permission.allcomments
            ) {
              {
                /* See own comment */
              }
              commentOutput = (
                <Row>
                  <div>{comment.content}</div>
                </Row>
              );

              editButtons = (
                <div>
                  <Column>
                    <Button.Light
                      onClick={() => {
                        this.changeComment = comment.id;
                      }}
                    >
                      ✏️
                    </Button.Light>
                  </Column>
                  <Column>
                    <Button.Danger
                      onClick={async () => {
                        await commentService.deleteComment(comment.id);

                        this.comments = this.comments.filter(
                          (x) => x.id !== comment.id
                        );
                      }}
                    >
                      X
                    </Button.Danger>
                  </Column>
                </div>
              );
            } else {
              {
                /* See others' comments */
              }

              commentOutput = (
                <Row>
                  <h6>{comment.content}</h6>
                </Row>
              );
            }

            return (
              <div className="comment-border" key={comment.id}>
                <Row>
                  <Row>
                    <Column width={12}>
                      <p>
                        <img className="comment-image" src={user.avatar}></img>{" "}
                        {/* wraps the username in p tag for styling in CSS */}
                        <a className="blue-link" href={`/#/users/${user.id}`}>
                          {user.username}
                        </a>
                      </p>
                    </Column>
                  </Row>
                  <Row>
                    <div className="small-text-page-comment">
                      <Column width={12}>{date}</Column>
                    </div>
                  </Row>
                  <Row>
                    <br />
                  </Row>{" "}
                  {/*padding between comment date and content for better readability on the page */}
                  <Row>
                    <Column width={10}>{commentOutput}</Column>
                    <Column width={2}>{editButtons}</Column>
                  </Row>
                </Row>
              </div>
            );
          })}
          <Row>
            <div className="comment-border">
              <Column width={9}>
                <Form.Textarea
                  width="70vw"
                  rows={4}
                  placeholder="Skriv en ny kommentar..."
                  value={this.commentInput}
                  onChange={(event) =>
                    (this.commentInput = event.currentTarget.value)
                  }
                ></Form.Textarea>
              </Column>
              <Column width={1}>
                <Button.Success
                  onClick={async () => {
                    //Checks for comment with only whitespace
                    if (this.commentInput.replace(/\s+/g, "").length != 0) {
                      const newComment: Comment = {
                        id: 0,
                        date: "",
                        content: "",
                        userid: 0,
                        pageid: 0,
                      };

                      //Add comment values, also check (2,2) for use of moment
                      newComment.date = moment().format("YYYY-MM-DD HH:mm:ss");
                      newComment.content = this.commentInput;
                      newComment.pageid = this.page.id;
                      newComment.userid = this.authUser.id;
                      newComment.id = Number(
                        await commentService.createComment(newComment)
                      );

                      //Update page data
                      this.comments.push(newComment);
                      //... syntax from chatGPT as i did not know how to stop this.oldComments to update along with this.comments
                      this.oldComments.push({ ...newComment });
                    } else {
                      Alert.danger(
                        "Kommentarer må inneholde mer enn bare mellomrom."
                      );
                    }

                    this.commentInput = "";
                  }}
                >
                  Kommenter
                </Button.Success>
              </Column>
            </div>
          </Row>
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      //Gets logged in User info, check (1,1)
      this.authUser = await userService.getAuthenticatedUser();
      this.users = await userService.getAllUsers();
      this.user = this.users.find((u) => u.id == this.authUser.id)!;
      this.permission = await permissionService.getPermission(
        this.authUser.permid
      );

      //Gets data from db
      this.pageContent = await versionlogService.getLatestVersion(
        this.pageContent.pageid
      );
      this.page = await pageService.getPage(this.pageContent.pageid);
      this.comments = await commentService.getCommentsFromPage(
        this.pageContent.pageid
      );
      this.oldComments = await commentService.getCommentsFromPage(
        this.pageContent.pageid
      );
      this.tags = await pageService.getTagsFromPage(this.pageContent.pageid);
    } catch (error) {
      console.log(error);
    }
  }
}

export default PageContent;
