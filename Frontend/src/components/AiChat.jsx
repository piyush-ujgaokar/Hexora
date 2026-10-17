import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const AiChat = ({projectId,history=[]}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("")



const handleChat=async()=>{
    try {

        const response=await fetch(`${import.meta.env.VITE_SERVER_URL}/api/ai/chat`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Accept:"text/event-stream"
            },
            credentials:'include',
            body:JSON.stringify({
                projectId,
                message,
                history
            })
        })

        if(!response.ok){
          let msg="Ai request failed"
          try {
            const data=await response.json()
            msg=data?.message|| msg
          } catch {}

          throw new Error(msg)
        }

        if(!response.body){
          throw new Error("AI streaming is not supported")
        }

        const reader=response.body.getReader()
        const decoder=new TextDecoder()
        let buffer=""

        try {
            while(true){
             const {value,done}= await reader.read()
             if(done){
              break
             }
             buffer+=decoder.decode(value,{stream:true})
             const events=buffer.split("\n\n");
             buffer=events.pop() || ""

             for(const eventText of events){
              if(!eventText.trim()){
                continue
              }
             let eventType="message"
             let dataText=""

             for(const line of eventText.split("\n")){
              if(line.startsWith("event:")){
               eventType= line.slice(6).trim()
              }
              if(line.startsWith("data:")){
                dataText+=line.slice(5).trim()
              }
             }
             if(!dataText){
              continue
             }
             let data;
             try {
                data=JSON.parse(dataText)
             } catch (error) {
              data={
                content:dataText
              }
             }
             console.log("data:",data);
             console.log("event Type:",eventType);
             
             }


            }
        } finally{
          reader.releaseLock()
        }



    } catch (error) {
        console.log(error);
        return null
        
    }
}

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-white/[0.06] bg-[#111113]/90 backdrop-blur-xl">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3">
        <span className="text-xs font-semibold tracking-wider text-zinc-300">
          HexoraAI Chat
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length == 0 && (
          <div className="mt-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <Sparkles size={22} className="text-zinc-600" />
            </div>

            <p className="text-sm font-medium text-zinc-400">
              What do you want to build?
            </p>
            <p className="mt-1.5 text-xs text-zinc-600">
              Ask me to create or modify files.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-end gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 transition-colors focus-within:border-sky-400/40">
          <textarea
          onChange={(e)=>setMessage(e.target.value)}
          value={message}
            placeholder="Ask AI to build something..."
            rows={2}
            className="flex-1 resize-none bg-transparent text-[13px] text-zinc-200 outline-none placeholder:text-zinc-600"
          />
          <motion.button
          onClick={handleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-sky-500 to-pink-600 text-white shadow-[0_1px_0_rgba(255,255,0.2)_inset] transition-opacity hover:from-sky-400 hover:to-red-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
