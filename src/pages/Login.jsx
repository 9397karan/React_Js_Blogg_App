import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";

function Login() {
    const {login}=useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        const { data, error } = await login( formData.email, formData.password)
        if (error) {
            alert(error.message)
            return
        }
        if (data) {
            alert("logged")
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error(error);
        }
    };



return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 py-8">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
            <h1 className="text-3xl font-bold text-center text-white mb-8">
                Welcome Back
            </h1>

            <div className="mb-5">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    className="input w-full bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input w-full bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500"
                    required
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                className="btn w-full bg-white text-black hover:bg-gray-200 border-none text-lg font-semibold"
            >
                Login
            </button>
            
                <div className="divider text-gray-500 my-6">OR</div>

                <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="btn w-full bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-5 h-5"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.243 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.165 35.091 26.715 36 24 36c-5.222 0-9.617-3.329-11.283-7.946l-6.522 5.025C9.438 39.556 16.168 44 24 44z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.127 3.282-3.71 5.812-7.084 6.57l6.19 5.238C38.19 36.29 44 30.65 44 24c0-1.341-.138-2.65-.389-3.917z"
                        />
                    </svg>

                    Continue with Google
                </button>

            <p className="text-center text-gray-400 mt-5">
                Don't have an account?{" "}
                <span className="text-white cursor-pointer hover:underline">
                    Register
                </span>
            </p>
        </form>
    </div>
);
}


export default Login;