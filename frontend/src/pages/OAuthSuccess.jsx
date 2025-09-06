import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("token", token);
       localStorage.setItem("role", role);
      try {

        if (role === "owner") {
          navigate("/owner-dashboard", { replace: true });
        } else if (role === "builder") {
          navigate("/builder-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true }); 
        }
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}
