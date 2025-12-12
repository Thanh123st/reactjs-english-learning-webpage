import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollections } from "@/hooks/useCollections";
import { Layers, Calendar, User, Video, FileText, Eye, Tag, ChevronLeft, ChevronRight } from "lucide-react";

export default function CollectionsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const { data, isLoading } = useCollections({ mine: false, page, limit });

  const collections = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.collections || data.data || [];
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
        <title>Collections | Resources</title>
      </Helmet>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Collections</h1>
            <Link to="/app/resources">
              <Button variant="outline">Back to Resources</Button>
            </Link>
          </div>

          {isLoading ? (
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
              <h3 className="text-lg md:text-xl font-semibold mb-1">No collections</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back later.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Card key={col._id} className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                    {col.coverUrl ? (
                      <img src={col.coverUrl} alt={col.title} className="w-full h-full object-cover" />
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
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{col.description}</p>
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
                      {col.isPublic && (
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Public
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
                    </div>

                    {Array.isArray(col.keywords) && col.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {col.keywords.slice(0, 6).map((kw, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 inline-flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" /> View Collection
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
    </div>
  );
}


