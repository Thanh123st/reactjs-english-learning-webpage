// src/pages/privatePages/Dashboard.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import {
  useUserDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "@/hooks/useDocument";

import {
  useUserLectures,
  useCreateLecture,
  useUpdateLecture,
  useDeleteLecture,
} from "@/hooks/useLecture";

import {
  useCollections as useMyCollectionsQuery,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useCollectionById,
} from "@/hooks/useCollections";

import {
  FileText,
  Video,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  Calendar,
  User,
  Image as ImageIcon,
  Layers,
  Eye,
  X,
  Play,
  BookmarkCheck,
  BarChart3,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

// ---------- Helpers ----------
const formatSize = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

const badgeByMime = (mime, fallback = "FILE") => {
  if (!mime) return fallback;
  const tail = mime.split("/")[1]?.toUpperCase() || "";
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("word") || ["DOC", "DOCX"].includes(tail)) return "WORD";
  if (mime.includes("video")) return tail || "VIDEO";
  return tail || fallback;
};

export default function Dashboard() {
  const { user, isRefreshing } = useAuthContext();

  // ====== Queries (mine only) ======
  const { data: userDocsData, isLoading: loadingDocs } = useUserDocuments(); // /api/documents/user
  const { data: userLecsData, isLoading: loadingLecs } = useUserLectures(); // /api/lectures/user
  const { data: myCollectionsData, isLoading: loadingCols } = useMyCollectionsQuery({
    mine: true,
    page: 1,
    limit: 20,
  }); // /api/collections?mine=true

  const documents = React.useMemo(() => {
    if (!userDocsData) return [];
    if (Array.isArray(userDocsData)) return userDocsData;
    return userDocsData.documents || userDocsData.data || [];
  }, [userDocsData]);

  const lectures = React.useMemo(() => {
    if (!userLecsData) return [];
    if (Array.isArray(userLecsData)) return userLecsData;
    return userLecsData.lectures || userLecsData.data || [];
  }, [userLecsData]);

  const collections = React.useMemo(() => {
    if (!myCollectionsData) return [];
    // API trả về { collections, pagination }
    return myCollectionsData.collections || myCollectionsData.data || [];
  }, [myCollectionsData]);

  // ====== Mutations ======
  const { mutate: createDocument, isLoading: creatingDoc } = useCreateDocument();
  const { mutate: updateDocument, isLoading: updatingDoc } = useUpdateDocument();
  const { mutate: deleteDocument } = useDeleteDocument();

  const { mutate: createLecture, isLoading: creatingLec } = useCreateLecture();
  const { mutate: updateLecture, isLoading: updatingLec } = useUpdateLecture();
  const { mutate: deleteLecture } = useDeleteLecture();

  const { mutate: createCollection, isLoading: creatingCol } = useCreateCollection();
  const { mutate: updateCollection, isLoading: updatingCol } = useUpdateCollection();
  const { mutate: deleteCollection } = useDeleteCollection();

  // ====== UI State ======
  const [activeTab, setActiveTab] = React.useState("collections"); // "collections" | "documents" | "lectures"

  // Create/Edit modal states (single modal reused)
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editType, setEditType] = React.useState(null); // "document" | "lecture" | "collection"
  const [editingItem, setEditingItem] = React.useState(null);

  // View modals
  const [openVideo, setOpenVideo] = React.useState(false);
  const [viewVideo, setViewVideo] = React.useState(null);

  const [openCollectionView, setOpenCollectionView] = React.useState(false);
  const [viewCollectionId, setViewCollectionId] = React.useState(null);
  const { data: viewCollection } = useCollectionById(openCollectionView ? viewCollectionId : null);

  // ====== Forms ======
  const [docForm, setDocForm] = React.useState({
    title: "",
    description: "",
    file: null,
    isPublic: true,
    keywords: "",
  });

  const [lecForm, setLecForm] = React.useState({
    title: "",
    description: "",
    video: null,
    isPublic: true,
    keywords: "",
  });

  const [colForm, setColForm] = React.useState({
    title: "",
    subtitle: "",
    description: "",
    isPublic: true,
    keywords: "",
    cover: null,
  });

  // ====== Form Reset Functions ======
  const resetDocForm = () => {
    setDocForm({ title: "", description: "", file: null, isPublic: true, keywords: "" });
  };

  const resetLecForm = () => {
    setLecForm({ title: "", description: "", video: null, isPublic: true, keywords: "" });
  };

  const resetColForm = () => {
    setColForm({
      title: "",
      subtitle: "",
      description: "",
      isPublic: true,
      keywords: "",
      cover: null,
    });
  };

  const resetAllForms = () => {
    resetDocForm();
    resetLecForm();
    resetColForm();
  };

  // ====== Handlers: Create ======
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "documents") {
      if (!docForm.title || !docForm.file) return;
      const payload = {
        title: docForm.title,
        description: docForm.description,
        isPublic: docForm.isPublic,
        keywords: docForm.keywords
          ? docForm.keywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        file: docForm.file,
      };
      createDocument(payload, {
        onSuccess: () => {
          setOpenCreate(false);
          resetDocForm();
        },
      });
    } else if (activeTab === "lectures") {
      if (!lecForm.title || !lecForm.video) return;
      const payload = {
        title: lecForm.title,
        description: lecForm.description,
        isPublic: lecForm.isPublic,
        keywords: lecForm.keywords
          ? lecForm.keywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        video: lecForm.video,
      };
      createLecture(payload, {
        onSuccess: () => {
          setOpenCreate(false);
          resetLecForm();
        },
      });
    } else {
      if (!colForm.title) return;
      const fd = new FormData();
      fd.append("title", colForm.title);
      if (colForm.subtitle) fd.append("subtitle", colForm.subtitle);
      if (colForm.description) fd.append("description", colForm.description);
      fd.append("isPublic", String(colForm.isPublic));
      if (colForm.keywords) fd.append("keywords", colForm.keywords);
      if (colForm.cover) fd.append("cover", colForm.cover);

      createCollection(fd, {
        onSuccess: () => {
          setOpenCreate(false);
          resetColForm();
        },
      });
    }
  };

  // ====== Handlers: Edit ======
  const openEditModal = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    if (type === "document") {
      setDocForm({
        title: item.title || "",
        description: item.description || "",
        file: null,
        isPublic: item.isPublic ?? true,
        keywords: (item.keywords || []).join(","),
      });
    } else if (type === "lecture") {
      setLecForm({
        title: item.title || "",
        description: item.description || "",
        video: null,
        isPublic: item.isPublic ?? true,
        keywords: (item.keywords || []).join(","),
      });
    } else {
      setColForm({
        title: item.title || "",
        subtitle: item.subtitle || "",
        description: item.description || "",
        isPublic: item.isPublic ?? true,
        keywords: (item.keywords || []).join(","),
        cover: null,
      });
    }
    setOpenEdit(true);
  };

  // ====== Modal Handlers ======
  const handleCreateModalOpen = (tab) => {
    resetAllForms();
    setActiveTab(tab);
    setOpenCreate(true);
  };

  const handleCreateModalClose = () => {
    setOpenCreate(false);
    resetAllForms();
  };

  const handleEditModalClose = () => {
    setOpenEdit(false);
    setEditingItem(null);
    setEditType(null);
    resetAllForms();
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editType === "document") {
      const payload = {
        title: docForm.title,
        description: docForm.description,
        isPublic: docForm.isPublic,
        keywords: docForm.keywords
          ? docForm.keywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        file: docForm.file || undefined,
      };
      updateDocument(
        { id: editingItem._id, documentData: payload },
        {
          onSuccess: () => {
            setOpenEdit(false);
            setEditingItem(null);
          },
        }
      );
    } else if (editType === "lecture") {
      const payload = {
        title: lecForm.title,
        description: lecForm.description,
        isPublic: lecForm.isPublic,
        keywords: lecForm.keywords
          ? lecForm.keywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        video: lecForm.video || undefined,
      };
      updateLecture(
        { id: editingItem._id, lectureData: payload },
        {
          onSuccess: () => {
            setOpenEdit(false);
            setEditingItem(null);
          },
        }
      );
    } else {
      const formData =
        colForm.cover ||
        colForm.subtitle !== (editingItem.subtitle || "") ||
        colForm.title !== editingItem.title ||
        colForm.description !== (editingItem.description || "") ||
        colForm.isPublic !== (editingItem.isPublic ?? true) ||
        colForm.keywords !== (editingItem.keywords || []).join(",")
          ? (() => {
              const fd = new FormData();
              fd.append("title", colForm.title);
              if (colForm.subtitle) fd.append("subtitle", colForm.subtitle);
              if (colForm.description) fd.append("description", colForm.description);
              fd.append("isPublic", String(colForm.isPublic));
              if (colForm.keywords) fd.append("keywords", colForm.keywords);
              if (colForm.cover) fd.append("cover", colForm.cover);
              return fd;
            })()
          : new FormData();

      updateCollection(
        { id: editingItem._id, formData },
        {
          onSuccess: () => {
            setOpenEdit(false);
            setEditingItem(null);
          },
        }
      );
    }
  };

  // ====== Delete ======
  const handleDelete = (id, type) => {
    if (!window.confirm("Bạn có chắc muốn xóa mục này?")) return;
    if (type === "document") deleteDocument(id);
    else if (type === "lecture") deleteLecture(id);
    else deleteCollection(id);
  };

  // ====== View ======
  const openVideoModal = (lec) => {
    setViewVideo(lec);
    setOpenVideo(true);
  };

  const openCollectionModal = (col) => {
    setViewCollectionId(col._id);
    setOpenCollectionView(true);
  };

  // ====== UI ======
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      {/* Header / Welcome */}
{/* ====== Header / Welcome ====== */}
<header className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      
      {/* Avatar + Welcome text */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user?.name || "user"}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white/80 shadow-lg object-cover"
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">
            Chào mừng, {user?.name || "bạn học viên"}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-1">
            Quản lý Tài liệu, Bài giảng & Collections cá nhân
            {isRefreshing && (
              <span className="inline-flex items-center gap-2 ml-2 sm:ml-3">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang làm mới phiên…</span>
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
        <Button
          onClick={() => handleCreateModalOpen("documents")}
          className="bg-white text-blue-700 hover:bg-blue-50 font-semibold w-full sm:w-auto justify-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span>Tải tài liệu</span>
        </Button>

        <Button
          onClick={() => handleCreateModalOpen("lectures")}
          className="bg-white/90 text-indigo-700 hover:bg-white font-semibold w-full sm:w-auto justify-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span>Tải video</span>
        </Button>

        <Button
          onClick={() => handleCreateModalOpen("collections")}
          className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Tạo Collection</span>
        </Button>
      </div>
    </div>
  </div>
</header>


      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 bg-white dark:bg-gray-900 shadow-sm border border-gray-200/70 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tài liệu của tôi</p>
                <p className="text-3xl font-extrabold mt-1">{documents.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>
          <Card className="p-5 bg-white dark:bg-gray-900 shadow-sm border border-gray-200/70 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bài giảng của tôi</p>
                <p className="text-3xl font-extrabold mt-1">{lectures.length}</p>
              </div>
              <Video className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>
          <Card className="p-5 bg-white dark:bg-gray-900 shadow-sm border border-gray-200/70 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Collections</p>
                <p className="text-3xl font-extrabold mt-1">{collections.length}</p>
              </div>
              <Layers className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </Card>
          <Card className="p-5 bg-white dark:bg-gray-900 shadow-sm border border-gray-200/70 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer group">
            <Link to="/app/dashboard/saved">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Saved Items</p>
                  <p className="text-3xl font-extrabold mt-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    <BookmarkCheck className="w-8 h-8 inline" />
                  </p>
                </div>
                <BookmarkCheck className="w-10 h-10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </Card>
        </div>
      </div>

      {/* Quick Actions & Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Creative Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Browse Resources */}
            <Link to="/app/resources">
              <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Resources</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Explore collections, lectures & documents</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              </Card>
            </Link>

            {/* Q&A Community */}
            <Link to="/app/qa">
              <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Q&A Community</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ask questions & help others learn</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              </Card>
            </Link>

            {/* Saved Items */}
            <Link to="/app/dashboard/saved">
              <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BookmarkCheck className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Saved Items</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your bookmarked content</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              </Card>
            </Link>

            {/* Practice */}
            <Link to="/app/practice">
              <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Practice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Test your knowledge & skills</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              </Card>
            </Link>
          </div>
        </div>

        {/* My Content Section */}
<section className="mb-10">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        My Content
      </h3>
    </div>
    <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
  </div>

  {/* Tabs */}
  <div className="w-full overflow-x-auto">
    <div className="inline-flex min-w-max bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 shadow-inner border border-gray-200 dark:border-gray-700">
      {[
        { key: "collections", label: "Collections", icon: Layers },
        { key: "documents", label: "Documents", icon: FileText },
        { key: "lectures", label: "Lectures", icon: Video },
      ].map((t) => {
        const IconComponent = t.icon;
        const isActive = activeTab === t.key;

        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`
              flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold whitespace-nowrap transition-all
              ${isActive
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  </div>
</section>

      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Collections */}
        {activeTab === "collections" && (
          <>
            {loadingCols ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="h-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
                  />
                ))}
              </div>
            ) : collections.length === 0 ? (
              <Card className="p-10 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <Layers className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                <h3 className="text-lg md:text-xl font-semibold">Chưa có collection nào</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tạo collection để nhóm bài giảng và tài liệu theo chủ đề.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => (
                  <Card
                    key={col._id}
                    className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base md:text-lg truncate">
                          {col.title}
                        </h3>
                        {col.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {col.description}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Public: {col.isPublic ? "Yes" : "No"}</span>
                          {col.stats && (
                            <>
                              <span>Lectures: {col.stats.lectures}</span>
                              <span>Documents: {col.stats.documents}</span>
                              <span>Total: {col.stats.totalItems}</span>
                            </>
                          )}
                          {col.createdAt && (
                            <span>
                              <Calendar className="inline w-3 h-3 mr-1" />
                              {new Date(col.createdAt).toLocaleDateString()}
                            </span>
                          )}
                          {col.createdBy?.name && (
                            <span className="truncate">
                              <User className="inline w-3 h-3 mr-1" />
                              {col.createdBy.name}
                            </span>
                          )}
                        </div>
                        {col.keywords?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {col.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {col.coverUrl ? (
                          <img
                            src={col.coverUrl}
                            alt="cover"
                            className="w-20 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                          />
                        ) : (
                          <div className="w-20 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <Button size="sm" variant="outline" onClick={() => openCollectionModal(col)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditModal(col, "collection")}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(col._id, "collection")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Documents */}
        {activeTab === "documents" && (
          <>
            {loadingDocs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="h-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
                  />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <Card className="p-10 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <FileText className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <h3 className="text-lg md:text-xl font-semibold">Chưa có tài liệu</h3>
                <p className="text-gray-600 dark:text-gray-300">Hãy tải tài liệu đầu tiên của bạn.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Card
                    key={doc._id}
                    className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {badgeByMime(doc.mimeType)}
                          </span>
                          {doc.fileSize ? (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatSize(doc.fileSize)}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-semibold text-base md:text-lg mt-2 line-clamp-2">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {doc.description}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                          {doc.createdAt && (
                            <span>
                              <Calendar className="inline w-3 h-3 mr-1" />
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          )}
                          {doc.createdBy?.name && (
                            <span className="truncate">
                              <User className="inline w-3 h-3 mr-1" />
                              {doc.createdBy.name}
                            </span>
                          )}
                          <span>Public: {doc.isPublic ? "Yes" : "No"}</span>
                        </div>
                        {doc.keywords?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {doc.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          {doc.fileUrl && (
                            <Button asChild size="sm" variant="outline">
                              <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => openEditModal(doc, "document")}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(doc._id, "document")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Lectures */}
        {activeTab === "lectures" && (
          <>
            {loadingLecs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="h-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
                  />
                ))}
              </div>
            ) : lectures.length === 0 ? (
              <Card className="p-10 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <Video className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                <h3 className="text-lg md:text-xl font-semibold">Chưa có bài giảng</h3>
                <p className="text-gray-600 dark:text-gray-300">Tải lên video bài giảng để bắt đầu.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lec) => (
                  <Card
                    key={lec._id}
                    className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition group"
                  >
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                      onClick={() => openVideoModal(lec)}
                    >
                      {lec.videoUrl ? (
                        <video src={lec.videoUrl} className="w-full h-full object-cover pointer-events-none" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Video className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">
                        {badgeByMime(lec.mimeType, "VIDEO")}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                      <Play className="absolute w-10 h-10 text-white/90 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2">{lec.title}</h3>
                        {lec.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {lec.description}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                          {lec.fileSize ? <span>{formatSize(lec.fileSize)}</span> : null}
                          {lec.createdAt && (
                            <span>
                              <Calendar className="inline w-3 h-3 mr-1" />
                              {new Date(lec.createdAt).toLocaleDateString()}
                            </span>
                          )}
                          <span>Public: {lec.isPublic ? "Yes" : "No"}</span>
                        </div>
                        {lec.keywords?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {lec.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(lec, "lecture")}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(lec._id, "lecture")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ====== Create Modal (reused by tab) ====== */}
      <AnimatePresence>
        {openCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0" onClick={handleCreateModalClose} />
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeTab === "documents" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : activeTab === "lectures" 
                        ? "bg-purple-100 dark:bg-purple-900/30" 
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {activeTab === "documents" ? (
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : activeTab === "lectures" ? (
                        <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeTab === "documents"
                          ? "Tải tài liệu mới"
                          : activeTab === "lectures"
                          ? "Tải video bài giảng mới"
                          : "Tạo Collection mới"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activeTab === "collections"
                          ? "Tạo collection để nhóm các bài giảng và tài liệu theo chủ đề"
                          : "Điền thông tin và chọn file để tải lên"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCreateModalClose} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
            {activeTab === "documents" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề tài liệu *
                  </label>
                  <input 
                    required
                    value={docForm.title}
                    onChange={(e) => setDocForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề tài liệu"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <textarea 
                    value={docForm.description}
                    onChange={(e) => setDocForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả ngắn về nội dung tài liệu"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    File tài liệu * (PDF/Word)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input 
                      type="file"
                      required
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setDocForm((s) => ({ ...s, file: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="docFile"
                    />
                    <label htmlFor="docFile" className="cursor-pointer">
                      <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn file hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)
                      </p>
                    </label>
                  </div>
                  {docForm.file && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{docForm.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setDocForm((s) => ({ ...s, file: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="toeic, starter, grammar (phân cách bằng dấu phẩy)"
                    value={docForm.keywords}
                    onChange={(e) => setDocForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy tài liệu của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={docForm.isPublic}
                    onCheckedChange={(v) => setDocForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem tài liệu này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCreateModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creatingDoc} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingDoc ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang tải...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="w-5 h-5 mr-2" />
                        Tải tài liệu
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "lectures" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề bài giảng *
                  </label>
                  <input 
                    required
                    value={lecForm.title}
                    onChange={(e) => setLecForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề bài giảng"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <textarea 
                    value={lecForm.description}
                    onChange={(e) => setLecForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả nội dung bài giảng"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Video bài giảng * (MP4, AVI, MOV)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input 
                      type="file"
                      required
                      accept="video/*"
                      onChange={(e) => setLecForm((s) => ({ ...s, video: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="lecVideo"
                    />
                    <label htmlFor="lecVideo" className="cursor-pointer">
                      <Video className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn video hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Hỗ trợ: MP4, AVI, MOV (tối đa 100MB)
                      </p>
                    </label>
                  </div>
                  {lecForm.video && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{lecForm.video.name}</span>
                        <button
                          type="button"
                          onClick={() => setLecForm((s) => ({ ...s, video: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="listening, practice, grammar (phân cách bằng dấu phẩy)"
                    value={lecForm.keywords}
                    onChange={(e) => setLecForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy bài giảng của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={lecForm.isPublic}
                    onCheckedChange={(v) => setLecForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem bài giảng này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCreateModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creatingLec} 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingLec ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang tải...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="w-5 h-5 mr-2" />
                        Tải video
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "collections" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề collection *
                  </label>
                  <input 
                    required
                    value={colForm.title}
                    onChange={(e) => setColForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề collection"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Subtitle (tùy chọn)
                  </label>
                  <input 
                    value={colForm.subtitle}
                    onChange={(e) => setColForm((s) => ({ ...s, subtitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Tiêu đề phụ (tùy chọn)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả collection
                  </label>
                  <textarea 
                    value={colForm.description}
                    onChange={(e) => setColForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả về collection này"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cover image (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setColForm((s) => ({ ...s, cover: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="colCover"
                    />
                    <label htmlFor="colCover" className="cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn ảnh hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                      </p>
                    </label>
                  </div>
                  {colForm.cover && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{colForm.cover.name}</span>
                        <button
                          type="button"
                          onClick={() => setColForm((s) => ({ ...s, cover: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="toeic, starter, playlist (phân cách bằng dấu phẩy)"
                    value={colForm.keywords}
                    onChange={(e) => setColForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy collection của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={colForm.isPublic}
                    onCheckedChange={(v) => setColForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem collection này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCreateModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creatingCol} 
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingCol ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang tạo...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Tạo Collection
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== Edit Modal ====== */}
      <AnimatePresence>
        {openEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0" onClick={handleEditModalClose} />
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      editType === "document" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : editType === "lecture" 
                        ? "bg-purple-100 dark:bg-purple-900/30" 
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {editType === "document" ? (
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : editType === "lecture" ? (
                        <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Chỉnh sửa {editType === "document" ? "Tài liệu" : editType === "lecture" ? "Bài giảng" : "Collection"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Cập nhật thông tin và nội dung
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleEditModalClose} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
            {editType === "document" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề tài liệu *
                  </label>
                  <input 
                    required
                    value={docForm.title}
                    onChange={(e) => setDocForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề tài liệu"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <textarea 
                    value={docForm.description}
                    onChange={(e) => setDocForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả ngắn về nội dung tài liệu"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thay file (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input 
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setDocForm((s) => ({ ...s, file: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="editDocFile"
                    />
                    <label htmlFor="editDocFile" className="cursor-pointer">
                      <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn file mới hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Để trống nếu không muốn thay đổi file
                      </p>
                    </label>
                  </div>
                  {docForm.file && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{docForm.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setDocForm((s) => ({ ...s, file: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="toeic, starter, grammar (phân cách bằng dấu phẩy)"
                    value={docForm.keywords}
                    onChange={(e) => setDocForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy tài liệu của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={docForm.isPublic}
                    onCheckedChange={(v) => setDocForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem tài liệu này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleEditModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updatingDoc} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingDoc ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Lưu thay đổi
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}

            {editType === "lecture" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề bài giảng *
                  </label>
                  <input 
                    required
                    value={lecForm.title}
                    onChange={(e) => setLecForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề bài giảng"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <textarea 
                    value={lecForm.description}
                    onChange={(e) => setLecForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả nội dung bài giảng"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thay video (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input 
                      type="file"
                      accept="video/*"
                      onChange={(e) => setLecForm((s) => ({ ...s, video: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="editLecVideo"
                    />
                    <label htmlFor="editLecVideo" className="cursor-pointer">
                      <Video className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn video mới hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Để trống nếu không muốn thay đổi video
                      </p>
                    </label>
                  </div>
                  {lecForm.video && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{lecForm.video.name}</span>
                        <button
                          type="button"
                          onClick={() => setLecForm((s) => ({ ...s, video: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="listening, practice, grammar (phân cách bằng dấu phẩy)"
                    value={lecForm.keywords}
                    onChange={(e) => setLecForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy bài giảng của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={lecForm.isPublic}
                    onCheckedChange={(v) => setLecForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem bài giảng này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleEditModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updatingLec} 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingLec ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Lưu thay đổi
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}

            {editType === "collection" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiêu đề collection *
                  </label>
                  <input 
                    required
                    value={colForm.title}
                    onChange={(e) => setColForm((s) => ({ ...s, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Nhập tiêu đề collection"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Subtitle (tùy chọn)
                  </label>
                  <input 
                    value={colForm.subtitle}
                    onChange={(e) => setColForm((s) => ({ ...s, subtitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Tiêu đề phụ (tùy chọn)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mô tả collection
                  </label>
                  <textarea 
                    value={colForm.description}
                    onChange={(e) => setColForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[100px] transition-colors"
                    rows={3}
                    placeholder="Mô tả về collection này"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thay cover image (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setColForm((s) => ({ ...s, cover: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="editColCover"
                    />
                    <label htmlFor="editColCover" className="cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nhấp để chọn ảnh mới hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Để trống nếu không muốn thay đổi cover
                      </p>
                    </label>
                  </div>
                  {colForm.cover && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{colForm.cover.name}</span>
                        <button
                          type="button"
                          onClick={() => setColForm((s) => ({ ...s, cover: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Keywords (tùy chọn)
                  </label>
                  <input 
                    placeholder="toeic, starter, playlist (phân cách bằng dấu phẩy)"
                    value={colForm.keywords}
                    onChange={(e) => setColForm((s) => ({ ...s, keywords: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thêm keywords để giúp người khác dễ dàng tìm thấy collection của bạn
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Switch
                    checked={colForm.isPublic}
                    onCheckedChange={(v) => setColForm((s) => ({ ...s, isPublic: v }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Công khai</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho phép mọi người xem collection này</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleEditModalClose} 
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updatingCol} 
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingCol ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Lưu thay đổi
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== Video Preview Modal ====== */}
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background text-foreground border border-border dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewVideo?.title}</span>
              <Button size="icon" variant="ghost" onClick={() => setOpenVideo(false)}>
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
            {viewVideo?.description ? (
              <DialogDescription>{viewVideo.description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {viewVideo?.videoUrl ? (
              <video src={viewVideo.videoUrl} controls className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Video className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 flex flex-wrap gap-4">
            {viewVideo?.fileSize ? <span>{formatSize(viewVideo.fileSize)}</span> : null}
            {viewVideo?.createdAt ? (
              <span>
                <Calendar className="inline w-3 h-3 mr-1" />
                {new Date(viewVideo.createdAt).toLocaleString()}
              </span>
            ) : null}
            <span>Public: {viewVideo?.isPublic ? "Yes" : "No"}</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====== Collection Detail Modal ====== */}
      <Dialog open={openCollectionView} onOpenChange={setOpenCollectionView}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background text-foreground border border-border dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle>{viewCollection?.title || "Collection"}</DialogTitle>
            {viewCollection?.description ? (
              <DialogDescription>{viewCollection.description}</DialogDescription>
            ) : null}
          </DialogHeader>

          {/* Header info */}
          <div className="flex items-start gap-4">
            {viewCollection?.coverUrl ? (
              <img
                src={viewCollection.coverUrl}
                alt="cover"
                className="w-28 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
              />
            ) : (
              <div className="w-28 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
                <span>Public: {viewCollection?.isPublic ? "Yes" : "No"}</span>
                {viewCollection?.stats && (
                  <>
                    <span>Lectures: {viewCollection.stats.lectures}</span>
                    <span>Documents: {viewCollection.stats.documents}</span>
                    <span>Total: {viewCollection.stats.totalItems}</span>
                  </>
                )}
                {viewCollection?.createdAt ? (
                  <span>
                    <Calendar className="inline w-3 h-3 mr-1" />
                    {new Date(viewCollection.createdAt).toLocaleString()}
                  </span>
                ) : null}
                {viewCollection?.createdBy?.name ? (
                  <span className="truncate">
                    <User className="inline w-3 h-3 mr-1" />
                    {viewCollection.createdBy.name}
                  </span>
                ) : null}
              </div>
              {viewCollection?.keywords?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {viewCollection.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Items */}
          <div className="mt-4 space-y-3">
            {viewCollection?.items?.length ? (
              viewCollection.items.map((it, idx) => (
                <Card
                  key={`${it.kind}-${it.ref}-${idx}`}
                  className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {it.kind}
                      </div>
                      <div className="font-semibold line-clamp-2">
                        {it.title || it.titleOverride || it.ref}
                      </div>
                      {it.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                          {it.description}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                        {typeof it.fileSize === "number" && <span>{formatSize(it.fileSize)}</span>}
                        {it.mimeType && <span>{badgeByMime(it.mimeType)}</span>}
                        {it.order !== undefined && <span>Order: {it.order}</span>}
                      </div>
                    </div>
                    {/* Action xem nhanh nếu là lecture/document có URL */}
                    {it.kind === "lecture" && it.videoUrl ? (
                      <Button size="sm" variant="outline" onClick={() => openVideoModal(it)}>
                        <Play className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                    ) : it.kind === "document" && it.fileUrl ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={it.fileUrl} target="_blank" rel="noreferrer">
                          <Eye className="w-4 h-4 mr-1" />
                          Mở
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Chưa có items trong collection này.
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
