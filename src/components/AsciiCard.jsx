import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function cardHeight(art, big) {
  const rows = art.length;
  const cols = Math.max(...art.map((l) => [...l].length));
  const tall = rows >= 20 || cols >= 50;
  const mid = rows >= 10 || cols >= 25;
  if (big) return tall ? 480 : mid ? 380 : 280;
  return tall ? 220 : mid ? 160 : 100;
}

function AsciiCard({ item, user, onOpenLogin, big = false }) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [views, setViews] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const preRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        supabase.rpc('count_view', { art: item.id }).then(() =>
          supabase
            .from('art_views')
            .select('views')
            .eq('art_id', item.id)
            .single()
            .then(({ data }) => data && setViews(data.views)),
        );
      },
      { threshold: 0.5 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, [item.id]);

  useEffect(() => {
    supabase
      .from('art_likes')
      .select('user_id')
      .eq('art_id', item.id)
      .then(({ data }) => {
        if (!data) return;
        setLikes(data.length);
        if (user) setLiked(data.some((r) => r.user_id === user.id));
      });
  }, [item.id, user]);

  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;
    const fit = () => {
      if (!pre.scrollWidth || !pre.scrollHeight) return;
      setScale(
        Math.min(
          box.clientWidth / pre.scrollWidth,
          box.clientHeight / pre.scrollHeight,
          1,
        ),
      );
    };
    const t = setTimeout(fit, 50);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);

  function copy() {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function toggleLike() {
    if (!user) { onOpenLogin(); return; }
    if (liked) {
      setLiked(false);
      setLikes((n) => n - 1);
      await supabase.from('art_likes').delete().eq('art_id', item.id).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikes((n) => n + 1);
      await supabase.from('art_likes').insert({ art_id: item.id, user_id: user.id });
    }
  }

  return (
    <div className="font-jetbrains relative group w-full flex flex-col flex-1 rounded-2xl border border-reverse/50 hover:border-reverse/70 hover:shadow-md hover:shadow-zinc-700/40">
      <button
        onClick={copy}
        className={`absolute top-3 right-3 px-3 py-3 rounded-4xl border text-xs transition-all duration-500 z-10 ${
          copied
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-accent-bg hover:border-accent-text/30'
        }`}
      >
        {copied ? (
          <svg className="w-4 h-4"><use href="/sprite.svg#icon-tick" className="fill-accent-text" /></svg>
        ) : (
          <svg className="w-5 h-5"><use href="/sprite.svg#icon-copy" className="fill-accent-text" /></svg>
        )}
      </button>

      <div
        ref={boxRef}
        className="w-full flex-1 flex items-center justify-center overflow-hidden mt-10 mb-4 px-4"
        style={{ minHeight: cardHeight(item.art, big) }}
      >
        <pre
          ref={preRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="text-accent-text text-xs leading-tight whitespace-pre font-sans"
        >
          {item.art.join('\n')}
        </pre>
      </div>

      <div className="p-3">
        <h3 className="text-accent-text">{item.name}</h3>
        <p className="text-main-text/50">{item.description}</p>

        <div className="flex gap-5 py-1 flex-wrap">
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3"><use href="/sprite.svg#icon-user" className="fill-reverse/50" /></svg>
            FetchCtl (web)
          </p>
          <button
            onClick={toggleLike}
            className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-all"
          >
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
            3 days ago
          </p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="text-xs transition-all text-main-text/80 border border-main-text/50 px-2 py-1 rounded-2xl hover:text-main-text hover:border-main-text"
            >
              #{tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AsciiCard;