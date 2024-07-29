import httpRequest from "../../../httpRequest";
export const getProjectMembres = async(idProjet)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
          };

          const Members= await httpRequest(`/projet/${idProjet}/members`,'GET',null,headers)
          return Members
    } catch (error) {
        console.error('error while getting the project members :', error);
        throw error;
    }
}
export const getMembres=async(token,idProjet)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };

          const data= await httpRequest(`/participer/${idProjet}`,'GET',null,headers)
          //console.log(data.membres)
          return data.membres
    } catch (error) {
        console.error('error while getting the project members :', error);
        throw error;
    }
}
export const searchUser=async(token,term)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
          const users= await httpRequest(`/user/searchUser?term=${encodeURIComponent(term)}`,'GET',null,headers)
          return users
    } catch (error) {
        console.error('error while getting the searched user :', error);
        throw error;
    }
}
export const updateToCol=async(token,idProjet,idUser)=>{
    try {
        const headers = {
           
            'Authorization': `Bearer ${token}`
          };
          const participation = await httpRequest(`/participer/updateToCol/${idProjet}/${idUser}`,'PUT',null,headers)
          return participation
    } catch (error) {
        console.error('error while updating to collaborateur :', error);
        throw error;
    }
}
export const updateToAdj=async(token,idProjet,idUser)=>{
    try {
        const headers = {
        
            'Authorization': `Bearer ${token}`
          };
          console.log(idUser)
          const participation = await httpRequest(`/participer/updateToAd/${idProjet}/${idUser}`,'PUT',null,headers)
          return participation
    } catch (error) {
        console.error('error while updating to adjoint :', error);
        throw error;
    }
}
export const deleteMembre=async(token,idProjet,idPar)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
          await httpRequest(`/participer/membre/${idProjet}/${idPar}`,'DELETE',null,headers)
          return null
    } catch (error) {
        console.error('error while deleting this memebre from the project:', error);
        throw error;
    }
}
export const addUserToProject=async(token,idProjet,idUtilisateur)=>{
try {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log(idProjet)
      const user ={"idUtilisateur":idUtilisateur}
      const data = await httpRequest(`/participer/addMembre/${idProjet}`,'POST',user,headers)
      if (Array.isArray(data) && data.length === 0) {
        throw new Error('L\'utilisateur est déjà membre de ce projet.');
      }
  
      return data;
} catch (error) {
    if (error.response && error.response.status === 400) {
        console.error('Error adding user to project:', error.response.data.error);
         alert("L'utilisateur est déjà membre de ce projet.");
         return []
      } else {
        console.error('Error adding user to project:', error);
      }
      throw error;
}
}