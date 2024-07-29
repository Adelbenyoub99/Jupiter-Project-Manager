import httpRequest from "../httpRequest";


export const joinProject=async(token,idProjet)=>{
    try {
        const headers = {
            
            'Authorization': `Bearer ${token}`
          };
          console.log(idProjet)
          const data = await httpRequest(`/participer/share/${idProjet}`,'POST',null,headers)
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

    export const getProjectByUrl=async(projectUrl)=>{
 
        try {
             const token= localStorage.getItem('Token')
            const headers = {
                'Authorization': `Bearer ${token}`
              };
              console.log(projectUrl)
            const response = await httpRequest(`/projet/sharedUrl/${projectUrl}`, 'GET', null, headers);
           console.log(response)
            return response;
        } catch (error) {
            console.error('error while getting project :', error);
            throw error;
        }
    }