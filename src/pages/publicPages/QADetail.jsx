import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionDetail, useCreateAnswer } from "@/hooks/useQA";
import { useSaveItem, useRemoveSavedItem } from "@/hooks/useSaved";
import { PAGE_SEO, SEO_CONSTANTS } from "@/utils/seoConstants";
import { generateCanonicalUrl } from "@/utils/seoUtils";
import { ArrowLeft, MessageCircle, Calendar, User, Tag, Paperclip, Bookmark, BookmarkCheck, Send, ThumbsUp, ThumbsDown, Plus, FileText, Image, Video, File } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Form validation schema
const answerSchema = z.object({
  content: z.string().min(10, 'Câu trả lời phải có ít nhất 10 ký tự').max(2000, 'Câu trả lời không được quá 2000 ký tự'),
});

// Helper function to determine file type
const getFileType = (url, mimeType) => {
  if (!url && !mimeType) return 'unknown';
  
  const urlLower = url?.toLowerCase() || '';
  const mimeLower = mimeType?.toLowerCase() || '';
  
  // Check for images
  if (mimeLower.startsWith('image/') || 
      urlLower.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)) {
    return 'image';
  }
  
  // Check for videos
  if (mimeLower.startsWith('video/') || 
      urlLower.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/)) {
    return 'video';
  }
  
  // Check for documents
  if (mimeLower.includes('pdf') || urlLower.endsWith('.pdf')) return 'pdf';
  if (mimeLower.includes('word') || urlLower.match(/\.(doc|docx)$/)) return 'word';
  if (mimeLower.includes('excel') || urlLower.match(/\.(xls|xlsx)$/)) return 'excel';
  if (mimeLower.includes('powerpoint') || urlLower.match(/\.(ppt|pptx)$/)) return 'powerpoint';
  if (urlLower.match(/\.(txt|rtf)$/)) return 'text';
  
  return 'file';
};

// Helper function to get file icon
const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'image': return Image;
    case 'video': return Video;
    case 'pdf': return FileText;
    case 'word': return FileText;
    case 'excel': return FileText;
    case 'powerpoint': return FileText;
    case 'text': return FileText;
    default: return File;
  }
};

// Helper function to get file type label
const getFileTypeLabel = (fileType) => {
  switch (fileType) {
    case 'image': return 'Hình ảnh';
    case 'video': return 'Video';
    case 'pdf': return 'PDF';
    case 'word': return 'Word';
    case 'excel': return 'Excel';
    case 'powerpoint': return 'PowerPoint';
    case 'text': return 'Văn bản';
    default: return 'Tệp';
  }
};

