import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePublicLectures } from "@/hooks/useLecture";
import { Video, Calendar, User, FileText, ChevronLeft, ChevronRight, Play, Tag, X } from "lucide-react";

export default function LecturesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const { data, isLoading } = usePublicLectures({ page, limit });
  const lectures = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.lectures || data.data || [];
  }, [data]);

  const pagination = React.useMemo(() => {
    if (!data || Array.isArray(data)) return null;
    return data.pagination || data.meta || null;
  }, [data]);

  const [openLecture, setOpenLecture] = React.useState(null);

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Helmet>
        <title>Video Lectures | Resources</title>
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Video Lectures</h1>
            <Link to="/app/resources">
              <Button variant="outline">Back to Resources</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h3 className="text-lg md:text-xl font-semibold mb-1">No lectures</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back later.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lec) => (
                <Card key={lec._id} className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                    <Video className="w-10 h-10 text-purple-600" />
                    {lec.mimeType && (
                      <div className="absolute top-2 right-2 text-[10px] md:text-xs bg-black/70 text-white px-2 py-1 rounded">
                        {lec.mimeType}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2">
                      {lec.title}
                    </h3>
                    {lec.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{lec.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                      {lec.fileSize ? (
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {lec.fileSize}
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

                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={() => setOpenLecture(lec)}>
                        <Play className="w-4 h-4 mr-2" /> Watch
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    return (
                      <Button key={pageNum} variant={page === pageNum ? "default" : "outline"} size="sm" onClick={() => setPage(pageNum)}>
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal: Watch video */}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


