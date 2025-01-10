import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type PageTag = {
  pageid: number;
  tagid: number;
};

class PageTagService {
  /**
   * Get pagetags with given id.
   */
  async getPageTag(pageid: number) {
    const response = await axios.get<PageTag>('/pages' + pageid)
    
    return response.data.pageid;
  }

  /**
   * Get all page tags.
   */
  async getAllPageTags() {
     const response = await axios.get<PageTag[]>('/pages') 
     
     return response.data;
  }


  //Delete a tag from page
  async deleteTagFromPage(pageId: number, tagId: number) {
    try{
      await axios.delete('/pages/' + pageId + '/edit/' + tagId);

      return;
    } catch(error){console.log(error)}

  }

  


  //Add tag to page
  async addTagToPage(pageId: number, tagId: number){
    try{
      await axios.post('/pages/' + pageId + '/edit/' + tagId);

      return;
    } catch(error){console.log(error)}
  }
}

const pageTagService = new PageTagService();
export default pageTagService;