export default function QADetail() {
  const { id } = useParams();
  const qaSeo = PAGE_SEO.QA;
  
  console.log('QADetail render - id:', id);
  
  const { data, isLoading, error } = useQuestionDetail(id);
  const { mutate: createAnswer, isLoading: creating } = useCreateAnswer();
  const { mutate: saveItem } = useSaveItem();
  const { mutate: removeSavedItem } = useRemoveSavedItem();

  const [attachments, setAttachments] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  // Form handling với react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: ""
    }
  });

  const question = data?.question;
  const answers = data?.answers || [];

  console.log('QADetail data:', { data, isLoading, error, question, answers });

  useEffect(() => {
    const handleError = (error) => {
      console.error('QADetail caught error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno
      });
      setHasError(true);
      setErrorInfo(error.message);
    };

    const handleUnhandledRejection = (event) => {
      console.error('QADetail unhandled promise rejection:', event.reason);
      setHasError(true);
      setErrorInfo(event.reason?.message || 'Unhandled promise rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const submitAnswer = (data) => {
    createAnswer({ questionId: id, content: data.content, attachments: attachments }, {
      onSuccess: () => {
        reset();
        setAttachments([]);
        toast.success('Câu trả lời đã được đăng thành công!');
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi đăng câu trả lời. Vui lòng thử lại.');
        console.error('Error creating answer:', error);
      }
    });
  };

  const handleSaveQuestion = () => {
    if (question?.isSaved) {
      removeSavedItem({ kind: "question", ref: id }, {
        onSuccess: () => {
          toast.success('Đã bỏ lưu câu hỏi khỏi danh sách yêu thích!');
        },
        onError: (error) => {
          toast.error('Có lỗi xảy ra khi bỏ lưu câu hỏi.');
          console.error('Error removing saved question:', error);
        }
      });
    } else {
      saveItem({ kind: "question", ref: id }, {
        onSuccess: () => {
          toast.success('Đã lưu câu hỏi vào danh sách yêu thích!');
        },
        onError: (error) => {
          toast.error('Có lỗi xảy ra khi lưu câu hỏi.');
          console.error('Error saving question:', error);
        }
      });
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-red-400 dark:text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{errorInfo || 'An unexpected error occurred'}</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/app/qa">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Q&A
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Add error handling
  if (error) {
    console.error('QADetail error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-red-400 dark:text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error loading question</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error.message || 'Something went wrong'}</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/app/qa">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Q&A
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Question not found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The question you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/qa">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Q&A
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{question.title} | {qaSeo.title.vi}</title>
        <meta name="description" content={question.content?.substring(0, 160) || qaSeo.description.vi} />
        <meta name="keywords" content={`${qaSeo.keywords}, ${question.tags?.join(', ') || ''}`} />
        <link rel="canonical" href={generateCanonicalUrl(`/app/qa/${id}`)} />
        
        {/* Open Graph */}
        <meta property="og:title" content={question.title} />
        <meta property="og:description" content={question.content?.substring(0, 160) || qaSeo.description.en} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={generateCanonicalUrl(`/app/qa/${id}`)} />
        <meta property="og:site_name" content={SEO_CONSTANTS.SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={question.title} />
        <meta name="twitter:description" content={question.content?.substring(0, 160) || qaSeo.description.vi} />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        {/* Header Section (light) */}
        <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Link to="/app/qa">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Q&A
                </Link>
              </Button>
              <button
                onClick={handleSaveQuestion}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={question?.isSaved ? "Remove from saved" : "Save question"}
              >
                {question?.isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Question Section (darker) */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4">
            <Card className="p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex-1 mr-4">{question.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {answers.length} answer{answers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {question.content}
                </p>
              </div>

              {question.attachments?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tệp đính kèm:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.attachments.map((att, idx) => {
                      const fileType = getFileType(att.url, att.mimeType);
                      const FileIcon = getFileIcon(fileType);
                      const fileTypeLabel = getFileTypeLabel(fileType);
                      
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          {fileType === 'image' ? (
                            <div className="space-y-3">
                              <img 
                                src={att.url} 
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden items-center justify-center h-48 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <div className="text-center">
                                  <FileIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{fileTypeLabel}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {fileTypeLabel} {idx + 1}
                                </span>
                                <a 
                                  href={att.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                >
                                  Xem đầy đủ
                                </a>
                              </div>
                            </div>
                          ) : fileType === 'video' ? (
                            <div className="space-y-3">
                              <video 
                                src={att.url} 
                                controls 
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden items-center justify-center h-48 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <div className="text-center">
                                  <FileIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{fileTypeLabel}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {fileTypeLabel} {idx + 1}
                                </span>
                                <a 
                                  href={att.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                >
                                  Tải xuống
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <FileIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                  {fileTypeLabel} {idx + 1}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {att.mimeType || 'Không xác định định dạng'}
                                </p>
                              </div>
                              <a 
                        href={att.url} 
                        target="_blank" 
                        rel="noreferrer" 
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                              >
                                <Paperclip className="w-3 h-3" />
                                Tải xuống
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {question.tags?.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        <Tag className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {question.createdBy?.name || 'Anonymous'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Answers Section (light) */}
        <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Answers ({answers.length})
              </h2>
            </div>

            {answers.length === 0 ? (
              <Card className="p-8 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No answers yet</h3>
                <p className="text-gray-600 dark:text-gray-300">Be the first to answer this question!</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {answers.map((answer, index) => (
                  <Card key={answer._id} className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                            {answer.content}
                          </p>
                        </div>

                        {answer.attachments?.length > 0 && (
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {answer.attachments.map((att, idx) => {
                                const fileType = getFileType(att.url, att.mimeType);
                                const FileIcon = getFileIcon(fileType);
                                const fileTypeLabel = getFileTypeLabel(fileType);
                                
                                return (
                                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                                    {fileType === 'image' ? (
                                      <div className="space-y-2">
                                        <img 
                                          src={att.url} 
                                          alt={`Answer attachment ${idx + 1}`}
                                          className="w-full h-32 object-cover rounded-lg"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                          }}
                                        />
                                        <div className="hidden items-center justify-center h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                          <div className="text-center">
                                            <FileIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                                            <p className="text-xs text-gray-600 dark:text-gray-300">{fileTypeLabel}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {fileTypeLabel}
                                          </span>
                                          <a 
                                            href={att.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                                          >
                                            Xem đầy đủ
                                          </a>
                                        </div>
                                      </div>
                                    ) : fileType === 'video' ? (
                                      <div className="space-y-2">
                                        <video 
                                          src={att.url} 
                                          controls 
                                          className="w-full h-32 object-cover rounded-lg"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                          }}
                                        />
                                        <div className="hidden items-center justify-center h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                          <div className="text-center">
                                            <FileIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                                            <p className="text-xs text-gray-600 dark:text-gray-300">{fileTypeLabel}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {fileTypeLabel}
                                          </span>
                                          <a 
                                            href={att.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                                          >
                                            Tải xuống
                                          </a>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                          <FileIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {fileTypeLabel}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {att.mimeType || 'Không xác định'}
                                          </p>
                                        </div>
                                        <a 
                                  href={att.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                >
                                  <Paperclip className="w-3 h-3" />
                                          Tải
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {answer.createdBy?.name || 'Anonymous'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(answer.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                              <ThumbsUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                              <ThumbsDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Answer Form Section (darker) */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4">
            <Card className="p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Viết câu trả lời</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Chia sẻ kiến thức và giúp đỡ người khác học tập</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(submitAnswer)} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Câu trả lời của bạn *
                  </label>
            <textarea
                    {...register("content")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical min-h-[120px] transition-colors ${
                      errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    rows={6}
                    placeholder="Chia sẻ câu trả lời chi tiết và hữu ích cho câu hỏi này..."
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
                    Tệp đính kèm (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                      onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                      className="hidden"
                      id="answer-attachments"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="answer-attachments" className="cursor-pointer">
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
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="submit" 
                    disabled={creating || !watch("content")?.trim()} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang đăng...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Đăng câu trả lời
                      </div>
                    )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
        </section>
    </div>
    </>
  );
}


