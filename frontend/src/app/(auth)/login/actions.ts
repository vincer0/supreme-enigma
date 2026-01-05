'use server'
import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

const loginAction = async (initialState: LoginState, formData: FormData): Promise<LoginState> => {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: true,
            redirectTo: "/dashboard",
        });
        
        return { message: "", success: true };
    } catch (error) {        
        if (error instanceof CredentialsSignin) {
            return {
                message: "Invalid email or password.",
                success: false,
            };
        }
        
        throw error;
    }
};

export { loginAction };