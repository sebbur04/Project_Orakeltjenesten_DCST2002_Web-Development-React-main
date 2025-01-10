import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

export type Tag = {
  id: number;
  name: string;
};

class TagService {
  /**
   * Get tag with given id.
   */
  async getTag(id: number) {
    const response = await axios.get<Tag>("/tags/" + id);

    return response.data;
  }

  /**
   * Get all tags/categories.
   */
  async getAllTags() {
    const response = await axios.get<Tag[]>("/tags");

    return response.data;
  }

  /**
   * Create new tag having the given name.
   *
   * Resolves the newly created tag id.
   */
  async createTag(name: string) {
    const response = await axios.post<{ id: number }>("/tags", { name: name });

    return response.data.id;
  }

  /**
   * Delete tag having the given id.
   */
  async deleteTag(id: number) {
    try {
      await axios.delete("/tags/" + id);

      return;
    } catch (error) {
      return error;
    }
  }

  /**
   *  Update name of tag with specified id.
   */
  async updateTag(tag: Tag) {
    try {
      await axios.patch("/tags/" + tag.id + "/edit", { tag: tag });

      return;
    } catch (error) {
      return error;
    }
  }

  //Delete all pages belonging to tagid
  async deleteAllPagesFromTag(tagId: number) {
    try {
      await axios.delete("/tags/" + tagId + "/pages");
    } catch (error) {
      return error;
    }
  }
}

const tagService = new TagService();
export default tagService;
