"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface pageProps {}

const ResetPasswordPage: FC<pageProps> = ({}) => {
  const router = useRouter();

  const [token, setToken] = useState<String>("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/auth/login");
    }
    setToken(token as string);
  }, [searchParams, router]);

  useEffect(() => {
    if (user.password === "" || user.confirmPassword === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [user.confirmPassword, user.password]);

  const onResetPassword = async () => {
    if (user.password !== user.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/api/auth/reset-password", {
        password: user.password,
        token,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/auth/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Reset Password"}</h1>
      <hr />
      <br />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="text"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password"
      />
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="confirmPassword"
        type="email"
        value={user.confirmPassword}
        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
        placeholder="Confirm password"
      />
      <button
        disabled={buttonDisabled}
        onClick={onResetPassword}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Reset Password
      </button>
      <Link href="/auth/login">Visit login page</Link>
    </div>
  );
};

export default ResetPasswordPage;
