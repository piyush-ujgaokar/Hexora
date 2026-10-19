import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { useRef } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";
import { Eraser } from "lucide-react";

const Terminal = ({ projectId, userId, syncVersion }) => {
  const containerRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const terminalRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!projectId || !userId) return;

    const terminal = new XTerminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 13,
      fontFamily: "Menlo, Monaco,Consolas, monospace",
      scrollback: 5000,

      theme: {
        background: "#0d0d0f",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
        selectionBackground: "#264f78",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(containerRef.current);
    terminalRef.current = terminal;

    const fitTerminal = () => {
      if (
        !containerRef.current?.clientWidth ||
        !containerRef.current?.clientHeight
      )
        return;
      fitAddon.fit();
    };
    fitTerminal();

    const terminalUrl = import.meta.env.VITE_TERMINAL_SERVICE_URL;

    if (!terminalUrl) {
      terminal.write(
        "\r\n\x1b[31mVITE_TERMINAL_SERVICE_URL missing\x1b[0m\r\n",
      );
      return () => terminal.dispose();
    }

    const socket = io(terminalUrl, {
      withCredentials: true,
    });
    socketRef.current = socket;

    const dataSubscription = terminal.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("connect", () => {
      setConnected(true);
      fitTerminal();
      socket.emit("terminal:init", {
        projectId,
        userId,
        cols: terminal.cols,
        rows: terminal.rows,
      });
    });

    socket.on("terminal:data", (data) => {
      terminal.write(String(data || ""));
    });

    socket.on("terminal:ready", () => {
      fitTerminal();
      socket.emit("terminal:resize", {
        cols: terminal.cols,
        rows: terminal.rows,
      });
      terminal.focus();
    });

    socket.on("connect_error", (error) => {
      setConnected(false);
      terminal.write(
        `\r\n\x1b[31mTerminal connection failed: ${error.message}\x1b[0m\r\n`,
      );
    });
    socket.on("disconnect", () => {
      setConnected(false);
    });

    const handleSyncError = ({ message }) => {
      console.error("Terminal project sync failed", message);
      terminal.write(
        `\r\n\x1b[31mProject sync failed: ${message}\x1b[0m\r\n`,
      );
    };
    socket.on("terminal:sync:error", handleSyncError);

    const resizeObserver = new ResizeObserver(() => {
      fitTerminal();
      socket.emit("terminal:resize", {
        cols: terminal.cols,
        rows: terminal.rows,
      });
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      dataSubscription.dispose();
      socket.off("terminal:sync:error", handleSyncError);
      socket.disconnect();
      socketRef.current = null;
      terminal.dispose();
    };
  }, [projectId, userId]);

  useEffect(() => {
    if (syncVersion > 0 && socketRef.current?.connected) {
      socketRef.current.emit("terminal:sync");
    }
  }, [syncVersion]);

  const clearTerminal = () => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    terminal.clear();

    terminal.write("\x1b[23\x1b[H");
    terminal.focus();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden text-white">
      <div className="flex h-7 shrink-0 items-center justify-between border-b border-white/[0.05] px-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected ? "bg-emerald-400" : "bg-zinc-600"
            }`}
          />
          <span className="text-[11px] text-zinc-500">
            {connected ? "terminal - connected" : "terminal - disconnected"}
          </span>
        </div>
        <button
          onClick={clearTerminal}
          title="Clear terminal"
          className="rounded p-1 cursor-pointer text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Eraser size={12} />
        </button>
      </div>
      <div ref={containerRef} className="min-h-0 w-full flex-1 overflow-hidden"></div>
    </div>
  );
};

export default Terminal;
