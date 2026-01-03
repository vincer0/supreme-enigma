import axios from "./axios";

// TODO: remove unknowns by validating with zod
export const attemptLogin = async (email: string|unknown, password: string|unknown) => {
    try {
        const response = await axios.post('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        return response;
    } catch (error) {
        console.error("Login attempt failed:", error);
        return false;
    }
};