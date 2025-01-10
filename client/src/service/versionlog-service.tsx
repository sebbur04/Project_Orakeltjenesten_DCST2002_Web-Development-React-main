import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Versionlog = {
    id: number,
    pageid: number,
    content: string,
    userid: number,
    date: string,
    changelog: string,
    version: number
}

class VersionlogService {
    
    //Henter nyeste versjon av siden
    async getLatestVersion(pageId: number){
        const response = await axios.get<Versionlog>('/pages/' + pageId + '/latest');

        return response.data;
    }

    //Sjekker versjon og sletter den eldste versjonen hvis det er mer enn 10 versjoner
    async checkVersion(pageId: number){
        const response = await axios.get('/pages/' + pageId + '/check');

        return response.data.pageId;
    }

    //Henter spesifikk versjon av en side
    async getVersion(pageId: number, versionNum: number){
        const response = await axios.get<Versionlog>('/pages/' + pageId + '/versionlog/' + versionNum);

        return response.data;
    }

    //Henter alle versjoner av en side
    async getAllPageVersions(pageId: number){
        const response = await axios.get<Versionlog[]>('/pages/' + pageId + '/versionlog');

        return response.data;
    }

    async getAllVersions(){
        try{
            const response = await axios.get<Versionlog[]>('/pages/versions/getversions');

            return response.data;
        } catch(error){console.log(error)}
    }

    //Oppadeter/lager ny side-versjon
    async createVersion(version: Versionlog){
        try{
            await axios.post<{ versionid: number }>('/pages/' + version.pageid + '/newversion', { version });

            return;
        } catch(error) {return error}
    }

    //Sletter en versjon
    async deleteVersion(pageId: number, versionNum: number){
        try{
            await axios.delete('/pages/' + pageId + '/versionlog/' + versionNum);

            return;
        } catch(error){console.log(error)}

    }


    //Sletter versjoner som tilhører page som skal slettes
    async deletePageVersions(pageId: number) {
        const respone = await axios.delete('/pages/' + pageId + '/edit');

        return respone.data;
    }

}

const versionlogService = new VersionlogService();
export default versionlogService;