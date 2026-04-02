"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link2, FileText, CheckCircle, Clock, AlertCircle, Plus, Trash2 } from "lucide-react";
import { PanelOverlay } from "./PanelOverlay";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Resource, ResourceType } from "@studyverse/shared";

const MOCK_RESOURCES: Resource[] = [
  {
    id: "res_01",
    title: "Introduction to Machine Learning — Stanford CS229",
    type: "pdf",
    url: null,
    fileKey: "ml-stanford.pdf",
    status: "ready",
    workspaceId: "workspace_demo_01",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "res_02",
    title: "Deep Learning Fundamentals",
    type: "link",
    url: "https://d2l.ai",
    fileKey: null,
    status: "ready",
    workspaceId: "workspace_demo_01",
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: "res_03",
    title: "Attention Is All You Need (Transformer Paper)",
    type: "pdf",
    url: null,
    fileKey: "attention-paper.pdf",
    status: "processing",
    workspaceId: "workspace_demo_01",
    createdAt: new Date(Date.now() - 3600000),
  },
];

const STATUS_CONFIG = {
  ready: { icon: CheckCircle, color: "text-green-400", label: "Ready" },
  processing: { icon: Clock, color: "text-yellow-400", label: "Processing" },
  pending: { icon: Clock, color: "text-gray-400", label: "Pending" },
  failed: { icon: AlertCircle, color: "text-red-400", label: "Failed" },
};

const TYPE_ICONS: Record<ResourceType, string> = {
  pdf: "📄",
  link: "🔗",
  video: "🎬",
  audio: "🎵",
  text: "📃",
};

export function ResourcesPanel() {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [urlInput, setUrlInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleAddUrl() {
    if (!urlInput.trim() || !titleInput.trim()) return;
    setIsUploading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newResource: Resource = {
      id: `res_${Date.now()}`,
      title: titleInput,
      type: "link",
      url: urlInput,
      fileKey: null,
      status: "pending",
      workspaceId: "workspace_demo_01",
      createdAt: new Date(),
    };

    setResources((prev) => [newResource, ...prev]);
    setUrlInput("");
    setTitleInput("");
    setIsAddingUrl(false);
    setIsUploading(false);

    // Trigger ingestion
    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId: newResource.id, workspaceId: newResource.workspaceId, type: "link" }),
    }).catch(console.error);
  }

  function handleDelete(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <PanelOverlay title="Resources Library" icon="📚" width="max-w-2xl">
      <div className="p-6">
        {/* Action buttons */}
        <div className="mb-6 flex gap-3">
          <Button
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={() => alert("File upload: connect S3 in production")}
          >
            Upload PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsAddingUrl(!isAddingUrl)}
          >
            Add URL
          </Button>
        </div>

        {/* URL input form */}
        <AnimatePresence>
          {isAddingUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-surface-50 p-4"
            >
              <div className="flex flex-col gap-3">
                <Input
                  label="Resource Title"
                  placeholder="e.g., Deep Learning Textbook"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />
                <Input
                  label="URL"
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  leftIcon={<Link2 size={14} />}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => void handleAddUrl()} isLoading={isUploading}>
                    Add Resource
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingUrl(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources list */}
        <div className="space-y-3">
          {resources.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={40} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No resources yet. Upload a PDF or add a URL.</p>
            </div>
          )}

          <AnimatePresence>
            {resources.map((resource) => {
              const StatusIcon = STATUS_CONFIG[resource.status].icon;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-surface-50 p-4 transition-all hover:border-white/20"
                >
                  <span className="mt-0.5 text-2xl">{TYPE_ICONS[resource.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-200">{resource.title}</p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 truncate text-xs text-brand-400 hover:text-brand-300"
                      >
                        {resource.url}
                      </a>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <StatusIcon size={12} className={STATUS_CONFIG[resource.status].color} />
                      <span className={`text-xs ${STATUS_CONFIG[resource.status].color}`}>
                        {STATUS_CONFIG[resource.status].label}
                      </span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs capitalize text-gray-600">{resource.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="opacity-0 rounded-lg p-1.5 text-gray-600 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </PanelOverlay>
  );
}
