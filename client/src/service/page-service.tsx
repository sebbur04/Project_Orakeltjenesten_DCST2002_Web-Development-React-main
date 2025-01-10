import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

import {Tag} from './tag-service'

export type Page = {
    id: number;
    name: string;
    num_views: number;
};

class PageService {
  /**
   * Get page with given id.
   */
  async getPage(pageId: number) {
      const response = await axios.get<Page>('/pages/' + pageId);
      
      return response.data;
  }

  /**
   * Get all pages.
   */
  async getAllPages() {
    try{
      const response = await axios.get<Page[]>('/pages');

      return response.data;
    } catch(error){console.log(error)}
  }


  //Henter sider som er sortert på mengde besøk
  async getOrderedPages(){
    const response = await axios.get<Page[]>('/pages/orderedpages')

    return response.data;
  }

  /**
   * Create new page having the given name.
   *
   * Resolves the newly created page id.
   */
  async createPage() {
    const response = await axios.post<{ id: number }>('/pages');
    
    return response.data.id;
  }


  async checkForEmptyPages(){
    try{
      await axios.delete('/pages/empty');

      return;
    } catch(error){console.log(error)}
  }


  //Sletter side med id 
  async deletePage(id: number) {
    try{
      await axios.delete('/pages/' + id);

      return;
    } catch(error){console.log(error)}
  }


  //Sletter enkelt, tom side med id 
  async deleteEmptyPage(id: number) {
    try{
      await axios.delete('/pages/' + id + "/page");

      return;
    } catch(error){console.log(error)}
  }


  /**
   * Update the number of views for the given page.
   */
  async updatePageViews(pageId: number) {
    try{
      await axios.patch('/pages/' + pageId);
    
      return;
    } catch(error){console.log(error)}
  }


  async updatePageName(page: Page) {
    try{
      await axios.patch<Page>('/pages/' + page.id + '/editname', {name: page.name});

      return;
    } catch(error) {return error}
  }


  /**
   *  Hente pages ut ifra tags.
   */
  async getPageFromTag(id: number) {
    const response = await axios.get<Page[]>('/tags/' + id + '/pages');
    
    return response.data;
  }



  //Get all tags belonging to a page
  async getTagsFromPage(pageId: number) {
    const response = await axios.get<Tag[]>('/pages/' + pageId + '/edit');

    return response.data;
  }

  //search for pages
  async searchPages(query: string) {
    const response = await axios.get<Page[]>('/pages');
    return response.data.filter(page => page.name.toLowerCase().includes(query.toLowerCase()));
  }
}
  
const pageService = new PageService();
export default pageService;