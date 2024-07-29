
import httpRequest from "../../httpRequest";
 export const getUserProjects = async(token)=>{
    const headers={ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
        try {
            const projects= await httpRequest('/projet/userProject','GET',null,headers)
           // console.log(projects)
            return projects;
        } catch (error) {
            console.error('getting user projects  error:', error);
         throw(error)
        }
 }
 export const createProject=async(token , projet)=>{
    const headers={ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    const data = projet
    console.log("projet a creer : "+data)
    try {
        const projet=await httpRequest('/projet','POST',data,headers)
        return projet;
    } catch (error) {
        console.error('creatting project  error:', error);
         throw(error)
    }

 }