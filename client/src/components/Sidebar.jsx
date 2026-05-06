import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import {
  Search,
  Trash2,
  Image,
  DiamondIcon,
  DiamondPlusIcon,
  LucideDiamond,
  IndianRupee,
  Moon,
} from "lucide-react";
import moment from "moment";

const Sidebar = () => {
  const { user, chats, setSelectedChats, theme, setTheme, navigate } =
    useAppContext();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-screen min-w-72 p-5 
  bg-gradient-to-r from-[#dfdfdf] to-[#dbdbd9] text-black
  dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]
  dark:text-white
  border-r-4 border-gray-400/40 dark:border-[#80609F]
  backdrop-blur-3xl transition-colors duration-500 ease-in-out">
      {/*LOGO */}
      <img onClick={()=>navigate('/')}
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48 cursor-pointer"
      />

      {/* New Chat Button */}
      <button onClick={()=>navigate('./')}  className="flex justify-center items-center w-full py-2 mt-5 text-white bg-linear-to-r from-[#A456F7] to-[#556c92] text-sm rounded-full cursor-pointer">
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* Search Conversation.... */}
      <div className="flex  items-center  mt-4 p-2 gap-1  dark:border-white/20 rounded-md">
        <Search className="w-8 text-gray-700" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations.."
          className="text-md placeholder:text-gray-600 outline-none"
        />
      </div>

      {/* Recent Chats... */}
      {chats.length > 0 && <p className="mt-1 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChats(chat)}
              className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-400 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#b1a6c0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <Trash2 className="opacity-0 group-hover:opacity-100 mt-2 transition w-5 cursor-pointer text-gray-700 dark:text-white" />
            </div>
          ))}
      </div>

      {/* Community image btn */}
      {/* <div
        onClick={() => {
          navigate("/community");
        }}
        className="bg-linear-to-r from-[#dcc8f2] to-[#a8abb1] flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]"
      >
        <Image
          
          className="w-4.5"
          alt=""
        />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div> */}

      {/* Credit btn */}
      <div
        onClick={() => {
          navigate("/credits");
        }}
        className=" bg-linear-to-r from-[#dcc8f2] to-[#a8abb1] flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]"
      >
        <IndianRupee
          
          className="w-4.5 "
          alt=""
        />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>
          <p className="text-sm text-gray-500">
            Purchase credits for more use..
          </p>
        </div>
      </div>

      {/* Dark mode btn */}
      <div className="bg-linear-to-r from-[#dcc8f2] to-[#a8abb1] flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md justify-between dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]">
        <div className="flex items-center gap-2 text-sm ">
          <Moon className="w-4" />
          <p>Dark Mode</p>
        </div>

        <label className="relative   inline-flex cursor-pointer">
          <input
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-500 rounded-full peer-checked:bg-purple-500 transition-all"></div>

          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>
       {/* User details */}
       <div className="flex items-center gap-3 p-3 mt-4 dark:shadow-gray-700 border-[#cacaca] dark:border-white/15 rounded-md shadow-gray-400 shadow-sm cursor-pointer group">
         <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
         <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your Account"}
         </p>
         {
          user && <img src={assets.logout_icon} className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"/>
         }

       </div>
    </div>
  );
};

export default Sidebar;
