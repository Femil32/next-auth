"use client";
import react, { FC, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface pageProps {}

const LoginPage: FC<pageProps> = ({}) => {
  const router = useRouter();
  const [user, setUser] = react.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = react.useState(false);
  const [buttonDisabled, setButtonDisabled] = react.useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, setButtonDisabled]);

  const onLogin = async () => {
    setLoading(true);
    setButtonDisabled(true);
    try {
      const res = await axios.post("/api/auth/login", user);
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/profile");
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
    setLoading(false);
    setButtonDisabled(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />

      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button
        disabled={buttonDisabled}
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Login
      </button>
      <Link href="/signup">Visit Signup page</Link>
    </div>
  );
};

export default LoginPage;
