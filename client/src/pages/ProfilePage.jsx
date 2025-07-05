import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { IoMdExit } from "react-icons/io";

const ProfilePage = () => {
  
  const {authUser, updateProfile} = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();


  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      toast.success("Profile Updated Successfully");
      navigate('/');
      return;
    }

    const reader =new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload=async()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image, fullName:name, bio});
      navigate('/');
    }
    
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
    <IoMdExit className="sm:hidden text-3xl cursor-pointer absolute top-5 right-5 text-gray-800 hover:text-red-500 transition-all duration-300"
      onClick={() => navigate('/')} 
      />
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl border-2 border-green-800 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-xl font-bold">User Profile</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || "/avatar.png"
              }
              alt=""
              className={`w-20 h-20 rounded-full border-2 border-red-400 object-cover`}
            />
            set profile picture
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            className="p-2 border border-greeen-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="About you..."
            className="p-2 border border-greeen-800 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            rows={4}
            required
          ></textarea>
          <button
            type="submit"
            className="py-3 font-bold bg-gradient-to-r from-green-500/40 via-emerald-600/40 to-teal-600/40 hover:from-green-600/50 hover:to-teal-700/50 transition-all duration-300 rounded-lg cursor-pointer "
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
