import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Layout, FileText, Layers, Maximize2 } from 'lucide-react';
import { SitemapNode } from '../sitemap';

interface InteractiveSitemapProps {
  data: SitemapNode;
  className?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  page: <FileText className="w-3.5 h-3.5" />,
  view: <Layout className="w-3.5 h-3.5" />,
  overlay: <Layers className="w-3.5 h-3.5" />,
  modal: <Maximize2 className="w-3.5 h-3.5" />,
  section: <Layout className="w-3.5 h-3.5" />,
};

const typeColors: Record<string, string> = {
  page: 'text-[#24A2A7] border-[#24A2A7]/30',
  view: 'text-white border-white/20',
  overlay: 'text-gray-400 border-white/10',
  modal: 'text-gray-500 border-white/5',
  section: 'text-gray-400 border-white/10',
};

const SitemapNodeComponent: React.FC<{
  node: SitemapNode;
  depth: number;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
}> = ({ node, depth, isExpanded, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const expanded = isExpanded(node.id);
  const icon = typeIcons[node.type] || typeIcons.section;
  const colorClass = typeColors[node.type] || typeColors.section;

  return (
    <div className="select-none">
      <button
        onClick={() => hasChildren && onToggle(node.id)}
        className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-left transition-all duration-200 group hover:bg-white/5 ${
          hasChildren ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className="flex-shrink-0 w-5 flex justify-center">
          {hasChildren && (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-[#24A2A7]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#24A2A7] transition-colors" />
            )
          )}
        </span>
        <span className={`flex-shrink-0 ${colorClass}`}>{icon}</span>
        <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#24A2A7] transition-colors truncate">
          {node.label}
        </span>
        {node.description && (
          <span className="hidden md:inline text-[10px] text-gray-600 ml-2 truncate flex-1">
            {node.description}
          </span>
        )}
      </button>
      {hasChildren && expanded && (
        <div className="ml-6 pl-6 border-l border-white/10 space-y-0.5">
          {node.children!.map((child) => (
            <SitemapNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InteractiveSitemap: React.FC<InteractiveSitemapProps> = ({ data, className = '' }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root', '2d', '3d']));

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={`bg-[#0d0d0d] border border-white/5 rounded-xl overflow-hidden print:bg-gray-50 print:border-gray-200 ${className}`}
    >
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24A2A7]">
          Interactive Site Map
        </h4>
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
          Click to expand
        </span>
      </div>
      <div className="p-4 md:p-5 max-h-[400px] overflow-y-auto">
        <SitemapNodeComponent
          node={data}
          depth={0}
          isExpanded={(id) => expandedIds.has(id)}
          onToggle={toggle}
        />
      </div>
    </div>
  );
};

export default InteractiveSitemap;
