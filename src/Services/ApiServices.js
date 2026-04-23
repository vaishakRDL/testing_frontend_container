import axios from "axios";
import { GET, POST, PUT } from '../Actions/Type';

export const SET_API = async (path, method, payload, headers) => {
    const { USER_TOKEN, ID } = headers;
    console.log("API SERVICES HEADERS", headers);

    try {
        // Define a common set of headers for both GET and POST requests
        const commonHeaders = {
            "Authorization": "Bearer " + USER_TOKEN,
            "id": ID
        };

        switch (method) {
            case POST:
                try {
                    const response = await axios.post(path, payload, { headers: commonHeaders });
                    return response.data;
                } catch (error) {
                    // Handle errors for POST requests
                    console.log('POST request error', error);
                    throw error; // Re-throw the error for the caller to handle
                }
            case GET:
                try {
                    const response = await axios.get(path, { headers: commonHeaders });
                    return response.data;
                } catch (error) {
                    // Handle errors for GET requests
                    console.log('GET request error', error);
                    throw error; // Re-throw the error for the caller to handle
                }
            default:
                return; // Return undefined for unsupported methods
        }
    } catch (error) {
        // Handle any unexpected errors, such as invalid headers or network issues
        console.log('Unexpected error', error);
        throw error; // Re-throw the error for the caller to handle
    }
};
