"use client";

import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  MoreVertical,
  Edit,
  Eye,
  CheckCircle2,
  BookOpen,
  EyeOff,
  ThumbsUp,
  Tag,
  Plus
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditModal, { EditField } from "@/components/ui/EditModal";

const mockArticles = [
  { id: "KB-101", title: "Getting Started with FleetManager Pro", category: "Onboarding", status: "published", views: 14502, upvotes: 98, lastUpdated: "2026-07-01" },
  { id: "KB-102", title: "How to Configure Automated Invoicing", category: "Billing", status: "published", views: 8230, upvotes: 45, lastUpdated: "2026-06-25" },
  { id: "KB-103", title: "Integrating with Telematics Providers", category: "Technical", status: "published", views: 5600, upvotes: 32, lastUpdated: "2026-06-10" },
  { id: "KB-104", title: "Setting up Custom Permissions", category: "Security", status: "draft", views: 0, upvotes: 0, lastUpdated: "2026-07-14" },
  { id: "KB-105", title: "Managing Driver Batta Payments", category: "Finance", status: "published", views: 11200, upvotes: 89, lastUpdated: "2026-05-20" },
];

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState(mockArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const articleFields: EditField[] = [
    { name: 'id', label: 'Article ID', type: 'text', disabled: true },
    { name: 'title', label: 'Article Title', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
    ]},
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'published') return <span className="badge badge-completed"><CheckCircle2 size={12} className="mr-1" /> Published</span>;
    if (status === 'draft') return <span className="badge badge-inactive"><EyeOff size={12} className="mr-1" /> Draft</span>;
    return <span className="badge">{status}</span>;
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Knowledge Base</h1>
          <p className="cmd-banner-sub">
            Manage help articles, documentation, and guides for tenants.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingArticle(null);
              setIsEditModalOpen(true);
            }}
          >
            <Plus size={16} /> New Article
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 animate-fade-in stagger-1">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search articles by title, category, or ID..." 
            className="form-input !pl-10 !h-10 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="form-input !pl-9 !h-10 w-full cursor-pointer text-sm font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Engagement</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="group hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 mt-1">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm max-w-[300px] truncate" title={article.title}>
                          {article.title}
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">{article.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 w-fit px-2 py-1 rounded-md">
                      <Tag size={12} className="text-slate-400" />
                      {article.category}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1" title="Views">
                        <Eye size={14} className="text-slate-400" />
                        {article.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1" title="Upvotes">
                        <ThumbsUp size={14} className="text-emerald-500" />
                        {article.upvotes}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-700 text-sm">{article.lastUpdated}</div>
                  </td>
                  <td>
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === article.id ? null : article.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === article.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={16} className="text-slate-400" /> Preview Article
                        </button>
                        <button 
                          onClick={() => {
                            setEditingArticle(article);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Metadata
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredArticles.length === 0 && (
            <div className="empty-state p-12 flex flex-col items-center">
              <LayoutTemplate size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingArticle ? "Edit Article Metadata" : "Create New Article"}
        fields={articleFields}
        initialData={editingArticle}
        onSave={async (data) => {
          await new Promise(r => setTimeout(r, 600));
          setArticles(articles.map(a => a.id === data.id ? { ...a, ...data } : a));
          setToastMessage(`Article ${data.id} updated`);
          setTimeout(() => setToastMessage(""), 3000);
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
