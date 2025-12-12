import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePublicDocuments } from "@/hooks/useDocument";
import { FileText, Calendar, User, Download, ChevronLeft, ChevronRight, Tag } from "lucide-react";

export default function DocumentsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const { data, isLoading } = usePublicDocuments({ page, limit });
  const documents = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.documents || data.data || [];
  }, [data]);

  const pagination = React.useMemo(() => {
    if (!data || Array.isArray(data)) return null;
    return data.pagination || data.meta || null;
  }, [data]);

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Helmet>
        <title>Documents | Resources</title>
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Documents</h1>
            <Link to="/app/resources">
              <Button variant="outline">Back to Resources</Button>
            </Link>
          </div>

          {isLoading ? (
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
              <h3 className="text-lg md:text-xl font-semibold mb-1">No documents</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back later.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc._id} className="group border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                            {doc.mimeType}
                          </span>
                        </div>
                      </div>
                      {doc.fileSize ? (
                        <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {doc.fileSize}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2">
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
                      <div className="mt-5">
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    )}
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
    </div>
  );
}


