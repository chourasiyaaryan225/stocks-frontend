"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./button";
import useApi from "../hooks/useApi";
import Alert from "../components/alert";
const Form = () => {
  const router = useRouter();
  const {loading,error,request} = useApi();
  const [alert,setAlert] = useState(null);
  const [type, setType] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  useEffect(() => {
    if (error) {
      setAlert({
        type: "error",
        message: error?.message || "Something went wrong",
      });
    }
  }, [error]);    
  const toggleType = () => {
    setType(type === "login" ? "signup" : "login");

    setEmail("");
    setPassword("");
    setUserName("");

    setErrors({
      email: "",
      password: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(type)
    const newErrors = {
      email: "",
      password: "",
    };
    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!passwordRegex.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase & number";
    }
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) {
      return;
    }
    if(type === "login"){
      const response = await request({method:"POST",url:"/auth/login",data:{email,password}})
      if(error)
        setAlert({type:error?.status,message:error?.message});
      if(response){
        localStorage.setItem("token",response?.token);
        localStorage.setItem("user",JSON.stringify(response?.user));
        router.push('/dashboard')
      }
    }else{
      const response = await request({method:"POST",url:"/auth/signup",data:{email,password,name:userName}})
      if(error)
        setAlert({type:error?.status,message:error?.message});
      if(response){
        localStorage.setItem("token",response?.token);
        localStorage.setItem("user",JSON.stringify(response?.user));
        router.push('/dashboard')
      }
    }
  };
  
  return (
    <div className="bg-[#003049] min-h-screen flex flex-col justify-center items-center px-4">
      <div className="absolute top-0 w-xl m-2">
      {alert && <Alert type={alert?.type} message={alert?.message} onClose={()=>setAlert(null)}/>}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg text-black"
      >
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#f77f00]">
            {type === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p className="text-gray-600 mt-2">
            {type === "login"
              ? "Login to continue"
              : "Signup to continue"}
          </p>
        </div>

        {/* Username */}
        {type === "signup" && (
          <div className="mb-4">
            <label className="font-semibold">
              Username
            </label>

            <input
              type="text"
              value={userName}
              onChange={(e) =>
                setUserName(e.target.value)
              }
              placeholder="Enter username"
              className="border border-gray-300 rounded-lg p-2 w-full mt-2 outline-none"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="font-semibold">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter email"
            className="border border-gray-300 rounded-lg p-2 w-full mt-2 outline-none"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="font-semibold">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            className="border border-gray-300 rounded-lg p-2 w-full mt-2 outline-none"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <Button
          disabled={loading}
          label={
            type === "login"
              ? "Sign In"
              : "Sign Up"
          }
          variant="secondary"
          buttonStyles="w-full mt-4"
        />

        {/* Toggle */}
        <p className="text-center mt-5">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={toggleType}
            className="text-blue-500 ml-2 font-semibold"
          >
            {type === "login"
              ? "Sign Up"
              : "Sign In"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Form;