import React from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Chatbox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import './assets/prism.css'
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";


const App = () => {

  const {user} = useAppContext()

  const {pathname} = useLocation()
  if(pathname === '/loading') return <Loading/>

  return (
    <>
     <div className="
  bg-linear-to-r from-[#dfdfdf] to-[#b3b3b0] text-black
  dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]
  dark:text-white
">
  
       {user ?
        (
           <div className="flex h-screen w-screen">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
        )
        :
        (
          <div className="bg-linear-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
            <Login/>
          </div>
        )
        }
      </div>
    </>
  );
};

export default App;
