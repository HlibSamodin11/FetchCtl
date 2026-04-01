import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import asciiFile from '../assets/ascii.json';
import AsciiCard from '../components/AsciiCard';
import PostCard from '../components/PostCard';

function bannerStyle(username) {
  if (!username) return {};
  const hue = [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 60) % 360;
  return { background: `linear-gradient(135deg, hsl(${hue}deg 30% 12%) 0%, hsl(${hue2}deg 25% 18%) 50%, hsl(${hue}deg 20% 10%) 100%)` };
}

function Avatar({ profile, size = 80 }) {
  const { username, avatar_url } = profile;
  const initials = username?.slice(0, 2).toUpperCase() ?? '??';
  const hue = username ? [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;
  if (avatar_url) return (
    <img src={avatar_url} alt={username} className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size, boxShadow: `0 0 0 3px var(--color-bg), 0 0 0 4px hsl(${hue}deg 40% 30%)` }} />
  );
  return (
    <div className="rounded-full flex items-center justify-center font-bold font-jetbrains shrink-0"
      style={{ width: size, height: size, background: `hsl(${hue}deg 40% 18%)`, color: `hsl(${hue}deg 70% 70%)`, fontSize: size * 0.3, boxShadow: `0 0 0 3px var(--color-bg), 0 0 0 4px hsl(${hue}deg 40% 30%)` }}>
      {initials}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-6 py-3 rounded-xl bg-accent-bg border border-accent-text/10">
      <span className="text-accent-text font-bold text-lg font-jetbrains">{value}</span>
      <span className="text-main-text/40 text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function Profile({ currentUser }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const isOwn = currentUser && profile && currentUser.id === profile.id;

  useEffect(() => {
    setLoading(true); setNotFound(false); setProfile(null); setLikedIds([]); setPosts([]);

    supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, location, website, created_at')
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return; }
        setProfile(data);

        // likes
        supabase.from('art_likes').select('art_id').eq('user_id', data.id)
          .then(({ data: likes }) => setLikedIds(likes?.map(l => l.art_id) ?? []));

        // posts
        supabase.from('posts')
          .select('*, profiles(username, avatar_url, display_name)')
          .eq('user_id', data.id)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .then(({ data: p }) => { setPosts(p ?? []); setLoading(false); });
      });
  }, [username]);

  function shareProfile() {
    navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  const likedArts = asciiFile.ascii.filter(a => likedIds.includes(a.id));
  const joinedDate = profile ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' }) : '';

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-main-text/40 text-sm font-jetbrains animate-pulse">loading...</p>
    </div>
  );

  if (notFound) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-accent-text font-bold text-3xl font-jetbrains">@{username}</p>
      <p className="text-main-text/40 text-sm">this user doesn't exist</p>
      <button onClick={() => navigate('/ascii')} className="text-xs text-accent-text/40 hover:text-accent-text transition underline mt-2">← back to gallery</button>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen">
      <div className="w-full h-40 md:h-52" style={bannerStyle(profile.username)} />

      <div className="px-6 md:px-12">
        <div className="container mx-auto">
          <div className="flex items-end justify-between -mt-10 mb-5 flex-wrap gap-3">
            <Avatar profile={profile} size={80} />
            <div className="flex gap-2 items-center mb-1">
              <button
                onClick={shareProfile}
                className="text-xs px-4 py-2 rounded-xl border border-accent-text/20 text-accent-text hover:border-accent-text/50 transition-all font-jetbrains"
              >
                {shareCopied ? '✓ copied' : 'share'}
              </button>
              {isOwn && (
                <>
                  <button
                    onClick={() => navigate('/post/new')}
                    className="text-xs px-4 py-2 rounded-xl bg-get-started-bg text-get-started-text font-bold hover:opacity-80 transition font-jetbrains"
                  >
                    + post
                  </button>
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="text-xs px-4 py-2 rounded-xl border border-accent-text/20 text-accent-text hover:border-accent-text/50 transition-all font-jetbrains"
                  >
                    edit profile
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-1">
            {profile.display_name && (
              <h1 className="text-accent-text font-bold text-xl font-jetbrains leading-tight">{profile.display_name}</h1>
            )}
            <p className={`font-jetbrains ${profile.display_name ? 'text-main-text/50 text-sm' : 'text-accent-text font-bold text-xl'}`}>
              @{profile.username}
            </p>
            {profile.bio && <p className="text-main-text/70 text-sm mt-2 max-w-md leading-relaxed">{profile.bio}</p>}

            <div className="flex flex-wrap gap-4 mt-2">
              {profile.location && (
                <span className="flex items-center gap-1.5 text-xs text-main-text/40">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-accent-text/60 hover:text-accent-text transition">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="flex items-center gap-1.5 text-xs text-main-text/30">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                joined {joinedDate}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <StatPill label="posts" value={posts.length} />
            <StatPill label="liked" value={likedIds.length} />
          </div>

          {/* tabs */}
          <div className="flex gap-1 bg-accent-bg border border-button-stroke rounded-xl p-1 mb-8 w-fit">
            {['posts', 'liked'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === t ? 'bg-get-started-bg text-get-started-text shadow-sm ring-1 ring-black/20' : 'text-main-text hover:text-accent-text'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="border-t border-accent-text/10 mb-8" />

          <div className="pb-24">
            {tab === 'posts' && (
              <>
                {posts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <p className="text-5xl opacity-10 select-none">◇</p>
                    <p className="text-main-text/30 text-sm">{isOwn ? "you haven't posted anything yet" : 'no posts yet'}</p>
                    {isOwn && (
                      <button onClick={() => navigate('/post/new')}
                        className="text-xs text-accent-text/40 hover:text-accent-text transition underline mt-1">
                        create your first post →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(p => <PostCard key={p.id} post={p} />)}
                  </div>
                )}
              </>
            )}

            {tab === 'liked' && (
              <>
                {likedArts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <p className="text-5xl opacity-10 select-none">◇</p>
                    <p className="text-main-text/30 text-sm">{isOwn ? "you haven't liked anything yet" : 'no liked art yet'}</p>
                    {isOwn && (
                      <button onClick={() => navigate('/ascii')}
                        className="text-xs text-accent-text/40 hover:text-accent-text transition underline mt-1">
                        browse the gallery →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedArts.map(item => <AsciiCard key={item.id} item={item} user={currentUser} onOpenLogin={() => {}} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}