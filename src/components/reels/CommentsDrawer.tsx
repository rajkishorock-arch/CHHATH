import React, { useState } from 'react';
import { X, Heart, MessageCircle, Trash2, Flag, Send, CornerDownRight, ShieldCheck, Check } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { ReelComment } from '../../types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ isOpen, onClose, reelId }) => {
  const { activeComments, addComment, deleteComment } = useReels();
  const { currentUser, openAuthModal, blockUser } = useAuth();
  
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReelComment | null>(null);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [reportedCommentIds, setReportedCommentIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Filter top-level vs threaded replies
  const topLevelComments = activeComments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => activeComments.filter(c => c.parentId === parentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login', 'टिप्पणी करने के लिए कृपया लॉगिन करें।');
      return;
    }
    if (!commentText.trim()) return;

    addComment(reelId, commentText, replyingTo?.id);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (!currentUser) {
      openAuthModal('login', 'टिप्पणी लाइक करने के लिए कृपया लॉगिन करें।');
      return;
    }
    setCommentLikes(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReportComment = (commentId: string) => {
    setReportedCommentIds(prev => ({ ...prev, [commentId]: true }));
    alert('यह टिप्पणी मॉडरेशन समीक्षा के लिए भेज दी गई है। धन्यवाद।');
  };

  const addQuickEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md h-[75vh] max-h-[600px] bg-stone-950 border-t sm:border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100 animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-rozha text-lg font-bold text-amber-300">
              टिप्पणियां ({activeComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {topLevelComments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <span className="text-4xl mb-2">🪔</span>
              <p className="font-rozha text-base text-stone-300">पहला पावन विचार साझा करें!</p>
              <p className="text-xs text-stone-400 mt-1">छठी मईया की महिमा या अपनी भक्ति से जुड़ी बात लिखें।</p>
            </div>
          ) : (
            topLevelComments.map(comment => {
              const replies = getReplies(comment.id);
              const isLiked = Boolean(commentLikes[comment.id]);
              const isOwn = currentUser?.id === comment.userId;
              const isReported = Boolean(reportedCommentIds[comment.id]);

              return (
                <div key={comment.id} className="space-y-2">
                  {/* Parent Comment */}
                  <div className={`flex gap-3 text-xs ${isReported ? 'opacity-40 line-through' : ''}`}>
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-300 truncate">{comment.userName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{comment.userUsername}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {new Date(comment.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <p className="text-stone-200 mt-0.5 leading-relaxed break-words font-mukta">
                        {comment.text}
                      </p>

                      <div className="flex items-center gap-4 mt-1.5 text-[11px] text-stone-400">
                        <button
                          onClick={() => setReplyingTo(comment)}
                          className="hover:text-amber-400 font-semibold"
                        >
                          उत्तर दें (Reply)
                        </button>

                        {isOwn ? (
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="hover:text-red-400 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            हटाएं
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReportComment(comment.id)}
                            className="hover:text-amber-400 flex items-center gap-1"
                          >
                            <Flag className="w-3 h-3" />
                            रिपोर्ट
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Like Comment Heart */}
                    <button
                      onClick={() => handleToggleCommentLike(comment.id)}
                      className="flex flex-col items-center gap-0.5 self-start pt-1 text-stone-400 hover:text-red-400"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                      <span className="text-[9px]">
                        {comment.likesCount + (isLiked ? 1 : 0)}
                      </span>
                    </button>
                  </div>

                  {/* Threaded Replies */}
                  {replies.length > 0 && (
                    <div className="pl-8 space-y-2 border-l border-amber-500/20 ml-4">
                      {replies.map(reply => {
                        const replyLiked = Boolean(commentLikes[reply.id]);
                        const isOwnReply = currentUser?.id === reply.userId;

                        return (
                          <div key={reply.id} className="flex gap-2.5 text-xs pt-1">
                            <CornerDownRight className="w-3 h-3 text-amber-400/60 shrink-0 mt-1" />
                            <img
                              src={reply.userAvatar}
                              alt={reply.userName}
                              className="w-6 h-6 rounded-full object-cover border border-amber-500/30 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-amber-300 text-[11px] truncate">{reply.userName}</span>
                                <span className="text-[9px] text-stone-400 font-mono">{reply.userUsername}</span>
                              </div>
                              <p className="text-stone-200 text-xs mt-0.5 break-words font-mukta">
                                {reply.text}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-stone-400">
                                {isOwnReply && (
                                  <button
                                    onClick={() => deleteComment(reply.id)}
                                    className="hover:text-red-400 flex items-center gap-1"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" /> हटाएं
                                  </button>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleCommentLike(reply.id)}
                              className="flex flex-col items-center gap-0.5 text-stone-400 hover:text-red-400"
                            >
                              <Heart className={`w-3 h-3 ${replyLiked ? 'text-red-500 fill-red-500' : ''}`} />
                              <span className="text-[9px]">{reply.likesCount + (replyLiked ? 1 : 0)}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Devotion Emojis */}
        <div className="px-4 py-1.5 bg-stone-900/90 border-t border-stone-800 flex items-center justify-around text-lg">
          {['🙏', '🪔', '🌅', '❤️', '🌾', '✨', '💐'].map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => addQuickEmoji(emoji)}
              className="hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Replying Banner */}
        {replyingTo && (
          <div className="px-4 py-1.5 bg-amber-950/40 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <span className="truncate">
              <strong>@{replyingTo.userName}</strong> को उत्तर दे रहे हैं...
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-stone-400 hover:text-white"
            >
              रद्द करें
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-stone-950 border-t border-stone-800/80 flex items-center gap-2">
          {currentUser ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs text-stone-400 shrink-0">
              👤
            </div>
          )}

          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyingTo ? 'उत्तर लिखें...' : 'छठी मईया की महिमा में एक पावन विचार लिखें...'}
            className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-all"
          />

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold hover:scale-105 active:scale-95 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
