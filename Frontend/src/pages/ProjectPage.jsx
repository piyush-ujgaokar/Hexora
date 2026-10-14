import { AnimatePresence } from "motion/react";
import ActivityBar from "../components/ActivityBar";
import TopBar from "../components/TopBar";
import { useState } from "react";
import Explorer from "../components/Explorer";
import { useParams } from "react-router";
import { getProjectById } from "../features/api/project";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/projectSlice";
import { useEffect } from "react";
import { getTree } from "../features/api/file";
import { motion } from "motion/react";
import { Code2, Eye, Maximize2, Minimize } from "lucide-react";
import Preview from "../components/Preview";
import Editor from "../components/Editor";

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showPreview, setShowPreview] = useState(false);

  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

  const [showExplorer, setShowExplorer] = useState(false);

  const [showAiChat, setShowAiChat] = useState(false);

  const [showTerminal, setShowTerminal] = useState(false);

  const [tree, setTree] = useState([]);

  const [openTabs, setOpenTabs] = useState([])

  const [activeTab, setActiveTab] = useState(null)

  const [mobilePane, setMobilePane] = useState("explorer");

  const handleGetProject = async () => {
    const data = await getProjectById(id);
    dispatch(setCurrentProject(data));
  };

  const loadTree = async () => {
    const data = await getTree(id);
    setTree(data?.tree || []);
    console.log();
  };

  useEffect(() => {
    handleGetProject();
    loadTree();
  }, [id]);

  const openFile=(file)=>{
    const exists=openTabs.find(tab=>tab._id==file._id)
    if(!exists) setOpenTabs(prev=>[...prev,file])
    setActiveTab(file)
setShowPreview(false)
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0a0a0c]">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />
      <div className="relative z-10 h-14 shrink-0">
        <TopBar showPreview={showPreview} setShowPreview={setShowPreview} />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden md:block">
          <ActivityBar
            showAiChat={showAiChat}
            showExplorer={showExplorer}
            showTerminal={showTerminal}
            setShowExplorer={setShowExplorer}
            setShowTerminal={setShowTerminal}
            setShowAiChat={setShowAiChat}
          />
        </div>

        <div
          className={`${
            mobilePane === "explorer" ? "flex" : "hidden"
          } w-full md:flex md:w-auto`}
        >
          <AnimatePresence initial={false}>
            {showExplorer && (
              <Explorer openFile={openFile} projectId={id} tree={tree} reloadTree={loadTree} />
            )}
          </AnimatePresence>
        </div>

        <div
          className={`${mobilePane === "editor" ? "flex" : "hidden"} relative w-full min-w-0 flex-1 flex-col overflow-hidden border-x border-white/[0.05] md:flex`}
        >

          <div className="pointer-events-none absolute right-2 top-2 z-40 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2">
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => setIsPreviewFullScreen((v) => !v)}
                title={
                  isPreviewFullScreen ? "Exit fullscreen" : "Fullscreen preview"
                }
                className="pointer-events-auto flex 
                cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#111113]/95 p-1.5 text-zinc-400 shadow-lg shadow-black/40 backdrop-blur-xl hover:text-white sm:p-2"
              >
                {isPreviewFullScreen ? (
                  <Minimize size={13} />
                ) : (
                  <Maximize2 size={13} />
                )}
              </motion.div>
            )}

            <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 p-1 shadow-lg shadow-black/40 backdrop-blur">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setIsPreviewFullScreen(false);
                }}
                className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold cursor-pointer transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                  !showPreview
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {!showPreview && (
                  <motion.div
                    className="absolute inset-0 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-800"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <Code2 size={13} className="relative"/>
               <span className="relative hidden sm:inline"> Editor</span> 
              </button>

              <button
                onClick={() => setShowPreview(true)}
                className={`relative flex items-center gap-1.5 rounded-md cursor-pointer px-2 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                  showPreview
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                 {showPreview && (
                  <motion.div
                    className="absolute inset-0 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-800"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <Eye size={13} className="relative"/>
                 <span className="relative hidden sm:inline"> Preview</span> 

              </button>
            </div>
          </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
                {
                    showPreview ? <Preview tree={tree}/>:<Editor 
                        activeTab={activeTab}
                        openTabs={openTabs}
                        setOpenTabs={setOpenTabs}
                        setActiveTab={setActiveTab}
                    />
                }
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
