"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";

interface PanelOverlayProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  width?: string;
}

export function PanelOverlay({ title, icon, children, width = "max-w-2xl" }: PanelOverlayProps) {
  const { closePanel } = useWorldStore();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={closePanel}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full ${width} rounded-2xl border border-white/10 bg-[rgba(10,10,20,0.95)] shadow-2xl shadow-brand-900/40 backdrop-blur-xl`}
          style={{ maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={closePanel}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 72px)" }}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
