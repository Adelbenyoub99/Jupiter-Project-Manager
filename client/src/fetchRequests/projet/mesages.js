import httpRequest from "../../httpRequest";
export const getMessages=async(token,idProjet)=>{
    try {
        const headers = { 'Authorization': `Bearer ${token}`};
        const messages = await httpRequest(`/message/project/${idProjet}`,'GET',null,headers)
       return messages    
    } catch (error) {
        console.error('getting messages  error:', error);
        throw(error)
    }
}

export const getUserProjectMsg=async(token,idProjet)=>{
    try {
        const headers = { 'Authorization': `Bearer ${token}`};
        const messages = await httpRequest(`/message/user/${idProjet}`,'GET',null,headers)
       return messages    
    } catch (error) {
        console.error('getting messages  error:', error);
        throw(error)
    }
}
export const createMessage=async(token,idProjet,contenu)=>{
    try {
        const headers={ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`}
          const data = {"contenuMsg":contenu}  
          const message = httpRequest(`/message/${idProjet}`,'POST',data,headers)
          return message
    } catch (error) {
        console.error('creating  messages  error:', error);
        throw(error)
    }
}