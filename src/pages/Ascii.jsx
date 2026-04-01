import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import asciiFile from '../assets/ascii.json';
import AsciiFilters from '../components/AsciiFilters';
import AsciiCard from '../components/AsciiCard';
import PostCard from '../components/PostCard';

const score = art => art.length * Math.max(...art.map(l => [...l].length));
const bigLeft = id => id.split('').reduce((a, c) => a ^ c.charCodeAt(0), 0) % 2 === 0;

function pickBig(group) {
  if (group.length < 3) return { big: group[0], smalls: group.slice(1) };
  const [first, ...rest] = [...group].sort((a, b) => score(b.art) - score(a.art));
  return { big: first, smalls: rest };
}

function renderCard(item, user, onOpenLogin, big = false) {
  if (item._type === 'post') return <PostCard post={item._raw} user={user} big={big} />;
  return <AsciiCard item={item} user={user} onOpenLogin={onOpenLogin} big={big} />;
}

function CardGroup({ big, smalls, user, onOpenLogin, left }) {
  const BigCard = <div className="md:flex-[2] min-w-0 flex">{renderCard(big, user, onOpenLogin, true)}</div>;
  const SmallCards = (
    <div className="md:flex-[1] min-w-0 flex flex-col gap-6">
      {smalls.map(item => <div key={item.id} className="flex flex-1">{renderCard(item, user, onOpenLogin, false)}</div>)}
    </div>
  );
  return (
    <div className="flex flex-col md:flex-row md:items-stretch gap-6 w-full">
      {left ? <>{BigCard}{SmallCards}</> : <>{SmallCards}{BigCard}</>}
    </div>
  );
}

function postToItem(p) {
  const lines = p.content.split('\n');
  return {
    id: p.id,
    name: p.title,
    description: p.description || '',
    tags: p.tags ?? [],
    color: 'un-coloured',
    art: lines,
    _type: 'post',
    _raw: p,
  };
}

function Ascii({ user, onOpenLogin }) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*, profiles(username, avatar_url, display_name), post_views(views)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data ?? []).map(postToItem));
        setLoadingPosts(false);
      });
  }, []);

  const allItems = [...posts, ...asciiFile.ascii];

  return (
    <section className="bg-bg py-20 flex flex-col items-center px-6 md:px-12">
      <AsciiFilters items={allItems}>
        {filtered => {
          if (!filtered.length)
            return <p className="text-main-text text-sm text-center">no results found</p>;

          const groups = [];
          for (let i = 0; i < filtered.length; i += 3)
            groups.push(filtered.slice(i, i + 3));

          return (
            <div className="container flex flex-col gap-6">
              {loadingPosts && (
                <p className="text-main-text/30 text-xs font-jetbrains animate-pulse">loading community posts...</p>
              )}
              {groups.map((group, gi) => {
                const { big, smalls } = pickBig(group);

                if (smalls.length === 0)
                  return <div key={gi} className="flex">{renderCard(big, user, onOpenLogin, false)}</div>;

                if (smalls.length === 1)
                  return (
                    <div key={gi} className="flex flex-col md:flex-row md:items-stretch gap-6">
                      <div className="md:flex-1 min-w-0 flex">{renderCard(big, user, onOpenLogin, true)}</div>
                      <div className="md:flex-1 min-w-0 flex">{renderCard(smalls[0], user, onOpenLogin, true)}</div>
                    </div>
                  );

                return (
                  <CardGroup key={gi} big={big} smalls={smalls} user={user} onOpenLogin={onOpenLogin} left={bigLeft(big.id)} />
                );
              })}
            </div>
          );
        }}
      </AsciiFilters>
    </section>
  );
}

export default Ascii;