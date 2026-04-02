"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Brain,
  Zap,
  Users,
  BookOpen,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "3D Immersive World",
    description:
      "Explore a persistent 3D study environment with different zones — library, whiteboard, terminal — each unlocking unique tools.",
    color: "text-neon-purple",
    glow: "shadow-neon-purple",
    bg: "bg-brand-600/10",
    border: "border-brand-500/20",
  },
  {
    icon: Users,
    title: "Real-Time Multiplayer",
    description:
      "See and interact with other learners in real-time. Powered by Colyseus WebSocket with state delta sync at 20Hz.",
    color: "text-neon-blue",
    glow: "shadow-neon-blue",
    bg: "bg-blue-600/10",
    border: "border-blue-500/20",
  },
  {
    icon: Brain,
    title: "AI-Powered RAG Chat",
    description:
      "Upload PDFs, links, and notes. Our RAG pipeline chunks, embeds, and indexes your content so the AI can cite exact sources.",
    color: "text-neon-cyan",
    glow: "shadow-neon-cyan",
    bg: "bg-cyan-600/10",
    border: "border-cyan-500/20",
  },
  {
    icon: BookOpen,
    title: "Smart Notes",
    description:
      "Create, organize, and tag notes with a rich editor. Notes are workspace-scoped and synced across all your devices instantly.",
    color: "text-green-400",
    glow: "",
    bg: "bg-green-600/10",
    border: "border-green-500/20",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Search across all your uploaded resources using vector similarity. Find the exact passage you need, not just keyword matches.",
    color: "text-amber-400",
    glow: "",
    bg: "bg-amber-600/10",
    border: "border-amber-500/20",
  },
  {
    icon: Zap,
    title: "Background Processing",
    description:
      "Drop in a PDF and walk away. Our BullMQ workers parse, chunk, embed, and index your content in the background automatically.",
    color: "text-pink-400",
    glow: "",
    bg: "bg-pink-600/10",
    border: "border-pink-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2"
          >
            <span className="text-sm font-medium text-brand-300">✨ Full Feature Set</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl"
          >
            Everything You Need to{" "}
            <span className="text-gradient-purple">Master Any Subject</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-400"
          >
            StudyVerse combines the focus of a library, the collaboration of a classroom, and
            the intelligence of a personal tutor — in a single 3D universe.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group rounded-2xl border ${feature.border} ${feature.bg} p-6 transition-all duration-300 hover:border-opacity-60`}
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} border ${feature.border}`}
              >
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
