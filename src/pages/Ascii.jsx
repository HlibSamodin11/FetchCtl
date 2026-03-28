import { useState, useRef, useEffect } from 'react';
import asciiFile from '../assets/ascii.json';

function AsciiCard({ item }) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);

  const preRef = useRef(null);
  const containerRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    // sclaes ascii properly on reload
    const pre = preRef.current;
    const container = containerRef.current;

    const scaleX = container.clientWidth / pre.scrollWidth;
    const scaleY = container.clientHeight / pre.scrollHeight;

    setScale(Math.min(scaleX, scaleY));
  });

  return (
    <div className="font-jetbrains relative group w-full h-full rounded-2xl border border-zinc-700 hover:border-zinc-400 hover:shadow-md hover:shadow-zinc-700/40 flex flex-col">
      <button
        className={`absolute top-3 right-3 px-3 py-1 rounded-xl border text-xs transition-all duration-500 ${
          copied
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
        }`}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <div
        ref={containerRef}
        className="flex-1 mt-10 mb-4 w-full flex items-center justify-center overflow-hidden"
      >
        <pre
          ref={preRef}
          style={{ transform: `scale(${scale})` }}
          className="text-accent-text text-xs leading-tight whitespace-pre origin-center font-sans"
        >
          {item.art.join('\n')}
        </pre>
      </div>

      <div className="p-3">
        <h3 className="text-accent-text ">Title</h3>
        <p className="text-main-text/50">Description</p>
        <div className="flex gap-5 py-1  flex-wrap">
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3">
              <use
                href="/sprite.svg#icon-user"
                className="fill-reverse/50"
              ></use>
            </svg>
            Creator
          </p>
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3">
              <use
                href="/sprite.svg#icon-heart"
                className="fill-[#E85555] "
              ></use>
            </svg>
            67
          </p>
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-4 w-4">
              <use
                href="/sprite.svg#icon-eye "
                className="fill-reverse/50"
              ></use>
            </svg>
            Creator
          </p>
          <p className="flex items-center gap-2 text-reverse/50">
            <svg className="h-3 w-3">
              <use
                href="/sprite.svg#icon-clock"
                className="fill-reverse/50"
              ></use>
            </svg>
            Creator
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="text-xs transition-all text-main-text/80  border border-main-text/50 px-2 py-1 rounded-2xl hover:text-main-text hover:border-main-text"
            >
              #{tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Ascii() {
  const data = asciiFile.ascii;

  return (
    <section className="bg-bg py-20 flex justify-center  px-6 md:px-12">
      <div className="container grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {data.map((item, i) => {
          // Check which group of 3 it is rn
          const groupIndex = Math.floor(i / 3);

          // true if every second group
          const reversGroup = groupIndex % 2 === 1;

          // Check what number in group current item is
          const numInGroup = i % 3;

          //reverses the group
          const posInGroup = reversGroup ? 1 - numInGroup : numInGroup;

          // sets the big boy
          const bigBoy = posInGroup === 0;

          return (
            <div
              key={item.id}
              className={bigBoy ? 'lg:col-span-2 lg:row-span-2' : ''}
            >
              <AsciiCard item={item} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default Ascii;
