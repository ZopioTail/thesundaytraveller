'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  FlagIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

// Comment Types
export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
    role?: string
    verified?: boolean
  }
  content: string
  createdAt: Date
  updatedAt?: Date
  parentId?: string
  likes: number
  dislikes: number
  replies: Comment[]
  isLiked?: boolean
  isDisliked?: boolean
  isEdited?: boolean
  status: 'approved' | 'pending' | 'rejected' | 'spam'
  metadata?: Record<string, any>
}

export interface CommentFormData {
  content: string
  authorName: string
  authorEmail: string
  parentId?: string
}

interface CommentsProps {
  comments: Comment[]
  onSubmitComment: (data: CommentFormData) => Promise<void>
  onLikeComment: (commentId: string) => Promise<void>
  onDislikeComment: (commentId: string) => Promise<void>
  onReplyComment: (commentId: string, data: CommentFormData) => Promise<void>
  onEditComment: (commentId: string, content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
  onReportComment: (commentId: string, reason: string) => Promise<void>
  currentUser?: {
    id: string
    name: string
    avatar?: string
    role?: string
  }
  className?: string
  maxDepth?: number
  showAvatars?: boolean
  showTimestamps?: boolean
  allowAnonymous?: boolean
  requireApproval?: boolean
  sortBy?: 'newest' | 'oldest' | 'mostLiked'
  moderationMode?: boolean
  onModerationAction?: (commentId: string, action: 'approve' | 'reject' | 'spam') => Promise<void>
}

// Comment Component
interface CommentProps {
  comment: Comment
  depth: number
  maxDepth: number
  currentUser?: CommentsProps['currentUser']
  onLike: (commentId: string) => Promise<void>
  onDislike: (commentId: string) => Promise<void>
  onReply: (commentId: string, data: CommentFormData) => Promise<void>
  onEdit: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  onReport: (commentId: string, reason: string) => Promise<void>
  showAvatars?: boolean
  showTimestamps?: boolean
  moderationMode?: boolean
  onModerationAction?: (commentId: string, action: 'approve' | 'reject' | 'spam') => Promise<void>
}

function CommentItem({
  comment,
  depth,
  maxDepth,
  currentUser,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  showAvatars = true,
  showTimestamps = true,
  moderationMode = false,
  onModerationAction
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies, setShowReplies] = useState(depth < 2)
  const [isLiked, setIsLiked] = useState(comment.isLiked || false)
  const [isDisliked, setIsDisliked] = useState(comment.isDisliked || false)
  const [likesCount, setLikesCount] = useState(comment.likes)
  const [showReportModal, setShowReportModal] = useState(false)

  const isAuthor = currentUser?.id === comment.author.id
  const canReply = depth < maxDepth
  const canModerate = moderationMode && currentUser?.role === 'admin'

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      setLikesCount(prev => prev + 1)
      setIsLiked(true)
      if (isDisliked) {
        setIsDisliked(false)
      }
    }
    onLike(comment.id)
  }

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false)
    } else {
      setIsDisliked(true)
      if (isLiked) {
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      }
    }
    onDislike(comment.id)
  }

  const handleEdit = () => {
    if (editContent.trim() !== comment.content) {
      onEdit(comment.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id)
    }
  }

  const handleReport = (reason: string) => {
    onReport(comment.id, reason)
    setShowReportModal(false)
  }

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'rejected':
        return 'text-red-600 dark:text-red-400'
      case 'spam':
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: Comment['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'pending':
        return <ClockIcon className="w-4 h-4" />
      case 'rejected':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'spam':
        return <FlagIcon className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative',
        depth > 0 && 'ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        {showAvatars && (
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.author.name}
            </span>
            {comment.author.verified && (
              <CheckCircleIcon className="w-4 h-4 text-blue-500" />
            )}
            {comment.author.role && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({comment.author.role})
              </span>
            )}
            {showTimestamps && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt.toLocaleDateString()}
              </span>
            )}
            <div className={cn(
              'flex items-center space-x-1 text-xs',
              getStatusColor(comment.status)
            )}>
              {getStatusIcon(comment.status)}
              <span className="capitalize">{comment.status}</span>
            </div>
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
              {comment.isEdited && (
                <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                  (edited)
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center space-x-1 transition-colors duration-200',
                isLiked
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              )}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-4 h-4" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleDislike}
              className={cn(
                'flex items-center space-x-1 transition-colors duration-200',
                isDisliked
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              )}
            >
              <div className="w-4 h-4 transform rotate-180">
                👍
              </div>
              <span>{comment.dislikes}</span>
            </button>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Reply
              </button>
            )}

            {isAuthor && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </>
            )}

            {!isAuthor && (
              <button
                onClick={() => setShowReportModal(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                <FlagIcon className="w-4 h-4" />
              </button>
            )}

            {canModerate && (
              <div className="flex space-x-1">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => onModerationAction?.(comment.id, 'approve')}
                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    Approve
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    onClick={() => onModerationAction?.(comment.id, 'reject')}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Reject
                  </button>
                )}
                {comment.status !== 'spam' && (
                  <button
                    onClick={() => onModerationAction?.(comment.id, 'spam')}
                    className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Spam
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden"
              >
                <CommentForm
                  onSubmit={(data) => {
                    onReply(comment.id, data)
                    setIsReplying(false)
                  }}
                  placeholder={`Reply to ${comment.author.name}...`}
                  submitLabel="Reply"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>

              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-4">
                      {comment.replies.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          depth={depth + 1}
                          maxDepth={maxDepth}
                          currentUser={currentUser}
                          onLike={onLike}
                          onDislike={onDislike}
                          onReply={onReply}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onReport={onReport}
                          showAvatars={showAvatars}
                          showTimestamps={showTimestamps}
                          moderationMode={moderationMode}
                          onModerationAction={onModerationAction}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            onSubmit={handleReport}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Comment Form Component
interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  showNameField?: boolean
  showEmailField?: boolean
  initialData?: Partial<CommentFormData>
}

function CommentForm({
  onSubmit,
  placeholder = 'Write a comment...',
  submitLabel = 'Comment',
  autoFocus = false,
  showNameField = true,
  showEmailField = true,
  initialData = {}
}: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    authorName: '',
    authorEmail: '',
    ...initialData
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.content.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({ content: '', authorName: '', authorEmail: '', ...initialData })
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        rows={3}
        required
      />

      {(showNameField || showEmailField) && (
        <div className="flex space-x-3">
          {showNameField && (
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              placeholder="Your name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          )}
          {showEmailField && (
            <input
              type="email"
              value={formData.authorEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
              placeholder="Your email"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!formData.content.trim() || isSubmitting}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  )
}

// Report Modal Component
interface ReportModalProps {
  onSubmit: (reason: string) => void
  onClose: () => void
}

function ReportModal({ onSubmit, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const reportReasons = [
    'Spam or misleading',
    'Offensive or inappropriate',
    'Harassment or bullying',
    'Copyright infringement',
    'Privacy violation',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalReason = reason === 'Other' ? customReason : reason
    if (finalReason.trim()) {
      onSubmit(finalReason)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Report Comment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select a reason...</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Please specify
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason || (reason === 'Other' && !customReason.trim())}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Report
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Main Comments Component
export function Comments({
  comments,
  onSubmitComment,
  onLikeComment,
  onDislikeComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  currentUser,
  className = '',
  maxDepth = 3,
  showAvatars = true,
  showTimestamps = true,
  allowAnonymous = true,
  requireApproval = false,
  sortBy = 'newest',
  moderationMode = false,
  onModerationAction
}: CommentsProps) {
  const [sortedComments, setSortedComments] = useState<Comment[]>(comments)
  const [showCommentForm, setShowCommentForm] = useState(false)

  useEffect(() => {
    let sorted = [...comments]

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'mostLiked':
        sorted.sort((a, b) => b.likes - a.likes)
        break
    }

    setSortedComments(sorted)
  }, [comments, sortBy])

  const handleSubmitComment = async (data: CommentFormData) => {
    await onSubmitComment(data)
    setShowCommentForm(false)
  }

  const handleLike = async (commentId: string) => {
    await onLikeComment(commentId)
  }

  const handleDislike = async (commentId: string) => {
    await onDislikeComment(commentId)
  }

  const handleReply = async (commentId: string, data: CommentFormData) => {
    await onReplyComment(commentId, data)
  }

  const handleEdit = async (commentId: string, content: string) => {
    await onEditComment(commentId, content)
  }

  const handleDelete = async (commentId: string) => {
    await onDeleteComment(commentId)
  }

  const handleReport = async (commentId: string, reason: string) => {
    await onReportComment(commentId, reason)
  }

  const approvedComments = sortedComments.filter(comment => comment.status === 'approved')

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comments ({approvedComments.length})
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => {
              // This would need to be handled by parent component
              console.log('Sort by:', e.target.value)
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLiked">Most Liked</option>
          </select>

          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        </div>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showCommentForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <CommentForm
                onSubmit={handleSubmitComment}
                placeholder="Share your thoughts..."
                submitLabel="Post Comment"
                showNameField={allowAnonymous && !currentUser}
                showEmailField={allowAnonymous && !currentUser}
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-6">
        {approvedComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          approvedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={maxDepth}
              currentUser={currentUser}
              onLike={handleLike}
              onDislike={handleDislike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
              showAvatars={showAvatars}
              showTimestamps={showTimestamps}
              moderationMode={moderationMode}
              onModerationAction={onModerationAction}
            />
          ))
        )}
      </div>

      {/* Moderation Info */}
      {moderationMode && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Moderation Mode Active
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Comments require approval before being visible to other users.
          </p>
        </div>
      )}
    </div>
  )
}