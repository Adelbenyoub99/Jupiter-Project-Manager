import httpRequest from "../../../httpRequest";

export const uploadFile = async (token, idProjet, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await httpRequest(`/files/${idProjet}/upload`, 'POST', formData, headers);
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getAllFiles = async (token, idProjet) => {
    const headers = {
        'Authorization': `Bearer ${token}`
      };
  try {
    const response = await httpRequest(`/files/${idProjet}/all`, 'GET', null, headers);
   
    return response || []
  } catch (error) {
    console.error('Error getting all files:', error);
    throw error;
  }
};

export const getFiles = async (token, idProjet, type) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await httpRequest(`/files/type/${idProjet}/${type}`, 'GET', null, headers);
    return response;
  } catch (error) {
    console.error(`Error getting ${type} files:`, error);
    throw error;
  }
};

export const searchFile = async (token, idProjet, term) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const queryParams = {
    term: term,
  };

  const queryString = new URLSearchParams(queryParams).toString();

  try {
    const response = await httpRequest(`/files/search/${idProjet}?${queryString}`, 'GET', null, headers);
    return response;
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
};

export const deleteFile = async (token, idProjet, fileId) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await httpRequest(`/files/${idProjet}/${encodeURIComponent(fileId)}`, 'DELETE', null, headers);
    return response;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const renameFile = async (token, idProjet, fileId, nomFile) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = {
    newName: nomFile,
  };

  try {
    const response = await httpRequest(`/files/${idProjet}/${encodeURIComponent(fileId)}`, 'PUT', body, headers);
    return response;
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
};
export const downloadFile= async(url , fileName)=>{
  fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
       
      });
}
