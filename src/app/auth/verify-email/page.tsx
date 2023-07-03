"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface pageProps {}

const VerifyemailPage: FC<pageProps> = ({}) => {
  const router = useRouter();

  const [token, setToken] = useState<String>("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setToken(token);
      verifyEmail({ token });
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  const verifyEmail = async ({ token }: { token: string }) => {
    try {
      const res = await axios.post("/api/auth/verify-email", { token });
      if (res.data.success) {
        toast.success(res.data.message);
        setVerified(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      setError(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "no token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyemailPage;
