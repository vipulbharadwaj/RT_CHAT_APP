import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import { useEffect } from "react";

import toast from "react-hot-toast";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [texts, setTexts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenTexts, setUnseenTexts] = useState(null);
  const { socket } = useContext(AuthContext);


  const getUsers = async () => {
    try {
      const { data } = await axios.get("api/messages/user");

      if (data.success) {
        setUsers(data.users);
        setUnseenTexts(data.unseenTexts);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      //toast.error(error.message);
    }
  };

  const getTexts = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setTexts(data.texts);
      }
    } catch (error) {
      console.log(error.message);
      //toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setTexts((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      error.response?.data?.message || error.message || "Something went wrong";
    }
  };

  const subsToMessage = () => {
    if (!socket) return;
    //console.log("selected user", selectedUser);
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setTexts((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenTexts((prevUnseenMessages) => {
          const currentCount = prevUnseenMessages[newMessage.senderId] || 0;
          return {
            ...prevUnseenMessages,
            [newMessage.senderId]: currentCount + 1,
          };
        });
      }
    });
  };
  const unSubsToMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subsToMessage();
    return () => unSubsToMessages();
  }, [socket, selectedUser]);

  const value = {
    users,
    texts,
    unseenTexts,
    selectedUser,
    setTexts,
    setSelectedUser,
    setUnseenTexts,
    getUsers,
    getTexts,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
