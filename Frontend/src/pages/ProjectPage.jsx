import { AnimatePresence } from "motion/react";
import ActivityBar from "../components/ActivityBar";
import TopBar from "../components/TopBar";
import {useState} from "react"
import Explorer from "../components/Explorer";
import { useParams } from "react-router";
import { getProjectById } from "../features/api/project";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/projectSlice";
import { useEffect } from "react";
import { getTree } from "../features/api/file";

const ProjectPage = () => {

    const {id}=useParams()
    const dispatch=useDispatch()

      const [showPreview, setShowPreview] = useState(false);

      const [showExplorer, setShowExplorer] = useState(false);
    
      const [showAiChat, setShowAiChat] = useState(false);
    
      const [showTerminal, setShowTerminal] = useState(false);


      const handleGetProject=async()=>{
           const data= await getProjectById(id)
        dispatch(setCurrentProject(data))
      } 

      const loadTree=async()=>{
       const data= await getTree(id)
       console.log(data);
       
      }

      useEffect(()=>{
        handleGetProject()
        loadTree()
      },[id])




  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0a0a0c]">

      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />
      <div className="relative z-10 h-14 shrink-0">
        <TopBar showPreview={showPreview} setShowPreview={setShowPreview}/>
      </div>

        <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* ActivityBar: Remaining screen height */}
        <ActivityBar showAiChat={showAiChat} showExplorer={showExplorer} showTerminal={showTerminal} setShowExplorer={setShowExplorer} setShowTerminal={setShowTerminal} setShowAiChat={setShowAiChat} />

    <AnimatePresence initial={false}>
        {showExplorer && (
            <Explorer />
        )}
    </AnimatePresence>

      </div>

    </div>
  );
};

export default ProjectPage;
