const httpRequest = async (route, method, data, headers) => {
  const options = {
    method,
    headers,
  };

  // Si 'data' est un objet FormData, ne le convertissez pas en JSON
  if (data instanceof FormData) {
    options.body = data;
  } else if (method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data);
  }

  const url = 'http://localhost:5000' + route;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw { status: response.status, statusText: response.statusText, errorData };
    }
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default httpRequest;
