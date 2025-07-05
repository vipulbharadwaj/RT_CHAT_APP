import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const { authUser, loading } = useContext(AuthContext);


  return (
    <div className="bg-[url('/bg-image2.svg')] bg-cover min-h-screen">
      <Toaster />

      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <div>Loading...</div>
            ) : authUser ? (
              <HomePage />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <LoginPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
