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
import { Bot, Code2, Eye, Files, Maximize2, Minimize, Sparkles, TerminalSquare } from "lucide-react";
import Preview from "../components/Preview";
import Editor from "../components/Editor";
import BottomPanel from "../components/BottomPanel";
import AiChat from "../components/AiChat";

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showPreview, setShowPreview] = useState(false);

  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

  const [showExplorer, setShowExplorer] = useState(false);

  const [showAiChat, setShowAiChat] = useState(false);

  const [showTerminal, setShowTerminal] = useState(false);

  const [tree, setTree] = useState([]);

  const [openTabs, setOpenTabs] = useState([]);

  const [activeTab, setActiveTab] = useState(null);

  const [showBottomPanel, setShowBottomPanel] = useState(false);

  const [terminalSyncVersion, setTerminalSyncVersion] = useState(0);

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

  const openFile = (file) => {
    const exists = openTabs.find((tab) => tab._id == file._id);
    if (!exists) setOpenTabs((prev) => [...prev, file]);
    setActiveTab(file);
    setShowPreview(false);
  };

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
            showTerminal={showBottomPanel}
            setShowExplorer={setShowExplorer}
            setShowTerminal={setShowBottomPanel}
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
              <Explorer
                openFile={openFile}
                projectId={id}
                tree={tree}
                reloadTree={loadTree}
              />
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
                <Code2 size={13} className="relative" />
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
                <Eye size={13} className="relative" />
                <span className="relative hidden sm:inline"> Preview</span>
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {showPreview ? (
              <Preview tree={tree} />
            ) : (
              <Editor
                activeTab={activeTab}
                openTabs={openTabs}
                setOpenTabs={setOpenTabs}
                setActiveTab={setActiveTab}
                onFileSaved={() => setTerminalSyncVersion((version) => version + 1)}
              />
            )}
          </div>

          <AnimatePresence>
            {showPreview && isPreviewFullScreen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed inset-0 z-[100] bg-white"
              >
                <Preview tree={tree} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  onClick={() => setIsPreviewFullScreen(false)}
                  className="absolute right-2 top-2 z-[110] flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111113]/95 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40 backdrop-blur hover:text-white cursor-pointer sm:right-4 sm:top-3 sm:px-3 sm:text-xs"
                >
                  <Minimize size={13} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBottomPanel && (
              <div className="max-h-[45vh] md:max-h-none  ">
                <BottomPanel
                  onClose={() => setShowBottomPanel(false)}
                  projectId={id}
                  terminalSyncVersion={terminalSyncVersion}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
        <div
          className={`${mobilePane === "chat" ? "flex" : "hidden"} w-full md:flex md:w-auto`}
        >
          <AnimatePresence initial={false}>
            {showAiChat && (
              <AiChat
                projectId={id}
                reloadTree={loadTree}
                onFilesChanged={() => setTerminalSyncVersion((version) => version + 1)}
              />
            )}
          </AnimatePresence>
        </div>
        
      </div>

      <div className='flex items-center justify-around border-t border-white/[0.06] bg-[#0f0f12] py-2 md:hidden'>
  {/* Files / Explorer Tab */}
  <button
    onClick={() =>{ 
        setMobilePane("explorer") 
        setShowExplorer((v)=>!v)
    }}
    className={`flex flex-col cursor-pointer items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${
      mobilePane === "explorer" ? "text-white" : "text-zinc-500"
    }`}
  >
    <Files size={18} />
    Files
  </button>

  {/* Editor Tab */}
  <button
    onClick={() => {
        setMobilePane("editor")
        
    }}
    className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium cursor-pointer transition-colors ${
      mobilePane === "editor" ? "text-white" : "text-zinc-500"
    }`}
  >
    <Code2 size={18} />
    Editor
  </button>

  {/* AI Chat Tab */}
  <button
    onClick={() => {
        setMobilePane("chat")
        setShowAiChat((v)=>!v)
    }}
    className={`flex flex-col cursor-pointer items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${
      mobilePane === "chat" ? "text-white" : "text-zinc-500"
    }`}
  >
    <Bot size={18} />
    Chat
  </button>

  {/* Terminal */}
  <button
    onClick={() => {
        setShowBottomPanel((v)=>!v)
    }}
    className={`flex flex-col cursor-pointer items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${
      showTerminal ? "text-white" : "text-zinc-500"
    }`}
  >
    <TerminalSquare size={18} />
    Terminal
  </button>
</div>


    </div>
  );
};

export default ProjectPage;
