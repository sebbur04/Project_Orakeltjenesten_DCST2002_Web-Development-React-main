import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Permission = {
  id: number,
  alterpages: boolean,
  deletepages: boolean,
  versions: boolean,
  allcomments: boolean,
  tags: boolean,
  users: boolean
}

class PermissionService {
  /**
   * Get tag with given id.
   */
  async getPermission(id: number) {
    const response = await axios.get<Permission>('/permissions/' + id)

    return response.data;
  }

  /**
   * Get all tags/categories.
   */
  async getAllPermissions() {

     const response = await axios.get<Permission[]>('/permissions') 
     
     return response.data;
  }


  /**
   * Create new tag having the given name.
   *
   * Resolves the newly created tag id.
   */
  async createPermission() {
    const response = await axios.post<{ id: number }>('/permissions');
    
    return response.data.id;
  }

  /**
   * Delete tag having the given id.
   */
  async deletePermission(id: number) {
    await axios.delete('/permissions/' + id); 
    
    return;
  }

  /**
   *  Update name of tag with specified id.
   */
  async updatePermissions(permission: Permission) {
    try{
      await axios.patch('/permissions/' + permission.id + '/edit', { permission: permission});
      
      return;
    } catch(error){return(error)}
  }
  
}

const permissionService = new PermissionService();
export default permissionService;