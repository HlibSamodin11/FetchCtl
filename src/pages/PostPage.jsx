import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostPage({ user, onOpenLogin }) {
  const { id } = useParams();
  const nav = useNavigate();

  const [post,        setPost]        = useState(null);
  const [views,       setViews]       = useState(0);
  const [likes,       setLikes]       = useState(0);
  const [liked,       setLiked]       = useState(false);
  const [comments,    setComments]    = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commenting,  setCommenting]  = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(id, username, display_name, avatar_url)')
        .eq('id', id)
        .single();
      setPost(data);

      const { data: v } = await supabase
        .from('post_views')
        .select('views')
        .eq('post_id', id)
        .single();
      const cur = v?.views || 0;
      setViews(cur + 1);
      await supabase.from('post_views').update({ views: cur + 1 }).eq('post_id', id);

      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id);
      setLikes(count || 0);

      if (user) {
        const { data: lk } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setLiked(!!lk);

        // only load comments if logged in (RLS enforces this too)
        await loadComments();
      }

      setLoading(false);
    }
    load();
  }, [id, user]);

  async function loadComments() {
    const { data } = await supabase
      .from('post_comments')
      .select('*, profiles(username, avatar_url, display_name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
  }

  async function toggleLike() {
    if (!user) return;
    if (liked) {
      setLiked(false);
      setLikes(l => l - 1);
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikes(l => l + 1);
      await supabase.from('post_likes').insert({ post_id: id, user_id: user.id });
    }
  }

  async function submitComment() {
    if (!commentText.trim() || !user) return;
    setCommenting(true);
    await supabase.from('post_comments').insert({ post_id: id, user_id: user.id, content: commentText.trim() });
    setCommentText('');
    await loadComments();
    setCommenting(false);
  }

  async function deleteComment(cid) {
    await supabase.from('post_comments').delete().eq('id', cid);
    setComments(prev => prev.filter(c => c.id !== cid));
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyAscii() {
    navigator.clipboard.writeText(post.content);
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-main-text/40 text-sm font-jetbrains animate-pulse">loading...</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-accent-text font-bold text-3xl font-jetbrains">404</p>
      <p className="text-main-text/40 text-sm">post not found</p>
      <button onClick={() => nav(-1)} className="text-xs text-accent-text/40 hover:text-accent-text transition underline">
        ← go back
      </button>
    </div>
  );

  const author = post.profiles;
  const isOwn  = user?.id === author?.id;

  return (
    <div className="bg-bg min-h-screen px-6 md:px-12 flex justify-center">
      <div className="container py-10 max-w-3xl">

        <button onClick={() => nav(-1)} className="flex items-center gap-2 text-accent-text text-xl mb-10">
          <svg className="w-5 h-5"><use href="/sprite.svg#icon-arrow" className="fill-main-text rotate-180 origin-center" /></svg>
          Post
        </button>

        <Link to={`/u/${author.username}`} className="flex items-center gap-3 mb-6 group no-underline">
          <Avatar profile={author} size={36} />
          <div>
            <p className="text-accent-text font-bold text-sm group-hover:underline">{author.display_name || author.username}</p>
            <p className="text-main-text/40 text-xs">@{author.username}</p>
          </div>
        </Link>

        <h1 className="text-accent-text font-bold text-2xl font-jetbrains mb-2">{post.title}</h1>
        {post.description && (
          <p className="text-main-text/60 text-sm mb-6">{post.description}</p>
        )}

        {post.tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <li key={tag} className="text-xs text-main-text/80 border border-main-text/50 px-2 py-1 rounded-2xl">#{tag}</li>
            ))}
          </ul>
        )}

        <div className="relative group rounded-2xl border border-reverse/50 p-6 mb-6 overflow-x-auto">
          <button
            onClick={copyAscii}
            className="absolute top-3 right-3 px-3 py-2 rounded-xl border border-accent-text/20 bg-accent-bg text-xs text-accent-text hover:border-accent-text/50 transition opacity-0 group-hover:opacity-100"
          >
            copy
          </button>
          <pre className="text-accent-text text-xs leading-tight whitespace-pre font-mono">{post.content}</pre>
        </div>

        <div className="flex items-center gap-5 flex-wrap mb-10">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 transition-all hover:scale-110 ${user ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
          >
            <svg className="h-4 w-4">
              <use href="/sprite.svg#icon-heart" className={liked ? 'fill-[#E85555]' : 'fill-reverse/30'} />
            </svg>
            <span className={`text-sm ${liked ? 'text-[#E85555]' : 'text-reverse/50'}`}>{likes}</span>
          </button>

          <span className="flex items-center gap-2 text-reverse/50 text-sm">
            <svg className="h-4 w-4"><use href="/sprite.svg#icon-eye" className="fill-reverse/50" /></svg>
            {views}
          </span>

          <button
            onClick={copyLink}
            className="text-xs px-4 py-2 rounded-xl border border-accent-text/20 text-accent-text hover:border-accent-text/50 transition"
          >
            {copied ? '✓ link copied' : 'share'}
          </button>

          {isOwn && (
            <button
              onClick={async () => { await supabase.from('posts').delete().eq('id', id); nav(-1); }}
              className="ml-auto text-xs px-4 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
            >
              delete
            </button>
          )}
        </div>

        <p className="text-main-text/20 text-xs mb-12">
          {new Date(post.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* comments */}
        <div className="border-t border-accent-text/10 pt-8">
          <p className="text-[10px] uppercase tracking-widest text-main-text/30 font-jetbrains mb-6">
            Comments{user ? ` · ${comments.length}` : ''}
          </p>

          {!user ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-accent-text/10">
              <p className="text-main-text/40 text-sm">log in to view and post comments</p>
              <button
                onClick={onOpenLogin}
                className="text-xs px-5 py-2 rounded-xl bg-get-started-bg text-get-started-text font-bold hover:opacity-80 transition font-jetbrains"
              >
                log in
              </button>
            </div>
          ) : (
            <>
              {/* input */}
              <div className="flex gap-3 mb-8">
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                    placeholder="write a comment... (enter to post)"
                    rows={2}
                    className="w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-2.5 text-sm text-accent-text placeholder:text-main-text/30 outline-none focus:border-accent-text/50 transition resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={submitComment}
                      disabled={commenting || !commentText.trim()}
                      className="text-xs px-5 py-2 rounded-xl bg-get-started-bg text-get-started-text font-bold hover:opacity-80 transition disabled:opacity-40"
                    >
                      {commenting ? 'posting...' : 'post'}
                    </button>
                  </div>
                </div>
              </div>

              {/* list */}
              <div className="flex flex-col gap-5">
                {comments.length === 0 && (
                  <p className="text-main-text/20 text-sm">no comments yet — be the first</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3 group/comment">
                    <Link to={`/u/${c.profiles.username}`} className="shrink-0">
                      <Avatar profile={c.profiles} size={28} />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <Link to={`/u/${c.profiles.username}`} className="text-accent-text text-xs font-bold hover:underline no-underline">
                          @{c.profiles.username}
                        </Link>
                        <span className="text-main-text/20 text-[10px]">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-main-text/70 text-sm leading-relaxed">{c.content}</p>
                    </div>
                    {user?.id === c.user_id && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="text-main-text/20 hover:text-red-500 transition text-xs opacity-0 group-hover/comment:opacity-100 shrink-0"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function Avatar({ profile, size = 36 }) {
  const { username, avatar_url } = profile;
  const hue = username ? [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;

  if (avatar_url) return (
    <img src={avatar_url} alt={username} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />
  );

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold font-jetbrains shrink-0"
      style={{ width: size, height: size, background: `hsl(${hue}deg 40% 18%)`, color: `hsl(${hue}deg 70% 70%)`, fontSize: size * 0.35 }}
    >
      {username?.slice(0, 2).toUpperCase() ?? '??'}
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