import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import asciiFile from '../assets/ascii.json';
import AsciiFilters from '../components/AsciiFilters';

function AsciiCard({ item, user }) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [views, setViews] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const preRef = useRef(null);
  const boxRef = useRef(null);

  // only tick the view counter once the card is actually on screen
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      supabase.rpc('count_view', { art: item.id }).then(() => {
        supabase
          .from('art_views')
          .select('views')
          .eq('art_id', item.id)
          .single()
          .then(({ data }) => {
            if (data) setViews(data.views);
          });
      });
    }, { threshold: 0.5 });

    observer.observe(box);
    return () => observer.disconnect();
  }, [item.id]);

  // grab like count + check if this user already liked it
  useEffect(() => {
    supabase
      .from('art_likes')
      .select('user_id')
      .eq('art_id', item.id)
      .then(({ data }) => {
        if (!data) return;
        setLikes(data.length);
        if (user) setLiked(data.some(row => row.user_id === user.id));
      });
  }, [item.id, user]);

  // scale the art down to fit its container
  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;

    const recalc = () => {
      const scaleX = box.clientWidth / pre.scrollWidth;
      const scaleY = box.clientHeight / pre.scrollHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleLike() {
    if (!user) return;

    if (liked) {
      setLiked(false);
      setLikes(prev => prev - 1);
      await supabase
        .from('art_likes')
        .delete()
        .eq('art_id', item.id)
        .eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikes(prev => prev + 1);
      await supabase
        .from('art_likes')
        .insert({ art_id: item.id, user_id: user.id });
    }
  }

  // heart is red if logged out (just decorative) or if logged in and liked
  // heart is gray only when logged in but not yet liked
  const heartRed = !user || liked;

  return (
    <div className="font-jetbrains relative group w-full h-full rounded-2xl border border-reverse/50 hover:border-reverse/70 hover:shadow-md hover:shadow-zinc-700/40 flex flex-col">

      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 px-3 py-3 rounded-4xl border text-xs transition-all duration-500 ${
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

      <div ref={boxRef} className="flex-1 mt-10 mb-4 w-full flex items-center justify-center overflow-hidden">
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
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all ${
              user ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            <svg className="h-3 w-3">
              <use
                href="/sprite.svg#icon-heart"
                className={heartRed ? 'fill-[#E85555]' : 'fill-reverse/30'}
              />
            </svg>
            <span className={heartRed ? 'text-[#E85555]' : 'text-reverse/50'}>
              {likes}
            </span>
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
          {item.tags.map(tag => (
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

// every 3 cards the big one flips sides
function cardLayout(i) {
  const group = Math.floor(i / 3);
  const pos = i % 3;
  const isEven = group % 2 === 0;

  if (pos === 0) return {
    span: 'lg:col-span-2 lg:row-span-2',
    order: isEven ? 'lg:order-first' : 'lg:order-last',
  };

  return {
    span: '',
    order: isEven ? 'lg:order-last' : 'lg:order-first',
  };
}

function Ascii({ user }) {
  return (
    <section className="bg-bg py-20 flex flex-col items-center px-6 md:px-12">
      <AsciiFilters items={asciiFile.ascii}>
        {filtered => (
          <div className="container grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((item, i) => {
                const { span, order } = cardLayout(i);
                return (
                  <div key={item.id} className={`${span} ${order}`}>
                    <AsciiCard item={item} user={user} />
                  </div>
                );
              })
            ) : (
              <p className="text-main-text text-sm col-span-3 text-center">no results found</p>
            )}
          </div>
        )}
      </AsciiFilters>
    </section>
  );
}

export default Ascii;