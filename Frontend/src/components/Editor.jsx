import { motion } from "motion/react";
import { getFileIcon } from "../utils/customizeIcon";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
const Editor = ({ activeTab, openTabs, setOpenTabs, setActiveTab }) => {
  const handleCloseTab = (id) => {
    const result = openTabs.filter((tab) => tab._id !== id);
    setOpenTabs(result);
  };

  return (
    <div className="flex flex-1 flex-col bg-[#0a0a0c]">
      <div className="flex h-10 shrink-0 items-center overflow-x-auto border-b border-white/[0.06] bg-[#111113]/90">
        <AnimatePresence initial={false}>
          {openTabs.map((tab) => {
            const active = activeTab?._id === tab?._id;
            const { icon: Icon, color } = getFileIcon(tab?.name);

            return (
              <motion.div
                key={tab._id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab(tab)}
                className={`group relative flex h-full cursor-pointer items-center gap-2 whitespace-nowrap border-r border-white/[0.05] px-3.5 transition-colors ${
                  active
                    ? "bg-[#0a0a0c] text-white"
                    : "text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300"
                }`}
              >
                <Icon size={14} className={`${color}`} />
                <span className="text-[13px]">{tab?.name}</span>
                <button
                  onClick={() => {
                    handleCloseTab(tab?._id);
                  }}
                  className="rounded p-0.5 text-zinc-500 cursor-pointer opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
                
                {active && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-sky-400 to-violet-400"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
                
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor;
