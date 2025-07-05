import React, { useContext } from "react";
import { IoMenu } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { UNSAFE_SingleFetchRedirectSymbol, useNavigate } from "react-router-dom";
import assets, { userDummyData } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useEffect } from "react";
import { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import avatarIcon from '../assets/avatar_icon.png';
import { IoMdExit } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    unseenTexts,
    setUnseenTexts,
  } = useContext(ChatContext);

  const [input, setInput] = useState(null);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  const handleLogout = async () => {
    await logout();
  };
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);
  return (
    <div className="h-full p-5 rounded-r-xl overflow-y-scroll text-black bg-[#89b4aa]">
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/chat-icon.svg" alt="logo" className="max-w-14" />
            <p className="font-bold">VI-Chat</p>
          </div>

          <div className="relative py-2 group">
            <IoMenu className="text-3xl cursor-pointer" 
              onClick={() => setShowMenu((prev) => !prev)}
            />
            { showMenu && <div className="absolute top-full right-0 z-20 w-28 p-4 rounded-md bg-[#7fa39c] border-2 border-[#608b83] text-gray-800 ">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-1 border-1 border-gray-500" />
              <p onClick={handleLogout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
            }
          </div>
        </div>
        <div className="bg-[#608b83] rounded-full flex items-center gap-2 py-2 px-4 mt-4">
          <IoSearch className="text-2xl" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-black font-bold text-xs placeholder-[#89b4aa] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div key={index} >
            <div
              onClick={() => {setSelectedUser(user); setUnseenTexts(prev=>({...prev, [user._id]:0}))}}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded-xl cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id && "bg-[#608b83]" 
              }`}
            >
              <img
                src={user?.profilePic||avatarIcon}
                alt={user?.fullName}
                className="w-[40px] aspect-[1/1] rounded-full object-cover"
              />
              <div className="flex flex-col leading-5">
                <p className="font-medium">{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-blue-500 text-sm">
                    online
                  </span>
                ) : (
                  <span className="text-red-500  text-sm">
                    offline
                  </span>
                )}
              </div>
              {unseenTexts[user._id] >=1 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-400/50">
                  {index}
                </p>
              )}
            </div>
            <hr className=" my-1 border-1 border-[#608b83] " />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
