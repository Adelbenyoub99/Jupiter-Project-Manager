import httpRequest from "../../httpRequest";

export const createSignal= async(token,signal)=>{
    try {
        const headers={ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`}
    const signalement = await httpRequest('/signal', 'POST', signal, headers);
    return signalement
    } catch (error) {
        console.error('error while signal creation :', error);
        throw error;
    }
}

export const getUserSignal=async(token)=>{
    try {
        const headers={ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`}
    const signalement = await httpRequest('/signal/user', 'GET', null, headers);
    console.log(signalement)
    return signalement
    } catch (error) {
        console.error('error while signal readding :', error);
        throw error;
    }
}