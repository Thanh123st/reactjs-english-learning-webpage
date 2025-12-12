import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSaved } from "@/hooks/useSaved";
import { useRemoveSavedItem } from "@/hooks/useSaved";
import { 
  BookmarkCheck, 
  Calendar, 
  User, 
  Video, 
  FileText, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Download, 
  Play,
  Tag,
  MessageCircle,
  X,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { useCollectionById } from "@/hooks/useCollections";

export default function SavedList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const { data, isLoading } = useSaved({ page, limit });
  const { mutate: removeSavedItem } = useRemoveSavedItem();

  // Modal states
  const [openLecture, setOpenLecture] = React.useState(null);
  const [openCollectionId, setOpenCollectionId] = React.useState(null);
  const [collectionTab, setCollectionTab] = React.useState("lectures");

  // Fetch collection details
  const { data: collectionDetailResp, isLoading: loadingCollectionDetail } =
    useCollectionById(openCollectionId, { enabled: !!openCollectionId });

  const collectionDetail = React.useMemo(() => {
    if (!collectionDetailResp) return null;
    if (Array.isArray(collectionDetailResp)) return null;
    return collectionDetailResp.collection || collectionDetailResp.data || collectionDetailResp;
  }, [collectionDetailResp]);

  // Reset tab when opening collection
  React.useEffect(() => {
    if (openCollectionId) setCollectionTab("lectures");
  }, [openCollectionId]);

  const savedItems = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.items || data.data || [];
  }, [data]);

  // Separate items by type
  const collections = React.useMemo(() => {
    return savedItems.filter(item => item.kind === 'collection');
  }, [savedItems]);

  const lectures = React.useMemo(() => {
    return savedItems.filter(item => item.kind === 'lecture');
  }, [savedItems]);

  const documents = React.useMemo(() => {
    return savedItems.filter(item => item.kind === 'document');
  }, [savedItems]);

  const questions = React.useMemo(() => {
    return savedItems.filter(item => item.kind === 'question');
  }, [savedItems]);

  const pagination = React.useMemo(() => {
    if (!data || Array.isArray(data)) return null;
    return data.pagination || data.meta || null;
  }, [data]);

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  };

  const handleRemoveSavedItem = (ref, kind) => {
    removeSavedItem({ ref, kind }, {
      onSuccess: () => {
        toast.success("Đã bỏ lưu thành công!");
      },
      onError: (error) => {
        console.error('Error removing saved item:', error);
        toast.error("Có lỗi xảy ra khi bỏ lưu!");
      }
    });
  };


  const getItemTypeLabel = (kind) => {
    switch (kind) {
      case 'collection': return 'Collection';
      case 'lecture': return 'Video Lecture';
      case 'document': return 'Document';
      case 'question': return 'Question';
      default: return 'Item';
    }
  };


  // Helper functions from Resources.jsx
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

  const getTypeBadge = (mime, fallback = "FILE") => {
    if (!mime) return fallback;
    const tail = mime.split("/")[1]?.toUpperCase() || "";
    if (mime.includes("pdf")) return "PDF";
    if (mime.includes("word") || ["DOC", "DOCX"].includes(tail)) return "WORD";
    if (mime.includes("video")) return tail || "VIDEO";
    return tail || fallback;
  };

  // Reusable card component
  const renderCard = (item) => {
    const typeLabel = getItemTypeLabel(item.kind);
    
    return (
      <Card key={`${item.kind}-${item.ref}`} className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
        {/* Collection Card */}
        {item.kind === 'collection' && (
          <>
            <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              {item.coverUrl ? (
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Layers className="w-10 h-10" />
                </div>
              )}
              {item.stats?.totalItems != null && (
                <div className="absolute top-2 right-2 text-[10px] md:text-xs bg-black/70 text-white px-2 py-1 rounded">
                  {item.stats.totalItems} items
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2">
                {item.title || `${typeLabel} ${item.ref}`}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {item.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {item.stats && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      {item.stats.lectures || 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {item.stats.documents || 0}
                    </span>
                  </>
                )}
                {item.createdAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {item.createdBy?.name && (
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{item.createdBy.name}</span>
                  </span>
                )}
                {item.isPublic && (
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Public
                  </span>
                )}
              </div>

              {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.keywords.slice(0, 5).map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 inline-flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" /> {kw}
                    </span>
                  ))}
                </div>
              )}

                          <div className="mt-5 flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => setOpenCollectionId(item.ref)}
                              title="View collection details"
                            >
                              <Layers className="w-4 h-4 mr-2" />
                              View Collection
                            </Button>
                <button
                  onClick={() => handleRemoveSavedItem(item.ref, item.kind)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Lecture Card */}
        {item.kind === 'lecture' && (
          <>
            <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
              <div className="w-full h-full flex items-center justify-center text-purple-500">
                <Video className="w-10 h-10" />
              </div>
              {item.mimeType && (
                <div className="absolute top-2 right-2 text-[10px] md:text-xs bg-black/70 text-white px-2 py-1 rounded">
                  {getTypeBadge(item.mimeType, "VIDEO")}
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {item.title || `${typeLabel} ${item.ref}`}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                {item.fileSize ? (
                  <span className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {formatSize(item.fileSize)}
                  </span>
                ) : null}
                {item.createdAt ? (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                ) : null}
                {item.createdBy?.name ? (
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {item.createdBy.name}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpenLecture(item)}
                  title="Preview video"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch
                </Button>
                <button
                  onClick={() => handleRemoveSavedItem(item.ref, item.kind)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Document Card */}
        {item.kind === 'document' && (
          <>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                      {getTypeBadge(item.mimeType)}
                    </span>
                  </div>
                </div>
                {item.fileSize ? (
                  <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatSize(item.fileSize)}
                  </span>
                ) : null}
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.title || `${typeLabel} ${item.ref}`}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                {item.createdAt ? (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                ) : null}
                {item.createdBy?.name ? (
                  <span className="flex items-center min-w-0">
                    <User className="w-3 h-3 mr-1" />
                    <span className="truncate">{item.createdBy.name}</span>
                  </span>
                ) : null}
              </div>

              {item.fileUrl && (
                <div className="mt-5 flex gap-2">
                  <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <button
                    onClick={() => handleRemoveSavedItem(item.ref, item.kind)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Question Card */}
        {item.kind === 'question' && (
          <>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Question
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSavedItem(item.ref, item.kind)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 mb-2">
                {item.title || `Question ${item.ref}`}
              </h3>
              
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                {item.createdAt && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
                {item.createdBy?.name && (
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {item.createdBy.name}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/app/qa/${item.ref}`}>
                    <Eye className="w-4 h-4 mr-2" /> View Question
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Helmet>
        <title>Saved Items | Dashboard</title>
      </Helmet>

      {/* Header */}
      <section className="py-8 md:py-12 md:pb-0 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Saved Items</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Những gì bạn đã lưu để xem lại sau</p>
            </div>
            <Link to="/app/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">
              Saved <span className="text-amber-600 dark:text-amber-400">Collections</span>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {collections.length} collection{collections.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Layers className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No collections saved</h3>
              <p className="text-gray-600 dark:text-gray-300">Start saving collections to see them here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </section>

      {/* Lectures Section */}
      <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">
              Saved <span className="text-purple-600 dark:text-purple-400">Lectures</span>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {lectures.length} lecture{lectures.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Video className="w-12 h-12 mx-auto mb-3 text-purple-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No lectures saved</h3>
              <p className="text-gray-600 dark:text-gray-300">Start saving lectures to see them here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">
              Saved <span className="text-blue-600 dark:text-blue-400">Documents</span>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {documents.length} document{documents.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No documents saved</h3>
              <p className="text-gray-600 dark:text-gray-300">Start saving documents to see them here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">
              Saved <span className="text-green-600 dark:text-green-400">Questions</span>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {questions.length} question{questions.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No questions saved</h3>
              <p className="text-gray-600 dark:text-gray-300">Start saving questions to see them here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.totalItems)} of {pagination.totalItems} items
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-300 px-3">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      {openLecture && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenLecture(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {openLecture.title || "Lecture"}
                </h3>
                <button onClick={() => setOpenLecture(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400" title="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto max-h-[78vh]">
                {openLecture.videoUrl ? (
                  <div className="aspect-video bg-black/80 rounded-lg overflow-hidden">
                    <video src={openLecture.videoUrl} controls className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                )}
                {openLecture.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{openLecture.description}</p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-300">
                  {openLecture.mimeType && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {getTypeBadge(openLecture.mimeType, "VIDEO")}
                    </span>
                  )}
                  {openLecture.fileSize && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {formatSize(openLecture.fileSize)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Modal */}
      {openCollectionId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenCollectionId(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {collectionDetail?.coverUrl ? (
                    <img src={collectionDetail.coverUrl} alt={collectionDetail?.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Layers className="w-7 h-7" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                    {collectionDetail?.title || "Collection"}
                  </h3>
                  {collectionDetail?.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {collectionDetail.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {collectionDetail?.stats && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {collectionDetail.stats.lectures || 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {collectionDetail.stats.documents || 0}
                        </span>
                      </>
                    )}
                    {collectionDetail?.createdBy?.name && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {collectionDetail.createdBy.name}
                      </span>
                    )}
                    {collectionDetail?.createdAt && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(collectionDetail.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {collectionDetail?.updatedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {new Date(collectionDetail.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                    {collectionDetail?.isPublic && (
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Public
                      </span>
                    )}
                  </div>

                  {Array.isArray(collectionDetail?.keywords) && collectionDetail.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {collectionDetail.keywords.slice(0, 6).map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 inline-flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" /> {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenCollectionId(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-5 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCollectionTab("lectures")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      collectionTab === "lectures"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Lectures
                  </button>
                  <button
                    onClick={() => setCollectionTab("documents")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      collectionTab === "documents"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Documents
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 pb-5 overflow-y-auto max-h-[58vh]">
                {loadingCollectionDetail ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                ) : !collectionDetail ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">Not found.</div>
                ) : (
                  <>
                    {/* Lectures list */}
                    {collectionTab === "lectures" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(collectionDetail.items || [])
                          .filter((it) => it.kind === "lecture")
                          .map((it, idx) => (
                            <Card key={`${it.ref}-${idx}`} className="p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                  <Video className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                      {it.title || "Lecture"}
                                    </h4>
                                    {it.mimeType && (
                                      <span className="text-[10px] md:text-xs bg-black/80 text-white px-2 py-1 rounded">
                                        {getTypeBadge(it.mimeType, "VIDEO")}
                                      </span>
                                    )}
                                  </div>
                                  {it.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                                      {it.description}
                                    </p>
                                  )}
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    {it.fileSize ? (
                                      <span className="inline-flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        {formatSize(it.fileSize)}
                                      </span>
                                    ) : null}
                                    {Array.isArray(it.keywords) && it.keywords.length > 0 && (
                                      <span className="inline-flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {it.keywords.slice(0, 2).join(", ")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-3 flex gap-2">
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() =>
                                        setOpenLecture({
                                          _id: it.ref,
                                          title: it.title,
                                          description: it.description,
                                          videoUrl: it.videoUrl,
                                          mimeType: it.mimeType,
                                          fileSize: it.fileSize,
                                        })
                                      }
                                    >
                                      <Play className="w-4 h-4 mr-2" />
                                      Watch
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        {(collectionDetail.items || []).filter((it) => it.kind === "lecture").length === 0 && (
                          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
                            No lectures in this collection.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Documents list */}
                    {collectionTab === "documents" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(collectionDetail.items || [])
                          .filter((it) => it.kind === "document")
                          .map((it, idx) => (
                            <Card key={`${it.ref}-${idx}`} className="p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                      {it.title || "Document"}
                                    </h4>
                                    {it.mimeType && (
                                      <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                        {getTypeBadge(it.mimeType)}
                                      </span>
                                    )}
                                  </div>
                                  {it.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                                      {it.description}
                                    </p>
                                  )}
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    {it.fileSize ? (
                                      <span className="inline-flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        {formatSize(it.fileSize)}
                                      </span>
                                    ) : null}
                                    {Array.isArray(it.keywords) && it.keywords.length > 0 && (
                                      <span className="inline-flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {it.keywords.slice(0, 2).join(", ")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-3 flex gap-2">
                                    {it.fileUrl && (
                                      <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <a href={it.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                                          <Download className="w-4 h-4 mr-2" />
                                          Download
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        {(collectionDetail.items || []).filter((it) => it.kind === "document").length === 0 && (
                          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
                            No documents in this collection.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
