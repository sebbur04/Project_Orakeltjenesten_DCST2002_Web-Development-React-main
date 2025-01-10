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

//Component imports
import { Card, Row, Column } from "../widgets";

class PageContent extends Component<{ match: { params: { id: number } } }> {
  //State variables for storing page information
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
  users: User[] = [];

  //Check (2,3). Reloads window on url-change. Needed here because of built in links in the page content.
  async componentDidUpdate(prevProps: { match: { params: { id: number } } }) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      await pageService.updatePageViews(this.props.match.params.id);
      window.location.reload();
    }
  }

  //Renders page information, including page tags and comments
  render() {
    return (
      <div className="mainContent">
        <Card title={this.page.name}>
          <Row>
            <Column width={12}>Tagger:</Column>
            {this.tags.map((tag) => (
              <Column width={1} key={tag.id}>
                <div className="small-text-page-comment">
                  <a className="blue-link" href={"/#/tags/" + tag.id}>
                    {tag.name}
                  </a>
                </div>
              </Column>
            ))}
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
          </Row>
        </Card>

        {/* ----------------------------------COMMENT SECTION STARTS HERE ---------------------------------- */}

        <Card title={"Kommentarer"}>
          {this.comments.map((comment) => {
            //Gets user from comment.
            let user = this.users.find((u) => u.id == comment.userid);
            if (!user) {
              user = {
                id: 0,
                username: "No User",
                avatar: "",
                bio: "",
                permid: 0,
              };
            }

            //Check (2,2) Gets date
            const date = moment
              .utc(comment.date)
              .local()
              .format("YYYY-MM-DD HH:mm");

            {
              /* See others' comments */
            }
            return (
              <div className="comment-border" key={comment.id}>
                <Row>
                  <Row>
                    <Column width={12}>
                      <p>
                      <img className="comment-image" src={user.avatar}></img>
                        {" "}
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
                  <Row key={comment.id}>
                    <Column width={10}>{comment.content}</Column>
                  </Row>
                </Row>
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  async mounted() {
    try {
      //Fills state variables with data
      this.pageContent = await versionlogService.getLatestVersion(
        this.pageContent.pageid
      );
      this.page = await pageService.getPage(this.pageContent.pageid);
      this.comments = await commentService.getCommentsFromPage(
        this.pageContent.pageid
      );
      this.users = await userService.getAllUsers();
      this.tags = await pageService.getTagsFromPage(this.pageContent.pageid);
    } catch (error) {
      console.log(error);
    }
  }
}

export default PageContent;
