import httpRequest from "../../httpRequest";

export const getNotificatoin=async(token)=>{
    const headers={ 
        'Authorization': `Bearer ${token}`}
        try {
             const notification=await httpRequest('/notifications/user','GET',null,headers)
             //console.log(notification)
             return notification
        } catch (error) {
            console.error('error while getting notifications :', error);
        throw error;
        }
   
}
export const deletNotification=async(token,idNotif)=>{
    const headers={ 
        'Authorization': `Bearer ${token}`}

    try {
        const response = await httpRequest(`/notifications/${idNotif}`,'DELETE',null,headers)
        return response
    } catch (error) {
        console.error('delete notification error:', error);
    throw error;
    }
}