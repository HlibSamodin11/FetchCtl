import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function getCardHeight(art, big) {
  const rows = art.length;
  const cols = Math.max(...art.map(l => [...l].length));
  const tall = rows >= 20 || cols >= 50;
  const mid  = rows >= 10 || cols >= 25;
  if (big) return tall ? 480 : mid ? 380 : 280;
  return tall ? 220 : mid ? 160 : 100;
}

export default function PostCard({ post, user, big = false }) {
  const nav = useNavigate();
  const [copied, setCopied] = useState(false);
  const [scale,  setScale]  = useState(1);
  const [views,  setViews]  = useState(post.post_views?.views ?? null);
  const [likes,  setLikes]  = useState(0);
  const [liked,  setLiked]  = useState(false);
  const preRef = useRef(null);
  const boxRef = useRef(null);

  const art    = post.content.split('\n');
  const author = post.profiles;

  useEffect(() => {
    supabase
      .from('post_likes')
      .select('user_id')
      .eq('post_id', post.id)
      .then(({ data }) => {
        if (!data) return;
        setLikes(data.length);
        if (user) setLiked(data.some(r => r.user_id === user.id));
      });
  }, [post.id, user]);

  useEffect(() => {
    if (views !== null) return;
    supabase
      .from('post_views')
      .select('views')
      .eq('post_id', post.id)
      .single()
      .then(({ data }) => {
        if (data) setViews(data.views);
      });
  }, [post.id, views]);

  // scale ascii art to fit whatever box it lands in
  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;

    const fit = () => {
      if (!pre.scrollWidth || !pre.scrollHeight) return;
      setScale(Math.min(
        box.clientWidth  / pre.scrollWidth,
        box.clientHeight / pre.scrollHeight,
        1
      ));
    };

    const t  = setTimeout(fit, 50);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);

  function copy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function toggleLike(e) {
    e.stopPropagation();
    if (!user) return;

    if (liked) {
      setLiked(false);
      setLikes(n => n - 1);
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikes(n => n + 1);
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id });
    }
  }

  return (
    <div
      onClick={() => nav(`/post/${post.id}`)}
      className="font-jetbrains relative group w-full flex flex-col flex-1 rounded-2xl border border-reverse/50 hover:border-reverse/70 hover:shadow-md hover:shadow-zinc-700/40 cursor-pointer"
    >
      <button
        onClick={copy}
        className={`absolute top-3 right-3 px-3 py-3 rounded-4xl border text-xs transition-all duration-500 z-10 ${
          copied
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-accent-bg hover:border-accent-text/30'
        }`}
      >
        {copied
          ? <svg className="w-4 h-4"><use href="/sprite.svg#icon-tick" className="fill-accent-text" /></svg>
          : <svg className="w-5 h-5"><use href="/sprite.svg#icon-copy" className="fill-accent-text" /></svg>
        }
      </button>

      <div
        ref={boxRef}
        className="w-full flex-1 flex items-center justify-center overflow-hidden mt-10 mb-4 px-4"
        style={{ minHeight: getCardHeight(art, big) }}
      >
        <pre
          ref={preRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="text-accent-text text-xs leading-tight whitespace-pre font-sans"
        >
          {post.content}
        </pre>
      </div>

      <div className="p-3">
        <h3 className="text-accent-text">{post.title}</h3>
        {post.description && (
          <p className="text-main-text/50">{post.description}</p>
        )}

        <div className="flex gap-5 py-1 flex-wrap">
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3"><use href="/sprite.svg#icon-user" className="fill-reverse/50" /></svg>
            {author ? `@${author.username}` : 'unknown'}
          </p>

          <button onClick={toggleLike} className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-all">
            <svg className="h-3 w-3">
              <use href="/sprite.svg#icon-heart" className={liked ? 'fill-[#E85555]' : 'fill-reverse/30'} />
            </svg>
            <span className={liked ? 'text-[#E85555]' : 'text-reverse/50'}>{likes}</span>
          </button>

          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-4 w-4"><use href="/sprite.svg#icon-eye" className="fill-reverse/50" /></svg>
            {views ?? '...'}
          </p>

          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3"><use href="/sprite.svg#icon-clock" className="fill-reverse/50" /></svg>
            {timeAgo(post.created_at)}
          </p>
        </div>

        {post.tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-1">
            {post.tags.map(tag => (
              <li key={tag} className="text-xs transition-all text-main-text/80 border border-main-text/50 px-2 py-1 rounded-2xl hover:text-main-text hover:border-main-text">
                #{tag}
              </li>
            ))}
          </ul>
        )}
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