const API = {
    domain: "http://localhost/github/api-auth-reactjs-php/public"
}

const getAuthToken = () => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? authToken : null;
}

// Envia requisições para a API
const sendRequestToAPI = async (method, endpoint, data = null) => {

    try {
        const response = await fetch(`${API.domain}/${endpoint}`, {
            method:    method,
            body:      data ? JSON.stringify({ data: data }) : null,
            headers: { 
                'Authorization': `Bearer ${getAuthToken()}`, // Inclua o token JWT aqui
                'Content-Type':  'application/json' 
            }
        });
    
        return response.json() ?? false;

    } catch (error) {
        return {data: { status: "error", message: "não foi possível conectar com o servidor.", typeError: error }}
    }
 
}


// Verifica se o usuário está logado com base no seu authToken
const isLogged = async () => {

    const authToken = getAuthToken();

    if (!authToken) {
        return false;
    }
    
    const response = await sendRequestToAPI('GET', 'auth/check-login');

    return response.data.isLogged ?? false;
}  

const getUserLoggedData = async () => {

    const authToken = getAuthToken();

    if (!authToken) {
        return false;
    }

    const response = await sendRequestToAPI('GET', 'user');

    return response.data.user;
}


export default { sendRequestToAPI, isLogged, getUserLoggedData, getAuthToken };