import {
  ChevronRight,
  File,
  FilePlus,
  FilePlus2,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash,
  Trash2,
  TrashIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { getFileIcon, getFolderColor } from "../utils/customizeIcon";
import { createFile, createFolder, deleteFile, updateFile } from "../features/api/file";
import { createPortal } from "react-dom";

const Folder = ({ openFile,projectId, node, tree, reloadTree }) => {
  const [open, setOpen] = useState(false);
  const folderColor = getFolderColor(node?.name);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [creatingFolderIn, setCreatingFolderIn] = useState(null);
  const [creatingFileIn, setCreatingFileIn] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [menu, setMenu] = useState(null);

  const handleCreateFolder = async () => {
    await createFolder({ projectId, name: folderName, parentId: node._id });
    await reloadTree();
  };
  const handleCreateFile = async () => {
    await createFile({ projectId, name: fileName, parentId: node._id });
    await reloadTree();
  };

  const handleRenameFile = async () => {
    await updateFile({
      name: renameValue,
      id: node?._id,
      content: node?.content,
    });
    await reloadTree();
  };
  const handleDeleteFile = async () => {
    await deleteFile(node?._id);
    await reloadTree();
  };

  const handleNewFolder = async (folder) => {
    setCreatingFolderIn(folder._id);
    setCreatingFileIn(null);
  };
  const handleNewFile = async (folder) => {
    setCreatingFileIn(folder._id);
    setCreatingFolderIn(null);
  };

  if (node.type == "file") {
    const { icon: Icon, color } = getFileIcon(node.name);

    return (
      <div className="relative">
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onContextMenu={(e) => {
            e.preventDefault();

            setMenu({ x: e.clientX, y: e.clientY });
          }}
          onClick={()=>openFile(node)}
          className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5">
            <Icon size={20} className={`${color}`} />

            <span className="truncate text-[13px] text-zinc-300 transition-colors group-hover:text-white  ">
              {node?.name}
            </span>
          </div>
        </motion.div>

        {menu &&
          createPortal(
            <>
              <motion.div
                className="fixed inset-0 z-40"
                onClick={() => setMenu(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="fixed z-50 w-52 rounded-xl border border-white/[0.08] bg-[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
                style={{ left: menu.x, top: menu.y }}
              >
                <button
                  className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                  onClick={() =>{ 
                    setMenu(null)
                    setRenaming(true)
                  }}
                >
                  <Pencil size={13} />
                  Rename
                </button>

                <button
                  className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                  onClick={() => {
                    setMenu(null)
                    handleDeleteFile()
                  }}
                >
                  <Trash size={13} />
                  Delete
                </button>
              </motion.div>
            </>,document.body,
          )}

            {renaming && (
        <div className="py-1 pl-1">
          <motion.input
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            autoFocus
            value={renameValue}
            placeholder={node?.name}
            className="w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameFile();
                setRenameValue("");
                setRenaming(null);
              }
              if (e.key === "Escape") {
                setRenameValue("");
                setRenaming(null);
              }
            }}
          />
        </div>
      )}




      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onContextMenu={(e) => {
          e.preventDefault();

          setMenu({ x: e.clientX, y: e.clientY });
        }}
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

          <span className="truncate text-[13px] text-zinc-300 transition-colors group-hover:text-white  ">
            {node?.name}
          </span>
        </div>

        <div className="hidden items-center gap-0.5 group-hover:flex">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleNewFile(node);
              setOpen(true);
            }}
          >
            <FilePlus2 size={18} className="cursor-pointer" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleNewFolder(node);
              setOpen(true);
            }}
          >
            <FolderPlus size={18} className="cursor-pointer" />
          </motion.button>
        </div>
      </motion.div>
      {menu &&
        createPortal(
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setMenu(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="fixed z-50 w-52 rounded-xl border border-white/[0.08] bg-[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
              style={{ left: menu.x, top: menu.y }}
            >
              <button
                className="mx-1 cursor-pointer flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                onClick={() => {
                  setMenu(null);
                  handleNewFile(node);
                }}
              >
                <FilePlus2 size={14} />
                New File
              </button>
              <button
                className="mx-1 cursor-pointer flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                onClick={() => {
                  setMenu(null);
                  handleNewFolder(node);
                }}
              >
                <FolderPlus size={14} />
                New Folder
              </button>

              <div className="my-1 h-px bg-white/[0.08]" />

              <button
                className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                onClick={() => {
                    setMenu(null)
                  setRenaming(true);
                }}
              >
                <Pencil size={13} />
                Rename
              </button>

              {node.parentId != null && (
                <button
                  className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                   onClick={() => {
                    setMenu(null)
                    handleDeleteFile()
                  }}
                >
                  <Trash size={13} />
                  Delete
                </button>
              )}

            </motion.div>
          </>,
          document.body,
        )}

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="ml-5 overflow-hidden border-l border-white/[0.05] pl-1"
        >
          {node.children.map((child) => {
            return (
              <Folder
                projectId={projectId}
                tree={tree}
                reloadTree={reloadTree}
                node={child}
                openFile={openFile}
              />
            );
          })}
        </motion.div>
      )}

      {creatingFolderIn == node._id && (
        <div className="py-1 pl-1">
          <motion.input
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            autoFocus
            value={folderName}
            placeholder="Folder Name"
            className="w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateFolder();
                setFolderName("");
                setCreatingFolderIn(null);
              }
              if (e.key === "Escape") {
                setFolderName("");
                setCreatingFolderIn(null);
              }
            }}
          />
        </div>
      )}

      {creatingFileIn == node._id && (
        <div className="py-1 pl-1">
          <motion.input
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            autoFocus
            value={fileName}
            placeholder="File Name"
            className="w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateFile();
                setFileName("");
                setCreatingFileIn(null);
              }
              if (e.key === "Escape") {
                setFileName("");
                setCreatingFileIn(null);
              }
            }}
          />
        </div>
      )}

      {renaming && (
        <div className="py-1 pl-1">
          <motion.input
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            autoFocus
            value={renameValue}
            placeholder={node?.name}
            className="w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameFile();
                setRenameValue("");
                setRenaming(null);
              }
              if (e.key === "Escape") {
                setRenameValue("");
                setRenaming(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Folder;
