import httpRequest from "../../../httpRequest";
export const getProjectUrl=async(token,idProjet)=>{

    try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await httpRequest(`/projet/${idProjet}/url`, 'GET', null, headers);
       
        return response.URL;
    
      } catch (error) {
        console.error('error while getting project url :', error);
        throw error;
      }

}

export const getProjectByUrl=async(projectUrl)=>{
 
    try {
         const token= localStorage.getItem('Token')
        const headers = {
            'Authorization': `Bearer ${token}`
          };
         // console.log(projectUrl)
        const response = await httpRequest(`/projet/url/${projectUrl}`, 'GET', null, headers);
       //console.log(response)
        return response;
    } catch (error) {
        console.error('error while getting project :', error);
        throw error;
    }
}
export const getProjectById=async(token,idProjet)=>{
 
  try {
      const headers = {
          'Authorization': `Bearer ${token}`
        };
        //console.log(url)
      const response = await httpRequest(`/projet/infoProject/${idProjet}`, 'GET', null, headers);
    //console.log(response)
      return response;
  } catch (error) {
      console.error('error while getting project :', error);
      throw error;
  }
}
export const updateProjet=async(token,idProjet,projetData)=>{
  const headers={ 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`}
      const data = projetData
     // console.log("projet a modifier : "+idProjet)
try {
    const projet=await httpRequest(`/projet/${idProjet}`,'PUT',data,headers)
    return projet;
} catch (error) {
    console.error('updating project  error:', error);
     throw(error)
}
}

export const deleteProject=async(token,idProjet)=>{
  try {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    await httpRequest(`/projet/${idProjet}`, 'DELETE', null, headers);
   
} catch (error) {
    console.error('Error while deleting the task:', error);
    throw error;
}
}
export const quitterProjet=async(token,idProjet)=>{
  try {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    await httpRequest(`/participer/quitter/${idProjet}`, 'DELETE', null, headers);
   
} catch (error) {
    console.error('Error while deleting the task:', error);
    throw error;
}
}