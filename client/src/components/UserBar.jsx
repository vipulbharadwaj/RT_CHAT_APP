import React, { useContext, useEffect, useState } from 'react'
import { RxAvatar } from "react-icons/rx";
import { imagesDummyData } from '../assets/assets';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import avatarIcon from '../assets/avatar_icon.png';
import toast from 'react-hot-toast';
const UserBar = () => {
  const {selectedUser, texts} = useContext(ChatContext);
  const{onlineUsers} = useContext(AuthContext);
  const[msgImg, setMsgImg] = useState([]);


  useEffect(()=>{
    setMsgImg(texts.filter(msg=>msg.image).map(msg=>msg.image))
  },[texts]);
  return selectedUser && (

    <div className={` bg-green-200/20 w-full relative overflow-y-scroll}`}>
    <div className='pt-16 flex flex-col items-center gap-1 text-xs font-light mx-auto'>
      
      <img src={selectedUser.profilePic||avatarIcon} className='w-20 aspect-[1/1] rounded-full object-cover'/>
      <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
      {onlineUsers.includes(selectedUser._id)&&<p className='w-2 h-2 rounded-full bg-green-500'></p>}
      {selectedUser.fullName}</h1>
      <p className='px-10 font-semibold mx-auto'>{selectedUser.bio}</p>
    </div>
    <hr className='border-[#fffffff50] my-4' />

    <div className='px-5 text-xs'>
      <p>Media</p>
      <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-3 gap-3 opacity-80'>
        {msgImg.map((url, index)=>{
          return(
            <div key={index} onClick={()=>window.open(url)} className='cursor-pointer rounded'>
            <img src={url} alt="" className='h-full rounded-md'/>
            </div>
          )
        })}
      </div>
    </div>
    <button onClick={()=>toast.success('User reported')}  className='absolute bottom-5 left-1/5 text-white border-none text-sm font-light bg-gradient-to-r from-purple-400 to violet-600 py-2 px-20 rounded-full cursor-pointer'>
      Report
    </button>

      
    </div>
  )
}

export default UserBar
