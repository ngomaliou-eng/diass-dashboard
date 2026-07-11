import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./Dashboard";
import { login } from "./api";

export default function App() {
  const [token, setToken] = useState(null);

  const handleLogin = async (identifiant, motDePasse) => {
    const t = await login(identifiant, motDePasse);
    setToken(t);
  };

  if (!token) return <Login onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={() => setToken(null)} />;
}