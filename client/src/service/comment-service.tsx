import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Comment = {
  id: number;
  userid: number;
  date: string;
  pageid: number;
  content: string;
};

class CommentService {
  /**
   * Get comment with given id.
   */
  // async getComment(id: number) {
  //   const response = await axios.get<Comment>('/comments/' + id)
    
  //   return response.data.id;
  // }


  /**
   * Get all comments.
   */
  async getAllComments() {
     const response = await axios.get<Comment[]>('/comments') 
     
     return response.data;
  }


  //Get comments for specific page
  async getCommentsFromPage(pageId: number){
    try{
      const response = await axios.get('/comments/' + pageId);

      return response.data;
    } catch(error){console.log(error)}
  }


  /**
   * Create new comment having the given id.
   *
   * Resolves the newly created page id.
   */
  async createComment(comment: Comment) {
    try{
      const response = await axios.post<{ id: number }>('/comments', { comment: comment });

      return response.data.id;
    } catch(error) {return(error)}
  }


  /**
   * Delete comment having the given id.
   */
  async deleteComment(id: number) {
    try{

      await axios.delete('/comments/' + id)
    
      return;

    } catch(error){return(error)}
  }


  /**
   * Update the comment with the given id.
   */
  async updateComment(comment: Comment) {
    try{

      await axios.patch('/comments/' + comment.id, { comment: comment });
      
      return;

    } catch(error){return(error)}
  }
}

const commentService = new CommentService();
export default commentService;
