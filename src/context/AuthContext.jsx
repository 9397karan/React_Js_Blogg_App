import { Children, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [session,setSession]=useState(null)
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    const register=async(name,email,password)=>{
        const {data,error}=await supabase.auth.signUp({
            email,password,
            options:{
                data:{
                    full_name
                }
            }
        })
        return {data,error}
    }

    const login=async(email,password)=>{
        const {data,error}=await supabase.auth.signInWithPassword({
            email,password
        })
        return {data,error}
    }

    const logout=async()=>{
        const {error}=await supabase.auth.signOut()
        return {error}
    }
const saveProfile = async (user) => {
  if (!user) return;

  const { error } = await supabase
    .from("profile")
    .upsert({
      id: user.id,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "",
      email: user.email,
      avatar: user.user_metadata?.avatar_url || "",
    });

  if (error) {
    console.log("Profile Error:", error);
  }
};
     useEffect(() => {
  
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
    await saveProfile(session.user);
  }
      setLoading(false);
    };

    getSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
console.log("user:",user?.user_metadata?.avatar_url)
    return (
        <AuthContext.Provider value={{register,login,logout,session,user,loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
  return useContext(AuthContext);
};