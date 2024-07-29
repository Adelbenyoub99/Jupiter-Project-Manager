import httpRequest from "../../../httpRequest";

export const getProjectDemandes=async(token,idProjet)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
          const demandes = await httpRequest(`/demande-adhesion/projet/${idProjet}`,'GET',null,headers )
          //console.log(demandes)
          return demandes
    } catch (error) {
        console.error('error while getting project demandes :', error);
        throw error;
    }
}
export const getProjectDemandesTraités=async(token,idProjet)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
          const demandes = await httpRequest(`/demande-adhesion/projet/${idProjet}/accepteRefuse`,'GET',null,headers )
         // console.log(demandes)
          return demandes
    } catch (error) {
        console.error('error while getting project demandes :', error);
        throw error;
    }
}

export const accepterDemande=async(token,idProjet,idDemande)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
          const demande = await httpRequest(`/demande-adhesion/${idProjet}/${idDemande}/accepter`,'PUT',null,headers)
          return demande
    } catch (error) {
        console.error('error while accepetting project demandes :', error);
        throw error;
    }
}
export const refuserDemande=async(token,idProjet,idDemande)=>{
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
          const demande = await httpRequest(`/demande-adhesion/${idProjet}/${idDemande}/refuser`,'PUT',null,headers)
          return demande
    } catch (error) {
        console.error('error while accepetting project demandes :', error);
        throw error;
    }
}