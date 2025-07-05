import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { PrivyProvider } from "@privy-io/react-auth";
import Home from "./pages/Home";
import Create from "./pages/Create";

const App = () => (
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      loginMethods: ["wallet"],
      appearance: {
        theme: "light",
        accentColor: "#00897B"
      },
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      }
    }}
  >
    <Router>
      <nav className="p-4 flex justify-between bg-primary text-white">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  </PrivyProvider>
);

export default App;
