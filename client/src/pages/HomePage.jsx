import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import UserBar from "../components/UserBar";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

import { useMediaQuery } from "react-responsive";

const HomePage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  const isMobile = useMediaQuery({ maxWidth: 639 });

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      {/* Desktop View */}
      {!isMobile && (
        <div
          className={`backdrop-blur-xl border-2 border-green-800 rounded-2xl overflow-hidden h-[100%] grid ${
            showInfo ? "grid-cols-[1fr_2fr_1fr]" : "grid-cols-[1fr_1.8fr]"
          }`}
        >
          <Sidebar />
          <ChatContainer onToggleInfo={() => setShowInfo((prev) => !prev)} />
          {showInfo && <UserBar />}
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="h-full w-full overflow-hidden">
          {!selectedUser ? (
            <Sidebar />
          ) : (
            <ChatContainer
              onToggleInfo={() => setShowInfo((prev) => !prev)}
              onCloseChat={() => setSelectedUser(null)}
            />
          )}
          {showInfo && <UserBar />}
        </div>
      )}
    </div>
  );
};

export default HomePage;
