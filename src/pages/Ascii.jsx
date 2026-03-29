import { useState, useRef, useEffect } from 'react';
import asciiFile from '../assets/ascii.json';
import AsciiFilters from '../components/AsciiFilters';

function AsciiCard({ item }) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const preRef = useRef(null);
  const boxRef = useRef(null);

  function handleCopy() {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;

    function recalc() {
      const x = box.clientWidth / pre.scrollWidth;
      const y = box.clientHeight / pre.scrollHeight;
      setScale(Math.min(x, y, 1));
    }

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="font-jetbrains relative group w-full h-full rounded-2xl border border-reverse/50 hover:border-reverse/70 hover:shadow-md hover:shadow-zinc-700/40 flex flex-col">
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 px-3 py-3 rounded-4xl border text-xs transition-all duration-500 ${
          copied ? 'bg-green-500 border-green-500 text-white' : 'bg-accent-bg hover:border-accent-text/30'
        }`}
      >
        {copied ? (
          <svg className="w-4 h-4"><use href="/sprite.svg#icon-tick" className="fill-accent-text" /></svg>
        ) : (
          <svg className="w-5 h-5"><use href="/sprite.svg#icon-copy" className="fill-accent-text" /></svg>
        )}
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
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3"><use href="/sprite.svg#icon-heart" className="fill-[#E85555]" /></svg>
            67
          </p>
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-4 w-4"><use href="/sprite.svg#icon-eye" className="fill-reverse/50" /></svg>
            1444
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

// big card left on even groups, right on odd
function cardLayout(i) {
  const group = Math.floor(i / 3);
  const pos = i % 3;
  const even = group % 2 === 0;
  if (pos === 0) return { span: 'lg:col-span-2 lg:row-span-2', order: even ? 'lg:order-first' : 'lg:order-last' };
  return { span: '', order: even ? 'lg:order-last' : 'lg:order-first' };
}

function Ascii() {
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
                    <AsciiCard item={item} />
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