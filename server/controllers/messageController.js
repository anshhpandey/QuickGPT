import Chat from "../models/Chat.js";
import axios from 'axios'
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";


export const textMessageController = async (req, res) => {
    
  try {
    const userId = req.user._id;

    //check credits..
        if(req.user.credits < 1){
            return res.json({success:false , message: 'You dont have enough credits..'})
        }

    const { chatId, prompt } = req.body;
   

    

    const chat = await Chat.findOne({ userId, _id: chatId });
    
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    const {choices} = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {...choices[0].message, timeStamp: Date.now(), isImage:false }
    res.json({success:true , reply})

    chat.messages.push(reply)
    await chat.save()

    await User.updateOne({_id: userId}, {$inc : {credits:-1}})



  } catch (error) {res.json({success:false , message:error.message})}
};



//Image generation msg controller..

export const imageMessageController = async (req,res) => {
    try {
        const userId = req.user._id

        //check credits..
        if(req.user.credits < 2){
            return res.json({success:false , message: 'You dont have enough credits..'})
        }

        const {chatId , prompt, isPublished} = req.body

        //find chat 
        const chat = await Chat.findOne({userId, _id:chatId})
        
        if(!chat) return res.json({success:false, message:'Chat not found'})

        //Push user message
        chat.messages.push({
            role:"user",
            content:prompt,
            timeStamp:Date.now(),
            isImage:false
        })

        //Generate image using Pollinations AI 
        const encodedPrompt = encodeURIComponent(prompt)
        const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`
        

        //Upload to ImageKit media library 
        const uploadResponse = await imagekit.upload({
            file: generatedImageUrl,
            fileName: `${Date.now()}.png`,
            folder: 'quickgpt'
        })

        const reply = {
            role:'assistant',
            content: uploadResponse.url,
            timeStamp: Date.now(),
            isImage:true,
            isPublished 
        }
           
        res.json({success:true, reply})
        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits:-2}})

    } catch (error) {
        console.log("ERROR:", error.message)
        res.json({success:false, message:error.message})
    }
}