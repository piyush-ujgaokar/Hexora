import { TerminalSquare, X } from "lucide-react";
import { motion } from "motion/react";
import Terminal from "./Terminal";
import { useSelector } from "react-redux";

const BottomPanel = ({ onClose, projectId, terminalSyncVersion }) => {

  const {currentProject}=useSelector(state=>state.project)
  const project=currentProject?.project
  const userId=String(project?._id) === String(projectId) ? project.owner : undefined
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 256, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex shrink-0 flex-col overflow-hidden border-t border-white/[0.06] bg-[#111113]"
    >
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
        <div className="flex items-center gap-1">
          <h2 className="relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors text-white">
            <TerminalSquare size={18} className="relative" />
            <span className="relative uppercase text-[11px]">Terminal</span>
          </h2>
        </div>

        <button
          onClick={onClose}
          title="Close panel"
          className="rounded-md cursor-pointer p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>

      </div>

    <div className="min-h-0 flex-1">
      <Terminal
        projectId={projectId}
        userId={userId}
        syncVersion={terminalSyncVersion}
      />
    </div>




    </motion.div>
  );
};

export default BottomPanel;
