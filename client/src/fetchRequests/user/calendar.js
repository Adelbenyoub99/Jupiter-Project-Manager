import httpRequest from "../../httpRequest";
export const getUserTask=async(token)=>{
    try {
        const headers={ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`}
    const tasks= await httpRequest('/tache/userTasks/all','GET',null,headers)
    console.log(tasks)
    return tasks
    } catch (error) {
        console.error('error while user all tasks :', error);
        throw error;
    }
}