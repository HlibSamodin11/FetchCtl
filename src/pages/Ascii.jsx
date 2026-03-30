import { supabase } from '../supabaseClient';
import asciiFile from '../assets/ascii.json';
import AsciiFilters from '../components/AsciiFilters';
import AsciiCard from '../components/AsciiCard';

// rough complexity score — bigger art = higher score = more likely to be the "big" card
const score = art => art.length * Math.max(...art.map(l => [...l].length));

// alternate left/right big-card placement based on id hash
const bigLeft = id => id.split('').reduce((a, c) => a ^ c.charCodeAt(0), 0) % 2 === 0;

function pickBig(group) {
  if (group.length < 3) return { big: group[0], smalls: group.slice(1) };
  const [first, ...rest] = [...group].sort((a, b) => score(b.art) - score(a.art));
  return { big: first, smalls: rest };
}

function CardGroup({ big, smalls, user, onOpenLogin, left }) {
  const BigCard = (
    <div className="md:flex-[2] min-w-0 flex">
      <AsciiCard item={big} user={user} onOpenLogin={onOpenLogin} big />
    </div>
  );
  const SmallCards = (
    <div className="md:flex-[1] min-w-0 flex flex-col gap-6">
      {smalls.map(item => (
        <AsciiCard key={item.id} item={item} user={user} onOpenLogin={onOpenLogin} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row md:items-stretch gap-6 w-full">
      {left ? <>{BigCard}{SmallCards}</> : <>{SmallCards}{BigCard}</>}
    </div>
  );
}

function Ascii({ user, onOpenLogin }) {
  return (
    <section className="bg-bg py-20 flex flex-col items-center px-6 md:px-12">
      <AsciiFilters items={asciiFile.ascii}>
        {filtered => {
          if (!filtered.length)
            return <p className="text-main-text text-sm text-center">no results found</p>;

          const groups = [];
          for (let i = 0; i < filtered.length; i += 3)
            groups.push(filtered.slice(i, i + 3));

          return (
            <div className="container flex flex-col gap-6">
              {groups.map((group, gi) => {
                const { big, smalls } = pickBig(group);

                // solo card
                if (smalls.length === 0)
                  return <div key={gi}><AsciiCard item={big} user={user} onOpenLogin={onOpenLogin} /></div>;

                // two cards side by side
                if (smalls.length === 1)
                  return (
                    <div key={gi} className="flex flex-col md:flex-row md:items-stretch gap-6">
                      <div className="md:flex-1 min-w-0 flex">
                        <AsciiCard item={big} user={user} onOpenLogin={onOpenLogin} big />
                      </div>
                      <div className="md:flex-1 min-w-0 flex">
                        <AsciiCard item={smalls[0]} user={user} onOpenLogin={onOpenLogin} big />
                      </div>
                    </div>
                  );

                // full group: 1 big + 2 smalls
                return (
                  <CardGroup
                    key={gi}
                    big={big}
                    smalls={smalls}
                    user={user}
                    onOpenLogin={onOpenLogin}
                    left={bigLeft(big.id)}
                  />
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