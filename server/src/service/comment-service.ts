// Import mysql pool from mysql-pool and RowDataPacket and ResultSetHeader from mysql2.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for comment
export type Comment = {
  id: number;
  userid: number;
  date: string;
  pageid: number;
  content: string;
};

//Service for comment
class CommentService {
  /**
   * Get comments from page with given pageid.
   */
  getAllCommentsFromPage(pageid: number) {
    return new Promise<Comment[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Comments WHERE pageid = ?",
        [pageid],
        (error, results: RowDataPacket[]) => {
          if (error) {
            return reject(error);
          }

          resolve(results as Comment[]);
        }
      );
    });
  }

  /**
   * Get all comments.
   */
  getAllComments() {
    return new Promise<Comment[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Comments",
        [],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Comment[]);
        }
      );
    });
  }

  /**
   * Create new comment having the given id.
   *
   * Resolves the newly created comment id.
   */
  createComment(comment: Comment) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        "INSERT INTO Comments SET userid=?, content=?, date=?, pageid=?",
        [
          comment.userid,
          comment.content.replace(/^[ ]+/g, ""),
          comment.date,
          comment.pageid,
        ],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.insertId == 0)
            return reject(new Error("No comment created"));

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Delete comment with given id.
   */
  deleteComment(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Comments WHERE id = ?",
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) reject(new Error("No row deleted"));

          resolve();
        }
      );
    });
  }

  /**
   * Update comment with given id.
   */

  updateComment(comment: Comment) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "UPDATE Comments SET content = ? WHERE id = ?",
        [comment.content.replace(/^[ ]+/g, ""), comment.id],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /**
   * Delete all comments from page with given pageid.
   */
  deleteAllPageComments(pageId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Comments WHERE pageid=?",
        [pageId],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

const commentService = new CommentService();
export default commentService;
