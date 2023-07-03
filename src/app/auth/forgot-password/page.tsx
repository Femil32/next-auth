"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface pageProps {}

const ForgotPasswordPage: FC<pageProps> = ({}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [user, setUser] = useState({
    email: "",
  });

  useEffect(() => {
    if (user.email === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [user.email]);

  const onSubmit = async () => {
    try {
      const res = await axios.post("/api/auth/forgot-password", {
        email: user.email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/auth/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Forgot Password"}</h1>
      <hr />
      <br />
      <label htmlFor="username">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
        required
      />

      <button
        disabled={buttonDisabled}
        onClick={onSubmit}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Send Email
      </button>
      <Link href="/auth/login">Visit login page</Link>
    </div>
  );
};

export default ForgotPasswordPage;
