import httpRequest from "../../httpRequest";

export const getAllProjects=async(token)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const projects=await httpRequest('/admin/projets','GET',null,headers)
        return projects
    } catch (error) {
        console.error('error while getting all projects:', error);
        throw error;
    }
}
export const getProjectUsers=async(token,projectId)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const projectUsers=await httpRequest(`/admin/projectMembers/${projectId}`,'GET',null,headers)
        return projectUsers
    } catch (error) {
        console.error('error while getting all project users:', error);
        throw error;
    }
}
export const deleteProject = async (token, projectId) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const response = await httpRequest(`/admin/suprimerProjet/${projectId}`, 'DELETE', null, headers);
        return response;  
    } catch (error) {
        console.error('Error while deleting a project:', error);
        throw error;
    }
}
export const searchProject=async(token,search)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const projets =await httpRequest(`/admin/projets/search?search=${encodeURIComponent(search)}`,'GET', null,headers)
        return projets
    } catch (error) {
        console.error('Error while getting search results:', error);
        throw error;
    } 
}