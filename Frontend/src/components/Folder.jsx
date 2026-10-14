import { ChevronRight, FolderClosed, FolderOpen } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getFolderColor } from "../utils/customizeIcon";

const Folder = ({ projectId, node, tree, reloadTree }) => {
  const [open, setOpen] = useState(false);
  const folderColor = getFolderColor(node?.name);

  return (
    <div className="relative">
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.05] transition-colors"
      >
        <div
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5"
          onClick={() => setOpen(!open)}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="shrink-0"
          >
            <ChevronRight size={16} className="text-zinc-500 cursor-pointer" />
          </motion.div>

          {open ? (
            <FolderOpen size={19} className={`shrink-0 ${folderColor}`} />
          ) : (
            <FolderClosed size={19} className={`shrink-0 ${folderColor}`} />
          )}

          <span className="truncate text-[13px] text-zinc-300 transition-colors group-hover:text-white  ">{node?.name}</span>

        </div>
      </motion.div>
    </div>
  );
};

export default Folder;
