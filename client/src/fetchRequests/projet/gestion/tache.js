import httpRequest from "../../../httpRequest";
export const updateStatut=async(token,idTache,etat)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
          const data = {"statutTache":etat}
        //  console.log(data)
          const tache = await httpRequest(`/tache/statut/${idTache}`,'PATCH',data,headers)
          return tache
    } catch (error) {
        console.error('error while updating etat tache :', error);
        throw error;
    }
}

export const createAssignation=async(token,idProjet,idTache,idMembre)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
          const data = {"idUtilisateur":idMembre, "idTache":idTache}
         
     const Tache = await httpRequest(`/assigner/${idProjet}`,'POST',data,headers)
   // console.log(Tache)
     return Tache
    } catch (error) {
        console.error('error while creating assigniation :', error);
        throw error;
    }
}
export const createTask =async(token,idProjet,tacheData)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
       const tache= await httpRequest(`/tache/${idProjet}`,'POST',tacheData,headers)
       return tache    
    } catch (error) {
        console.error('error while creating the task :', error);
        throw error;
    }
}

export const getProjectTask=async(token,idProjet)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };

          const data= await httpRequest(`/tache/projet/${idProjet}`,'GET',null,headers)
          //console.log(data)
          return data ;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`No tasks found for project ID ${idProjet}. Returning empty array.`);
            return [];
          } else {
            console.error('error while getting the project tasks :', error);
            throw error;
          }
    }
}

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


export const updateTask =async(token,idProjet,idTache,data)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
       const tache= await httpRequest(`/tache/${idProjet}/${idTache}`,'PUT',data,headers)
       return tache    
    } catch (error) {
        console.error('error while updating the task :', error);
        throw error;
    }
}
export const deleteTache = async (token, idProjet, idTache) => {
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        await httpRequest(`/tache/${idProjet}/${idTache}`, 'DELETE', null, headers);
       
    } catch (error) {
        console.error('Error while deleting the task:', error);
        throw error;
    }
};

export const deleteAssignation = async(token,idProjet,idUtilisateur,idTache)=>{
    try {
        const headers = {
            
            'Authorization': `Bearer ${token}`
          };
          
          const tache = await httpRequest(`/assigner/${idProjet}/${idUtilisateur}/${idTache}`,'DELETE',null,headers)
        // console.log(tache)
          return tache
    } catch (error) {
        console.error('error while deleting assignation :', error);
        throw error;
    }
}