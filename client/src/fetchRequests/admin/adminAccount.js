import httpRequest from "../../httpRequest";

export const LoginAdmin = async (nomAdmin, motDePasse) => {
  try { 
    const dataToSend = { nomAdmin, motDePasse };
    //console.log('Sending data:', dataToSend); // Log the data being sent
    const headers = { 'Content-Type': 'application/json' };
    const data = await httpRequest('/admin/login', 'POST', dataToSend, headers);
    //console.log('Response data:', data); // Log the response data
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    //console.log('Response data:', data); // Log the response data
    localStorage.setItem("Token", data.token);
    localStorage.setItem("TokenExpiration", expirationTime);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
export const DeconnectAdmin=async()=>{
  localStorage.removeItem("Token");
  localStorage.removeItem("Prenom");
  localStorage.removeItem("TokenExpiration");
 
}

export const createAdmin=async(token,nom,psw)=>{
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  const data={"nomAdmin":nom, "motDePasse":psw}
  try {
    const admin= await httpRequest('/admin/create','POST',data,headers)
    return admin
  } catch (error) {
    console.error('creating admin:', error);
    throw error;
  }
  
}
export const getAllAdmins=async(token)=>{
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    const Admins=await httpRequest('/admin/admins','GET',null,headers)
    return Admins
  } catch (error) {
    console.error('getting admins:', error);
    throw error;
  }
}
export const updateAdmin = async (token, id, data) => {
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  let updateData = { nomAdmin: data.nomAdmin };
  if (data.motDePasse) {
    updateData.motDePasse = data.motDePasse;
  }

  try {
    const admin = await httpRequest(`/admin/${id}`, 'PUT', updateData, headers);
    return admin;
  } catch (error) {
    console.error('updating admin:', error);
    throw error;
  }
};
export const deleteAdmin=async(token,id)=>{
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    const response = await httpRequest(`/admin/${id}`,'DELETE',null,headers)
    return response
  } catch (error) {
    console.error('deletting admin:', error);
    throw error;
  }
}
export const getIsSuperAdmin=async(token)=>{
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    const response = await httpRequest('/admin/isSuper','GET',null,headers)
    //console.log(response)
    return response
  } catch (error) {
    console.error('is super admin:', error);
    throw error;
  }
}

