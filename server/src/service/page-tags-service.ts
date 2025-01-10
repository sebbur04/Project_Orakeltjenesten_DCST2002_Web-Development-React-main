// Import mysql pool from mysql-pool and RowDataPacket and ResultSetHeader from mysql2.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for pagetag
export type PageTag = {
  pageid: number;
  tagid: number;
};

//Service for pagetag
class PageTagsService {
  /**
   * Get pagetags with given pageid.
   */
  getPageTag(id: number) {
    return new Promise<Comment | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM PageTags WHERE pageid = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject("No tag found");

          resolve(results[0] as Comment);
        }
      );
    });
  }

  /**
   * Get all page tags. Join tagid ON tag.id
   */
  getAllPageTags() {
    return new Promise<PageTag[]>((resolve, reject) => {
      pool.query(
        "SELECT Tags.id, Tags.name FROM Tags JOIN PageTags ON Tags.id = PageTags.tagid",
        [],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length === 0) {
            return reject(new Error("No tags found"));
          }

          resolve(results as PageTag[]);
        }
      );
    });
  }

  /**
   * Delete tag from page
   */
  deleteTagFromPage(pageId: number, tagId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM PageTags WHERE pageid=? AND tagid=?",
        [pageId, tagId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0)
            return reject(new Error("No row deleted"));

          resolve();
        }
      );
    });
  }

  /**
   * Delete all tags from page
   */
  deleteAllPageTags(pageId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "Delete FROM PageTags WHERE pageid=?",
        [pageId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /** Add Tag to Page
   *
   */
  addTagToPage(pageId: number, tagId: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        "INSERT INTO PageTags SET pageid=?, tagid=?",
        [pageId, tagId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0)
            return reject(new Error("No tag added to page"));

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Delete all pages from tag
   */
  deleteAllPagesFromTag(tagId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM PageTags WHERE tagid=?",
        [tagId],
        (error, _results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /**
   * Made only for testing purposes/for the back-end tests
   */
  createPageTag(pageId: number, tagId: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        "INSERT INTO PageTags SET pageid=?, tagid=?",
        [pageId, tagId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }
}

const pageTagsService = new PageTagsService();
export default pageTagsService;
