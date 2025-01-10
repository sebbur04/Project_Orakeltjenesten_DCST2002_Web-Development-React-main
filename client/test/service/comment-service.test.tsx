// Import neccessary modules for testing
import commentService, { Comment } from "../../src/service/comment-service";
import axios from "axios";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");

//Tests for CommentService
describe("CommentService", () => {
  //Get all comments
  test("GET /comments", async () => {
    const comments: Comment[] = [
      {
        id: 1,
        userid: 1,
        date: "2023-10-01",
        pageid: 1,
        content: "Test comment",
      },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: comments });

    const result = await commentService.getAllComments();
    expect(axios.get).toHaveBeenCalledWith("/comments");
    expect(result).toEqual(comments);
  });

  //Get comments from a specific page
  test("GET /comments/ + pageId", async () => {
    const pageId = 1;
    const comments: Comment[] = [
      {
        id: 2,
        userid: 2,
        date: "2023-10-02",
        pageid: pageId,
        content: "Another comment",
      },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: comments });

    const result = await commentService.getCommentsFromPage(pageId);
    expect(axios.get).toHaveBeenCalledWith("/comments/" + pageId);
    expect(result).toEqual(comments);
  });

  //Create a new comment
  test("POST /comments", async () => {
    const newComment: Comment = {
      id: 0,
      userid: 3,
      date: "2023-10-03",
      pageid: 2,
      content: "New comment",
    };
    const response = { data: { id: 3 } };
    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await commentService.createComment(newComment);
    expect(axios.post).toHaveBeenCalledWith("/comments", {
      comment: newComment,
    });
    expect(result).toEqual(response.data.id);
  });

  //Delete a comment
  test("DELETE /comments/ + comment.id", async () => {
    const id = 1;
    (axios.delete as jest.Mock).mockResolvedValue({});

    await commentService.deleteComment(id);
    expect(axios.delete).toHaveBeenCalledWith("/comments/" + id);
  });

  //Update a comment
  test("/comments/ + comment.id", async () => {
    const updatedComment: Comment = {
      id: 1,
      userid: 1,
      date: "2023-10-04",
      pageid: 1,
      content: "Updated comment",
    };
    (axios.patch as jest.Mock).mockResolvedValue({});

    await commentService.updateComment(updatedComment);
    expect(axios.patch).toHaveBeenCalledWith("/comments/" + updatedComment.id, {
      comment: updatedComment,
    });
  });
});
