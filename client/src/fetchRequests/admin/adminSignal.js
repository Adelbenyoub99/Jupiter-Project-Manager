import httpRequest from "../../httpRequest";

export const getAllSignals=async(token)=>{
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
        const signals=await httpRequest('/admin/signals','GET',null,headers)
        return signals
    } catch (error) {
        console.error('error while getting all signals:', error);
        throw error;
    }
}
export const answerSignal=async(token,answer,idSignal)=>{
    const headers={ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    const data ={"reponse":answer}
    try {
        const signal = await httpRequest(`/admin/repondreAuSignal/${idSignal}`,'PUT',data,headers)
        return signal
    } catch (error) {
        console.error('error while answering signal:', error);
        throw error;
    }
}

export const deleteSignal=async(token,idSignal)=>{
    const headers={  'Authorization': `Bearer ${token}`}
 
    try {
        const response = await httpRequest(`/admin/deleteSignal/${idSignal}`,'DELETE',null,headers)
        return response
    } catch (error) {
        console.error('error while deleting signal:', error);
        throw error;
    }
}