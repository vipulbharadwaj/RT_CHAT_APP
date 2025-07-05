import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const backend = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("❌ Auth check error:", error);
      //toast.error(error.message || "Authentication failed. Please log in again." );
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    //console.log("connect Socket: ",userData)

    const newSocket = io(backend, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        //console.log("UserData on login:", data.userData);
        setAuthUser(data.userData);
      //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        connectSocket(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully!");
    socket.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.sucess) {
        setAuthUser(data.user);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    checkAuth,
    login,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
