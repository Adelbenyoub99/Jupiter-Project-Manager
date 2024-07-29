import httpRequest from "../httpRequest";
export const getRole = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }
      const headers = { 'Authorization': 'Bearer ' + token };
      const data = await httpRequest('/getRole', 'GET', null, headers);
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('error while getting user role:', error);
      throw error;
    }
  };
  