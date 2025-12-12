import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const useLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const onSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // router.push("/dashboard"); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return {
        isLoading,
        showPassword,
        togglePassword,
        onSubmit,
    };
};
