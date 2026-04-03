import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ViewsCounter({ pageId = 'home' }) {
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState(0);

  const fetchViews = async () => {
    const { data, error } = await supabase
      .from('page_views')
      .select('views')
      .eq('id', pageId)
      .single();

    if (error) return console.error(error);

    setCount(data?.views ?? 0);
  };

  const countViews = async () => {
    await supabase.rpc('count_views', { row_id: pageId });
  };

  useEffect(() => {
    const run = async () => {
      await countViews();
      await fetchViews();
    };

    run();
  }, [pageId]);
  useEffect(() => {
    let start = display;
    let end = count;

    if (start === end) return;

    const duration = 600;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    let current = start;
    let i = 0;

    const interval = setInterval(() => {
      i++;
      current += increment;

      if (i >= steps) {
        setDisplay(end);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex items-center gap-2 bg-area px-2 py-2 rounded-md text-accent-text">
      <span className="text-lg font-bold flex gap-2">
        {display
          .toString()
          .split('')
          .map((digit, i) => (
            <span
              key={i}
              className="font-grotesk bg-accent-bg p-2 rounded-sm transition-all"
            >
              {digit}
            </span>
          ))}
      </span>
    </div>
  );
}

export default ViewsCounter;
