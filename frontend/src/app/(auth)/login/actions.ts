'use server'

const loginAction = async (initalState: LoginState, formData: FormData): Promise<LoginState> => {
    // TODO: Implement login logic here
    return {
        message: "Login action executed",
        success: true
    }
};

export { loginAction };