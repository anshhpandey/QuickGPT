import React, {  useEffect, useRef, useState } from 'react'
import {useAppContext} from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';
import toast from 'react-hot-toast';

const Chatbox = () => {

  const containerRef = useRef(null)

  const {selectedChats , theme , user,axios,token,setUser} = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading , setLoading] = useState(false);
  const [prompt , setPrompt] = useState('')
  const [mode , setMode] = useState('text')
  const [isPublished , setIsPublished] = useState(false)

  const onSubmit = async(e)=>{
    try {
      e.preventDefault()
      if(!user) return toast('Login to ask something..')
        setLoading(true)
      const promptCopy = prompt;
      setPrompt('')
      setMessages(prev=> [...prev,{role:'user',content:prompt,timeStamp:Date.now(),isImage:false}])

      const {data} = await axios.post(`/api/message/${mode}`, {chatId :selectedChats._id,prompt,},{headers: {Authorization: `Bearer ${token}`}})
      
      if(data.success){
        setMessages(prev=>[...prev, data.reply])
        //decrese credits...
        if(mode === 'image'){
          setUser(prev=> ({...prev,credits : prev.credits -2 }))
        }else{
          setUser(prev=> ({...prev,credits : prev.credits -1 }))
        }
      }
      else{
        toast.error(data.message)
        setPrompt(promptCopy)
      }
      
    } catch (error) {
       toast.error(error.message)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(()=>{
      if(selectedChats){
        setMessages(selectedChats.messages)
      }
  },
  [selectedChats])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
       
      })
    }
  },[messages])
  
  
  return (
    <div  className='flex flex-1 flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>

      {/* Chat Messages... */}

        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
          {
            messages.length === 0 && (
              <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                <img className='w-full max-w-56 sm:max-w-68' src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" />
                <p className='mt-2 text-2xl  text-center text-gray-500 dark:text-white'>Ask me anything...</p>
              </div>
            )
          }
          {messages.map((messages,index)=><Message key={index} message={messages}/>)}

          {/* Three DOt Loading... */}
          {
            loading && 
            <div className='loader ml-3 flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce'></div>

            </div>
          }

        </div>

        {/* {
          mode === 'image' && 
          (
            <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
              <p className='text-sm'>Publish Generated Image to Community</p>
              <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} />
            </label>
          )
        } */}

        {/* Prompt input form.... */}
        <form onSubmit={onSubmit} className='bg-gray-300 dark:bg-[#583c79]/30 border-gray-400 border-3 dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center  text-black dark:text-white'>
        
          <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
            <option className='dark:bg-purple-900' value='text'>Text</option>
            <option className='dark:bg-purple-900' value='image'>Image</option>
          </select>

          <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type='text' placeholder='Type your prompt here..' className='flex-1 w-full text-l outline-none chat-input ' required/>

          <button disabled={loading}>
            <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer ' alt="" />
          </button>
        </form>


    </div>
  )
}

export default Chatbox