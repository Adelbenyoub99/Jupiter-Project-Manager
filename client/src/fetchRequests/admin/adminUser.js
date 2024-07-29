import httpRequest from "../../httpRequest";

export const getAllUsers=async(token)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
         const users=await httpRequest('/admin/users','GET',null,headers)
         console.log(users)
         return users
    } catch (error) {
        console.error('error while getting all users:', error);
        throw error;
    }
   
}
export const createUser=async(token,userData)=>{
     const headers={ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`} 
    const nom='JUPITER'
    const prenom='User'
    const nomUtilisateur = `${nom}_${prenom}_${Math.floor(Math.random() * 10000)}`;
  const data = {'nom':nom,
                'prenom':prenom,
                'nomUtilisateur':nomUtilisateur,
                'email':userData.email,
                'motDePasse':userData.motDePasse}
    try {
        const user = await httpRequest('/admin/creatUser','POST',data,headers)
       return user
    } catch (error) {
        console.error('error while creating user:', error);
        throw error;
    }
}
export const searchUser=async(token,term)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const users=await httpRequest(`/admin/searchUsers?term=${encodeURIComponent(term)}`,'GET',null,headers)
        return users
    } catch (error) {
        console.error('error while searching user:', error);
        throw error;
    }
}

export const reintializePSW=async(token,idUser)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const users=await httpRequest(`/admin/updatePSW/${idUser}`,'PUT',null,headers)
        return users
    } catch (error) {
        console.error('error while password reinitialisation:', error);
        throw error;
    }
}
export const activateAccount=async(token,idUser)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const users=await httpRequest(`/admin/activeUser/${idUser}`,'PUT',null,headers)
        return users
    } catch (error) {
        console.error('error while activating account:', error);
        throw error;
    }
}
export const disactivateAccount=async(token,idUser)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const users=await httpRequest(`/admin/inactiveUser/${idUser}`,'PUT',null,headers)
        return users
    } catch (error) {
        console.error('error while disactivating account:', error);
        throw error;
    }
}
export const getAllParticipation=async(token)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const participations=await httpRequest('/admin/participations','GET',null,headers)
        return participations
    } catch (error) {
        console.error('error while getting all participations :', error);
        throw error;
    }
}