import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl } from "@/utils/seoUtils";
import { useSaveItem, useRemoveSavedItem } from "@/hooks/useSaved";
import toast from 'react-hot-toast';

// ===== Hooks GET =====
import { useCollections, useCollectionById } from "@/hooks/useCollections";
import { usePublicDocuments } from "@/hooks/useDocument";
import { usePublicLectures } from "@/hooks/useLecture";

import {
  FileText,
  BookOpen,
  Video,
  Search,
  Rocket,
  Star,
  Calendar,
  User,
  Download,
  Play,
  Layers,
  Clock,
  Tag,
  Eye,
  X,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

export default function Resources() {
  const resourcesSeo = PAGE_SEO.RESOURCES;

  // ======= Save/Unsave hooks =======
  const { mutate: saveItem } = useSaveItem();
  const { mutate: removeSavedItem } = useRemoveSavedItem();

  // ======= Data hooks (GET only) =======
  const { data: collectionsResp, isLoading: loadingCollections } = useCollections({
    mine: false,
    page: 1,
    limit: 20,
  });

  const { data: publicLecturesData, isLoading: loadingLectures } = usePublicLectures({ page: 1, limit: 6 });
  const { data: publicDocsData, isLoading: loadingDocs } = usePublicDocuments({ page: 1, limit: 6 });

  const collections = React.useMemo(() => {
    if (!collectionsResp) return [];
    if (Array.isArray(collectionsResp)) return collectionsResp;
    const list = collectionsResp.collections || collectionsResp.data || [];
    return list.slice(0, 6);
  }, [collectionsResp]);

  const lectures = React.useMemo(() => {
    if (!publicLecturesData) return [];
    if (Array.isArray(publicLecturesData)) return publicLecturesData;
    const list = publicLecturesData.lectures || publicLecturesData.data || [];
    return list.slice(0, 6);
  }, [publicLecturesData]);

  const documents = React.useMemo(() => {
    if (!publicDocsData) return [];
    if (Array.isArray(publicDocsData)) return publicDocsData;
    const list = publicDocsData.documents || publicDocsData.data || [];
    return list.slice(0, 6);
  }, [publicDocsData]);

  // ======= UI helpers =======
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

  const getTypeBadge = (mime, fallback = "DOCUMENT") => {
    if (!mime) return fallback;
    const tail = mime.split("/")[1] ? mime.split("/")[1].toUpperCase() : "";
    if (mime.includes("pdf")) return "PDF";
    if (mime.includes("word") || tail === "DOC" || tail === "DOCX") return "WORD";
    if (mime.includes("video")) return tail || "VIDEO";
    return tail || fallback;
  };

  // ======= Local state: Modals =======
  const [openCollectionId, setOpenCollectionId] = React.useState(null);
  const [openLecture, setOpenLecture] = React.useState(null); // lecture object to preview

  const { data: collectionDetailResp, isLoading: loadingCollectionDetail } =
    useCollectionById(openCollectionId, { enabled: !!openCollectionId });

  const collectionDetail = React.useMemo(() => {
    if (!collectionDetailResp) return null;
    // chuẩn theo GET /api/collections/:id
    return collectionDetailResp.collection || collectionDetailResp.data || collectionDetailResp;
  }, [collectionDetailResp]);

  const [collectionTab, setCollectionTab] = React.useState("lectures"); // "lectures" | "documents"

  React.useEffect(() => {
    if (openCollectionId) setCollectionTab("lectures");
  }, [openCollectionId]);

  // ======= Save/Unsave handlers =======
  const handleSaveItem = (kind, ref) => {
    saveItem({ kind, ref }, {
      onSuccess: () => {
        toast.success('Đã lưu vào danh sách yêu thích!');
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi lưu. Vui lòng thử lại.');
        console.error('Error saving item:', error);
      }
    });
  };

  const handleRemoveSavedItem = (kind, ref) => {
    removeSavedItem({ kind, ref }, {
      onSuccess: () => {
        toast.success('Đã bỏ lưu khỏi danh sách yêu thích!');
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi bỏ lưu. Vui lòng thử lại.');
        console.error('Error removing saved item:', error);
      }
    });
  };

  // ======= Render =======
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <Helmet>
        <title>{resourcesSeo.title.vi}</title>
        <meta name="description" content={resourcesSeo.description.vi} />
        <meta name="keywords" content={resourcesSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl("/resources")} />

        {/* Open Graph */}
        <meta property="og:title" content={resourcesSeo.title.en} />
        <meta property="og:description" content={resourcesSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl("/resources")} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-resources.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={resourcesSeo.title.vi} />
        <meta name="twitter:description" content={resourcesSeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-resources.jpg`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Study <span className="text-yellow-300">Resources</span>
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Collections, Lectures & Documents — curated for your English journey
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl md:text-4xl font-bold">
                Public <span className="text-amber-600 dark:text-amber-400">Collections</span>
              </h2>
              <Link to="/app/resources/collections">
                <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 dark:text-amber-300">
                  View all
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Grouped learning tracks with lectures & documents
            </p>
          </div>

          {loadingCollections ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Layers className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No collections yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back soon.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Card
                  key={col._id}
                  className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
                >
                  <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                    {col.coverUrl ? (
                      <img
                        src={col.coverUrl}
                        alt={col.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Layers className="w-10 h-10" />
                      </div>
                    )}
                    {col.stats?.totalItems != null && (
                      <div className="absolute top-2 right-2 text-[10px] md:text-xs bg-black/70 text-white px-2 py-1 rounded">
                        {col.stats.totalItems} items
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2">
                      {col.title}
                    </h3>
                    {col.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {col.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {col.stats && (
                        <>
                          <span className="inline-flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {col.stats.lectures || 0}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {col.stats.documents || 0}
                          </span>
                        </>
                      )}
                      {col.createdAt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(col.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {col.createdBy?.name && (
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[140px]">{col.createdBy.name}</span>
                        </span>
                      )}
                      {col.isPublic && (
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Public
                        </span>
                      )}
                    </div>

                    {/* Keywords */}
                    {Array.isArray(col.keywords) && col.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {col.keywords.slice(0, 5).map((kw, idx) => (
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
                        onClick={() => setOpenCollectionId(col._id)}
                        title="View collection details"
                      >
                        <Layers className="w-4 h-4 mr-2" />
                        View Collection
                      </Button>
                      <button
                        onClick={() => col.isSaved ? handleRemoveSavedItem("collection", col._id) : handleSaveItem("collection", col._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title={col.isSaved ? "Remove from saved" : "Save collection"}
                      >
                        {col.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lectures */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-4">
              <Video className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl md:text-4xl font-bold">
                Free <span className="text-purple-600 dark:text-purple-400">Video Lectures</span>
              </h2>
              <Link to="/app/resources/lectures">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 dark:text-purple-300">
                  View all
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              High-quality recordings across topics like Listening, Speaking, Grammar…
            </p>
          </div>

          {loadingLectures ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Video className="w-12 h-12 mx-auto mb-3 text-purple-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No lectures available yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back soon for new content.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lec) => (
                <Card
                  key={lec._id}
                  className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
                >
                  <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                    {lec.videoUrl ? (
                      <div className="w-full h-full flex items-center justify-center text-purple-500">
                        <Video className="w-10 h-10" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-500">
                        <Video className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 text-[10px] md:text-xs bg-black/70 text-white px-2 py-1 rounded">
                      {getTypeBadge(lec.mimeType, "VIDEO")}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {lec.title}
                    </h3>
                    {lec.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{lec.description}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                      {lec.fileSize ? (
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {formatSize(lec.fileSize)}
                        </span>
                      ) : null}
                      {lec.createdAt ? (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(lec.createdAt).toLocaleDateString()}
                        </span>
                      ) : null}
                      {lec.createdBy?.name ? (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {lec.createdBy.name}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setOpenLecture(lec)}
                        title="Preview video"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                      <button
                        onClick={() => lec.isSaved ? handleRemoveSavedItem("lecture", lec._id) : handleSaveItem("lecture", lec._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title={lec.isSaved ? "Remove from saved" : "Save lecture"}
                      >
                        {lec.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Documents */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl md:text-4xl font-bold">
                Free <span className="text-blue-600 dark:text-blue-400">Study Documents</span>
              </h2>
              <Link to="/app/resources/documents">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 dark:text-blue-300">
                  View all
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Download PDFs, Word files, worksheets and more</p>
          </div>

          {loadingDocs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-28 bg-white dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card className="p-10 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-1">No documents available yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back soon for new study materials.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card
                  key={doc._id}
                  className="group border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                            {getTypeBadge(doc.mimeType)}
                          </span>
                        </div>
                      </div>
                      {doc.fileSize ? (
                        <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatSize(doc.fileSize)}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{doc.description}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                      {doc.createdAt ? (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      ) : null}
                      {doc.createdBy?.name ? (
                        <span className="flex items-center min-w-0">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate">{doc.createdBy.name}</span>
                        </span>
                      ) : null}
                    </div>

                    {doc.fileUrl && (
                      <div className="mt-5 flex gap-2">
                        <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                        <button
                          onClick={() => doc.isSaved ? handleRemoveSavedItem("document", doc._id) : handleSaveItem("document", doc._id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={doc.isSaved ? "Remove from saved" : "Save document"}
                        >
                          {doc.isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Discover / Search CTA */}
      <section className="py-14 md:py-16 bg-gray-900 text-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold">Find What You Need</h2>
          <p className="mt-2 text-gray-300">Search our library of resources by topic or keyword</p>
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search resources, topics, or keywords…"
                className="flex-1 px-5 py-3 rounded-lg bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["Grammar", "Vocabulary", "IELTS", "TOEIC", "Speaking", "Writing", "Listening", "Reading"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm cursor-pointer">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======= Modal: Collection Detail ======= */}
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
                    onClick={() => collectionDetail?.isSaved ? handleRemoveSavedItem("collection", collectionDetail._id) : handleSaveItem("collection", collectionDetail._id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title={collectionDetail?.isSaved ? "Remove from saved" : "Save collection"}
                  >
                    {collectionDetail?.isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
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
                                    <button
                                      onClick={() => it.isSaved ? handleRemoveSavedItem("lecture", it.ref) : handleSaveItem("lecture", it.ref)}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                      title={it.isSaved ? "Remove from saved" : "Save lecture"}
                                    >
                                      {it.isSaved ? (
                                        <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      ) : (
                                        <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
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
                                      {it.title || it.titleOverride || "Document"}
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
                                  {it.fileUrl && (
                                    <div className="mt-3 flex gap-2">
                                      <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <a href={it.fileUrl} target="_blank" rel="noreferrer" className="flex items-center">
                                          <Download className="w-4 h-4 mr-2" />
                                          Download
                                        </a>
                                      </Button>
                                      <button
                                        onClick={() => it.isSaved ? handleRemoveSavedItem("document", it.ref) : handleSaveItem("document", it.ref)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title={it.isSaved ? "Remove from saved" : "Save document"}
                                      >
                                        {it.isSaved ? (
                                          <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                          <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= Modal: Lecture Preview ======= */}
      {openLecture && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenLecture(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {openLecture.title || "Lecture"}
                </h3>
                <button
                  onClick={() => setOpenLecture(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                  title="Close"
                >
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

                <div className="mt-4">
                  {openLecture.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{openLecture.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {openLecture.mimeType && (
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {getTypeBadge(openLecture.mimeType, "VIDEO")}
                      </span>
                    )}
                    {openLecture.fileSize && (
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {formatSize(openLecture.fileSize)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <Button onClick={() => setOpenLecture(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
