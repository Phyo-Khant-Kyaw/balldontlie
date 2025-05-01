"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username }));
    router.push("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleSubmit}
          username={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </div>
  );
}
