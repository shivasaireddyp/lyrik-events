import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      api
        .post("/api/auth/verify-email", { token })
        .then(() => {
          navigate("/verified-success");
        })
        .catch((err) => {
          console.error("Verification failed:", err.response?.data || err.message);
          alert("Verification failed or link expired");
        });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-white text-lg">
      Verifying your email...
    </div>
  );
};

export default VerifyEmailPage;
