import httpRequest from "../../httpRequest";

export const getProjetsPublics=async()=>{
    try{
    const headers = { 'Content-Type': 'application/json' };
     const projets = await httpRequest('/projet/publics','GET',null,headers)
    return projets   
    }catch(error){
    console.error('getting public projects  error:', error);
    throw(error)
   
    
    }
    
}
export const recherchProjet=async(searchTerm)=>{
 try {
    const headers = { 'Content-Type': 'application/json' };
    console.log("search term"+searchTerm)
    const resultProjects = await httpRequest(`/projet/publics/recherche?search=${encodeURIComponent(searchTerm)}`,'GET',null,headers)
    return resultProjects
 } catch (error) {
    console.error('getting searched projects  error:', error);
    throw(error)
 }

}
export const getUserPublicProject=async(token)=>{
   const headers={ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`}
      try {
         const projetPUser=await httpRequest('/projet/userPublicProject','GET',null,headers)
          console.log(projetPUser)
         return projetPUser;
        
      } catch (error) {
         console.error('getting user public projects  error:', error);
         throw(error)
      }
   
}
