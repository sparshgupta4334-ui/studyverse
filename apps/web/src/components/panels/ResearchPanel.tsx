"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, BookOpen, Star } from "lucide-react";
import { PanelOverlay } from "./PanelOverlay";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SearchResult } from "@studyverse/shared";

const MOCK_PAPERS = [
  {
    id: "paper_1",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    venue: "NeurIPS",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture based solely on attention mechanisms.",
    citations: 95432,
    url: "https://arxiv.org/abs/1706.03762",
    tags: ["transformers", "nlp", "attention"],
  },
  {
    id: "paper_2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    year: 2018,
    venue: "NAACL",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.",
    citations: 87341,
    url: "https://arxiv.org/abs/1810.04805",
    tags: ["bert", "nlp", "pretraining"],
  },
  {
    id: "paper_3",
    title: "An Image Is Worth 16x16 Words: Transformers for Image Recognition",
    authors: "Dosovitskiy et al.",
    year: 2020,
    venue: "ICLR",
    abstract:
      "We show that a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.",
    citations: 29847,
    url: "https://arxiv.org/abs/2010.11929",
    tags: ["vision", "transformers", "vit"],
  },
];

export function ResearchPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedPapers, setSavedPapers] = useState<string[]>(["paper_1"]);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}&workspaceId=workspace_demo_01`,
      );
      const data = (await res.json()) as { results: SearchResult[] };
      setSearchResults(data.results ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function toggleSave(paperId: string) {
    setSavedPapers((prev) =>
      prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId],
    );
  }

  const filteredPapers = MOCK_PAPERS.filter(
    (p) =>
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.includes(searchQuery.toLowerCase())),
  );

  return (
    <PanelOverlay title="Research Board" icon="🔬" width="max-w-3xl">
      <div className="p-6">
        {/* Search bar */}
        <div className="mb-6 flex gap-3">
          <Input
            placeholder="Search your resources semantically..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
            leftIcon={<Search size={14} />}
            className="flex-1"
          />
          <Button onClick={() => void handleSearch()} isLoading={isSearching} size="md">
            Search
          </Button>
        </div>

        {/* Search results from RAG */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-brand-300">
              🔍 Results from your resources
            </h3>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <motion.div
                  key={result.resourceId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-brand-500/20 bg-brand-600/10 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200">{result.resourceTitle}</p>
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                      {(result.score * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">{result.chunkContent}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Papers library */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-400">
            <BookOpen size={14} />
            Research Papers
          </h3>
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-xl border border-white/10 bg-surface-50 p-5 transition-all hover:border-white/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-white">{paper.title}</h4>
                      <button
                        onClick={() => toggleSave(paper.id)}
                        className={`mt-0.5 flex-shrink-0 transition-colors ${
                          savedPapers.includes(paper.id)
                            ? "text-yellow-400"
                            : "text-gray-600 hover:text-yellow-400"
                        }`}
                      >
                        <Star size={16} fill={savedPapers.includes(paper.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <p className="mb-2 text-sm text-gray-500">
                      {paper.authors} · {paper.venue} {paper.year} ·{" "}
                      <span className="text-gray-400">{paper.citations.toLocaleString()} citations</span>
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400">{paper.abstract}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex flex-wrap gap-1">
                        {paper.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-200 px-2 py-0.5 text-xs text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
                      >
                        <ExternalLink size={12} />
                        View Paper
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PanelOverlay>
  );
}
