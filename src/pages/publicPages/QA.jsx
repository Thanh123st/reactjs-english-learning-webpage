import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePublishedQuestions, useCreateQuestion, useSearchQuestions } from "@/hooks/useQA";
import { useSaveItem, useRemoveSavedItem } from "@/hooks/useSaved";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl } from "@/utils/seoUtils";
import { X, MessageCircle, Calendar, User, Tag, Paperclip, Bookmark, BookmarkCheck, Search, Filter, Plus, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Form validation schema
const questionSchema = z.object({
  title: z.string().min(10, 'Tiêu đề phải có ít nhất 10 ký tự').max(200, 'Tiêu đề không được quá 200 ký tự'),
  content: z.string().min(30, 'Nội dung phải có ít nhất 30 ký tự').max(2000, 'Nội dung không được quá 2000 ký tự'),
  tags: z.string().optional(),
});

export default function QA() {
  const qaSeo = PAGE_SEO.QA;
  const { mutate: createQuestion, isLoading: creatingQ } = useCreateQuestion();
  const { mutate: saveItem } = useSaveItem();
  const { mutate: removeSavedItem } = useRemoveSavedItem();

  const [showAsk, setShowAsk] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // --- State người dùng đang gõ ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // --- State đã xác nhận tìm kiếm (chỉ đổi khi bấm Search) ---
  const [committedQuery, setCommittedQuery] = useState("");
  const [committedTag, setCommittedTag] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Form handling với react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: ""
    }
  });

  // Data hooks
  const { data: questionsData, isLoading: isLoadingAll } = usePublishedQuestions({
    page: currentPage,
    limit: pageSize,
  });

  // Quan trọng: hook này dùng "committed" thay vì state đang gõ
  const { data: searchData, isLoading: isLoadingSearch } = useSearchQuestions({
    q: isSearching ? committedQuery : "",
    tag: isSearching ? committedTag : "",
    page: currentPage,
    limit: pageSize,
    // Nếu hook hỗ trợ, "enabled" sẽ chặn fetch khi chưa bấm Search.
    enabled: isSearching && (committedQuery.trim() !== "" || committedTag !== "")
  });

  // Determine which data to use
  const questions = React.useMemo(() => {
    if (isSearching) {
      if (!searchData) return [];
      if (Array.isArray(searchData)) return searchData;
      return searchData.questions || searchData.data || [];
    } else {
      if (!questionsData) return [];
      if (Array.isArray(questionsData)) return questionsData;
      return questionsData.questions || questionsData.data || [];
    }
  }, [isSearching, searchData, questionsData]);

  // Get pagination info
  const pagination = React.useMemo(() => {
    const data = isSearching ? searchData : questionsData;
    if (!data || Array.isArray(data)) return null;
    return data.pagination || data.meta || null;
  }, [isSearching, searchData, questionsData]);

  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;

  const allTags = React.useMemo(() => {
    const tags = new Set();
    // Always get tags from all questions, not just filtered ones
    const allQuestionsData = questionsData;
    if (allQuestionsData) {
      const allQuestions = Array.isArray(allQuestionsData) ? allQuestionsData : allQuestionsData.questions || allQuestionsData.data || [];
      allQuestions.forEach(q => {
        q.tags?.forEach(tag => tags.add(tag));
      });
    }
    return Array.from(tags);
  }, [questionsData]);

  const handleAsk = (data) => {
    createQuestion(
      {
        title: data.title,
        content: data.content,
        tags: data.tags,
        attachments: attachments,
      },
      {
        onSuccess: () => {
          reset();
          setAttachments([]);
          setShowAsk(false);
          toast.success('Câu hỏi đã được đăng thành công!');
        },
        onError: (error) => {
          toast.error('Có lỗi xảy ra khi đăng câu hỏi. Vui lòng thử lại.');
          console.error('Error creating question:', error);
        }
      }
    );
  };

  const handleSaveQuestion = (questionId) => {
    saveItem({ kind: "question", ref: questionId }, {
      onSuccess: () => {
        toast.success('Đã lưu câu hỏi vào danh sách yêu thích!');
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi lưu câu hỏi.');
        console.error('Error saving question:', error);
      }
    });
  };

  const handleRemoveSavedQuestion = (questionId) => {
    removeSavedItem({ kind: "question", ref: questionId }, {
      onSuccess: () => {
        toast.success('Đã bỏ lưu câu hỏi khỏi danh sách yêu thích!');
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi bỏ lưu câu hỏi.');
        console.error('Error removing saved question:', error);
      }
    });
  };

  // Chỉ khi bấm nút Search mới set committed & bật isSearching
  const handleSearch = () => {
    setCommittedQuery(searchQuery.trim());
    setCommittedTag(selectedTag);
    setIsSearching(true);
    setCurrentPage(1); // Reset về trang đầu khi search
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedTag("");
    setCommittedQuery("");
    setCommittedTag("");
    setIsSearching(false);
    setCurrentPage(1); // Reset về trang đầu khi clear
  };

  return (
    <>
      <Helmet>
        <title>{qaSeo.title.vi}</title>
        <meta name="description" content={qaSeo.description.vi} />
        <meta name="keywords" content={qaSeo.keywords} />
        <link rel="canonical" href={generateCanonicalUrl('/qa')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={qaSeo.title.en} />
        <meta property="og:description" content={qaSeo.description.en} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={generateCanonicalUrl('/qa')} />
        <meta property="og:image" content={`${SEO_CONSTANTS.SITE_URL}/og-qa.jpg`} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={qaSeo.title.vi} />
        <meta name="twitter:description" content={qaSeo.description.vi} />
        <meta name="twitter:image" content={`${SEO_CONSTANTS.SITE_URL}/twitter-qa.jpg`} />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Hero Section (light) */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              Q&A <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Community</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Ask questions, share knowledge, and learn together in our English learning community
            </p>
            <Button onClick={() => setShowAsk(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask a Question
            </Button>
          </div>
        </section>

        {/* Search and Filter Section (darker) */}
        <section className="py-6 sm:py-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              {/* Grid responsive: 1 cột (mobile) → 2 cột (sm) → 3 khu (lg) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
                {/* Search Input */}
                <div className="lg:col-span-6 min-w-0">
                  <label className="sr-only sm:not-sr-only block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search Questions
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search by title or content…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-1 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      inputMode="search"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Tag Filter */}
                <div className="lg:col-span-3 min-w-0">
                  <label className="sr-only sm:not-sr-only block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Topic
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Topics</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-3 flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    onClick={handleSearch}
                    className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>

                  {(isSearching || searchQuery || selectedTag) && (
                    <>
                      {/* Mobile: nút Clear full-width; Desktop: nút thường */}
                      <Button
                        onClick={handleClearSearch}
                        variant="outline"
                        className="w-full sm:w-auto justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-3"
                      >
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Search Results Info */}
              {isSearching && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">{questions.length}</span> question{questions.length !== 1 ? 's' : ''} found
                      {committedQuery && (
                        <span> for "<span className="font-medium">{committedQuery}</span>"</span>
                      )}
                      {committedTag && (
                        <span> in topic <span className="font-medium">#{committedTag}</span></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {isSearching ? 'filtered' : 'all'} results
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Questions Section (light) */}
        <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {isSearching ? 'No questions found' : 'No questions yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {isSearching ? 'Try adjusting your search criteria or clear the filters.' : 'Be the first to ask a question!'}
                </p>
                <div className="flex gap-3 justify-center">
                  {isSearching && (
                    <Button onClick={handleClearSearch} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Clear Search
                    </Button>
                  )}
                  <Button onClick={() => setShowAsk(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Ask Question
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <Card key={q._id} className="p-5 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      {/* Question Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 pr-4">{q.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {q.answersCount || 0}
                            </span>
                            <button
                              onClick={() => q.isSaved ? handleRemoveSavedQuestion(q._id) : handleSaveQuestion(q._id)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title={q.isSaved ? "Remove from saved" : "Save question"}
                            >
                              {q.isSaved ? (
                                <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{q.content}</p>
                        
                        {/* Tags */}
                        {q.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {q.tags.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                #{t}
                              </span>
                            ))}
                            {q.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                +{q.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Attachments */}
                        {/* {q.attachments?.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {q.attachments.slice(0, 2).map((att, idx) => (
                              <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                File {idx + 1}
                              </a>
                            ))}
                            {q.attachments.length > 2 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{q.attachments.length - 2} more files
                              </span>
                            )}
                          </div>
                        )} */}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {q.createdBy?.name || 'Anonymous'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                            <Link to={`/app/qa/${q._id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, pagination.total)} trong tổng số {pagination.total} câu hỏi
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === pageNum 
                              ? "bg-blue-600 text-white" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className="flex items-center gap-1"
                  >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Ask Question Modal */}
        <AnimatePresence>
          {showAsk && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="fixed inset-0" onClick={() => setShowAsk(false)} />
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Đặt câu hỏi mới</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Chia sẻ câu hỏi của bạn với cộng đồng</p>
                    </div>
                    <button 
                      onClick={() => setShowAsk(false)} 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit(handleAsk)} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tiêu đề câu hỏi *
                    </label>
                    <input 
                      {...register("title")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Ví dụ: Cách sử dụng thì hiện tại hoàn thành trong tiếng Anh?"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Mô tả chi tiết *
                    </label>
                    <textarea 
                      {...register("content")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[120px] transition-colors ${
                        errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      rows={6}
                      placeholder="Mô tả chi tiết về câu hỏi của bạn, bao gồm ngữ cảnh và những gì bạn muốn biết..."
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {watch("content")?.length || 0}/2000 ký tự
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tags (tùy chọn)
                    </label>
                    <input 
                      {...register("tags")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="Ví dụ: grammar, tense, vocabulary (phân cách bằng dấu phẩy)"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Thêm tags để giúp người khác dễ dàng tìm thấy câu hỏi của bạn
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tệp đính kèm (tùy chọn)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input 
                        type="file"
                        multiple
                        onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                        className="hidden"
                        id="attachments"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <label htmlFor="attachments" className="cursor-pointer">
                        <Paperclip className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Nhấp để chọn tệp hoặc kéo thả vào đây
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Hỗ trợ: JPG, PNG, PDF, DOC, DOCX, TXT (tối đa 10MB mỗi tệp)
                        </p>
                      </label>
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tệp đã chọn:</p>
                        <div className="space-y-1">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAsk(false)} 
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={creatingQ} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingQ ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Đang đăng...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-5 h-5 mr-2" />
                          Đăng câu hỏi
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
