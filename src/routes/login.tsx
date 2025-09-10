import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import droneImg from "../assets/drone.png";

export default function LoginCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [navigate, auth]);

  if (auth.isLoading) {
    return <div>Processando login...</div>;
  }
  if (auth.error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="mb-4 text-red-600">Erro: {auth.error.message}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => auth.signinRedirect()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!auth.isAuthenticated && !auth.isLoading) {
    auth.signinRedirect();
  }

  // 🔹 Loader com imagem animada
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src={droneImg} // 👉 coloque sua imagem em public/loader.png
        alt="Redirecionando..."
        className="w-20 h-20 animate-bounce"
      />
    </div>
  );
}
