import httpRequest from "../../httpRequest";


export const Login = async (email, motDePasse) => {
  try { 
    const dataToSend = { email, motDePasse };
    //console.log('Sending data:', dataToSend); // Log the data being sent
    const headers = { 'Content-Type': 'application/json' };
    const data = await httpRequest('/user/login', 'POST', dataToSend, headers);

    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    //console.log('Response data:', data); // Log the response data
    localStorage.setItem("Token", data.token);
    localStorage.setItem("Prenom",data.user.prenom)
    localStorage.setItem("TokenExpiration", expirationTime);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const Register = async (userData) => {
  try { 
    const nomUtilisateur= userData.nom+"_"+userData.prenom+Math.floor(Math.random() * 10000);
    const dataToSend = { nomUtilisateur,...userData};
   // console.log('Sending data:', dataToSend); // Log the data being sent
    const headers = { 'Content-Type': 'application/json' };
    const data = await httpRequest('/user/register', 'POST', dataToSend, headers);
    //console.log('Response data:', data); // Log the response data
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("Token", data.token);
    localStorage.setItem("Prenom",data.user.prenom)
    localStorage.setItem("TokenExpiration", expirationTime);
    return data;
  } catch (error) {
    console.error('Register  error:', error);
    throw error;
  }
};
export const Deconnect=async()=>{
  localStorage.removeItem("Token")
  localStorage.removeItem("Prenom");
  localStorage.removeItem("TokenExpiration");
  
}

export const getUserInfo=async(token)=>{
  try {
    const headers={ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`}
      const user = await httpRequest('/user/info','GET',null,headers)
      return user
  } catch (error) {
    console.error('get user  error:', error);
    throw error;
  }
}

export const updateUser = async(token,userData)=>{
  try {
    const headers={ 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`}
      const user = await httpRequest('/user','PUT',userData,headers)
    
      return user
  } catch (error) {
    console.error('update user  error:', error);
    throw error;
    
  }
}
//update user profile picture
export const updateUserIMG = async(token,image)=>{
  try {
    const headers={ 
      'Authorization': `Bearer ${token}`}
      //console.log(userData)
      const user = await httpRequest('/user/img','PUT',image,headers)

      return user
  } catch (error) {
    console.error('update user image  error:', error);
    throw error;
    
  }
}
////delete user account///
export const deleteAccount=async(token)=>{
  try {
    const headers={ 
      'Authorization': `Bearer ${token}`}
      //console.log(userData)
      const response = await httpRequest('/user','DELETE',null,headers)
       return response
  } catch (error) {
    console.error('delete user error:', error);
    throw error;
    
  }
}

export const forgotPassWord=async(email)=>{
  const headers = { 'Content-Type': 'application/json' };
  const data ={"email":email}
  try {
    await httpRequest('/user/resetPSW','POST',data,headers)
    return
  } catch (error) {
    console.error('error sending email:', error);
    throw error;
  } 
}

export const resetPSW=async(email,newPSW)=>{
  const headers = { 'Content-Type': 'application/json' };
  const data ={"email":email,
    "newPassword":newPSW
  }
  try {
    const response =await httpRequest('/user/updatePSW','PUT',data,headers)
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("Token", response.token);
    localStorage.setItem("Prenom",response.user.prenom)
    localStorage.setItem("TokenExpiration", expirationTime);
    return response
  } catch (error) {
    console.error(' reseting passWord:', error);
    throw error;
  }
}