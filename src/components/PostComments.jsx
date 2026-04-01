// src/components/PostComments.jsx
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PostComments({ postId, user, onOpenLogin }) {
  const [comments, setComments] = useState([]);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    supabase
      .from('post_comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setComments(data ?? []); setLoading(false); });
  }, [postId, user]);

  async function submit() {
    if (!text.trim() || sending) return;
    setSending(true);

    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: user.id, content: text.trim() })
      .select('*, profiles(username, avatar_url)')
      .single();

    setSending(false);
    if (error) return;
    setComments(c => [...c, data]);
    setText('');
  }

  async function deleteComment(id) {
    await supabase.from('post_comments').delete().eq('id', id);
    setComments(c => c.filter(c => c.id !== id));
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  // not logged in — show prompt
  if (!user) return (
    <div className="mt-10">
      <p className="text-[10px] uppercase tracking-widest text-main-text/30 font-jetbrains mb-4">Comments</p>
      <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-accent-text/10">
        <p className="text-main-text/40 text-sm">log in to view and post comments</p>
        <button
          onClick={onOpenLogin}
          className="text-xs px-5 py-2 rounded-xl bg-get-started-bg text-get-started-text font-bold hover:opacity-80 transition font-jetbrains"
        >
          log in
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      <p className="text-[10px] uppercase tracking-widest text-main-text/30 font-jetbrains mb-4">
        Comments {!loading && `(${comments.length})`}
      </p>

      {/* comment list */}
      <div className="flex flex-col gap-4 mb-6">
        {loading && (
          <p className="text-main-text/30 text-xs font-jetbrains animate-pulse">loading...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-main-text/20 text-sm">no comments yet — be the first</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 group">
            <div className="w-7 h-7 rounded-full bg-accent-bg shrink-0 overflow-hidden">
              {c.profiles?.avatar_url
                ? <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[10px] text-accent-text font-bold font-jetbrains">
                    {c.profiles?.username?.slice(0, 2).toUpperCase() ?? '??'}
                  </div>
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-accent-text font-jetbrains font-bold">
                  @{c.profiles?.username ?? 'unknown'}
                </span>
                <span className="text-[10px] text-main-text/30">{timeAgo(c.created_at)}</span>
                {user.id === c.user_id && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-[10px] text-main-text/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100 ml-auto"
                  >
                    delete
                  </button>
                )}
              </div>
              <p className="text-sm text-main-text/70 leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* input */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="write a comment..."
          rows={2}
          className="flex-1 bg-button-bg border border-button-stroke rounded-xl px-4 py-2.5 text-sm text-accent-text placeholder:text-main-text/30 outline-none focus:border-accent-text/50 transition resize-none font-jetbrains"
        />
        <button
          onClick={submit}
          disabled={sending || !text.trim()}
          className="px-5 py-2.5 rounded-xl bg-get-started-bg text-get-started-text text-sm font-bold hover:opacity-80 transition disabled:opacity-40 font-jetbrains"
        >
          {sending ? '...' : 'send'}
        </button>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}