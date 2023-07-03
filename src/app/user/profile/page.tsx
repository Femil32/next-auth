"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

interface pageProps {}

const Profilepage: FC<pageProps> = ({}) => {
  const router = useRouter();
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    email: string;
  }>({
    _id: "",
    username: "",
    email: "",
  });

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };
  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {!user ? (
          "Nothing"
        ) : (
          <Link href={`/user/profile/${user._id}`}>
            <span>{user.username}</span>
          </Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        GetUser Details
      </button>
    </div>
  );
};

export default Profilepage;
