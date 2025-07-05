import React, { useEffect, useRef } from "react";
import { MdPermMedia } from "react-icons/md";
import { LuBadgeInfo } from "react-icons/lu";
import assets, { messagesDummyData } from "../assets/assets";
import { RxAvatar } from "react-icons/rx";
import { formatTime } from "../lib/utils";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdExit } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import avatarIcon from "/avatar_icon.png";

const ChatContainer = ({ onToggleInfo, onCloseChat }) => {
  const scrollEnd = useRef();
  const navigate = useNavigate();

  const {
    texts,
    setTexts,
    selectedUser,
    setSelectedUsers,
    sendMessage,
    getTexts,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendingMedia = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
    }

    const filereader = new FileReader();
    filereader.onloadend = async () => {
      await sendMessage({ image: filereader.result });
      e.target.value = "";
    };
    filereader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getTexts(selectedUser._id);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (scrollEnd.current && texts) {
      scrollEnd.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [texts]);

  return selectedUser ? (
    <div className="h-full p-2 overflow-y-auto sm:p-4  relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
      <div className=" rounded-full border-2 border-amber-400 p-[0.8px]">
        <img
          src={selectedUser.profilePic || avatarIcon}
          alt=""
          className=" w-10 aspect-[1/1] rounded-full  object-cover"
        />
        </div>
        <p className="text-lg font-semibold flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <div className="flex items-center gap-4 ml-auto">
          <LuBadgeInfo
            onClick={onToggleInfo}
            className=" hidden text-2xl sm:ml-0 sm:block"
          />
          <IoExitOutline
            onClick={onCloseChat}
            className=" sm:hidden text-2xl cursor-pointer"
          />
        </div>
      </div>

      {/** Chat Area **/}
      <div className="flex flex-col bg-[url('/chat-bg2.png')] bg-cover bg-center h-[calc(100%-120px)] overflow-y-scroll px-4 py-6 pb-6">
        {texts.map((message, index) => {
          const isMe = message.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 justify-end mb-4 ${
                isMe ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Message bubble */}
              <div
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {message.image ? (
                  <img
                    src={message.image}
                    alt=""
                    className="max-w-[200px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                ) : (
                  <p
                    className={`max-w-[200px] p-2.5 md:text-sm font-light rounded-xl break-all text-white ${
                      isMe
                        ? "rounded-br-none bg-indigo-500/80"
                        : "rounded-bl-none bg-neutral-700"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
                <p className="text-[8px] font-semibold text-gray-800 mt-1">
                  {formatTime(message.createdAt)}
                </p>
              </div>

              {/* Avatar */}
              <div className=" flex items-center justify-center w-8 h-8">
                {isMe ? (
                  <img
                    src={authUser.profilePic || avatarIcon}
                    alt="user Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedUser.profilePic || avatarIcon}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      <div className="flex justify-between sticky bottom-0 items-center gap-2 z-10">
        <div className=" flex items-center gap-3 rounded-full px-3 bg-[#89b4aa] flex-1">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            className="outline-none text-sm p-4 border-none rounded-lg bg-transparent placeholder-[#565555] flex-1"
            placeholder="Enter your message"
          />
          <input
            onChange={handleSendingMedia}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <MdPermMedia className="cursor-pointer text-xl" />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src="/send.png"
          className="w-[60px] cursor-pointer"
          alt="send button"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 max-md:hidden">
      <IoChatboxEllipsesOutline className="font-bold text-4xl" />
      <p className="txet-lg font-medium">Start chatting</p>
    </div>
  );
};

export default ChatContainer;
