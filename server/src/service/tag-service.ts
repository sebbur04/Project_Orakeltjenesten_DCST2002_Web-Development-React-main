// Import mysql pool, RowDataPacket and ResultSetHeader from mysql2.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for tag
export type Tag = {
  id: number;
  name: string;
};

//Service for tag
class TagService {
  /**
   * Get tag with given id.
   */
  getTag(id: number) {
    return new Promise<Tag | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Tags WHERE id = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results[0] as Tag);
        }
      );
    });
  }

  /**
   * Get all tags.
   */
  getAllTags() {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Tags",
        [],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Tag[]);
        }
      );
    });
  }

  /**
   * Get all tags from page
   */
  getTagsFromPage(pageId: number) {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query(
        "SELECT t.id, t.name FROM Tags t JOIN PageTags p ON t.id = p.tagid WHERE p.pageid = ?",
        [pageId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Tag[]);
        }
      );
    });
  }

  /**
   * Create new tag having the given id.
   *
   * Resolves the newly created tag id.
   */
  createTag(name: string) {
    return new Promise<number>((resolve, reject) => {
      //In case tag-name starts with whitespace
      pool.query(
        "INSERT INTO Tags SET name=?",
        [name.replace(/^[ ]+/g, "")],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Delete tag with given id.
   */
  deleteTag(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Tags WHERE id = ?",
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
   * Update tag with given id.
   */
  updateTag(tag: Tag) {
    return new Promise<Tag>((resolve, reject) => {
      //In case tag-name starts with whitespace
      pool.query(
        "UPDATE Tags SET name = ? WHERE id = ?",
        [tag.name.replace(/^[ ]+/g, ""), tag.id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          if (results.affectedRows === 0) {
            return reject(new Error("Tag not found"));
          }

          pool.query(
            "SELECT * FROM Tags WHERE id = ?",
            [tag.id],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);

              resolve(results[0] as Tag);
            }
          );
        }
      );
    });
  }
}

const tagService = new TagService();
export default tagService;
