import httpRequest from "../../httpRequest";


export const createDemandeAdh = async (idProjet, token) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
 
      const data = { idProjet: idProjet }; 
 
      const response = await httpRequest('/demande-adhesion', 'POST', data, headers);
      return response;
    } catch (error) {
      console.error('error while creating the demande :', error);
      throw error;
    }
 }
 export const getUserDemandes=async(token)=>{
    try {
        const headers={ 'Authorization': `Bearer ${token}`}
        const demandes = await httpRequest('/demande-adhesion/user', 'GET', null, headers);
        if (demandes !== undefined) {
          return demandes;
      } else {
          return [];
      }
    } catch (error) {
     console.error('error while getting user demande :', error);
      throw error;
    }
 }
 export const annulerDemande=async(idD,token)=>{
    try {
        const headers={ 
            'Authorization': `Bearer ${token}`}
        const demande = await httpRequest(`/demande-adhesion/${idD}/annuler`, 'PUT', null, headers);
        return demande
    } catch (error) {
        console.error('error while canceling user demande :', error);
      throw error;
    }
 }