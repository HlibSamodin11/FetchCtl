import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const TABS = ['Overview', 'Posts', 'Liked', 'Following', 'Followers'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function joinedDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function bannerGradient(uname) {
  let hash = 0;
  for (let i = 0; i < (uname || '').length; i++) hash = uname.charCodeAt(i) + ((hash << 5) - hash);
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1},30%,12%) 0%, hsl(${h2},25%,16%) 100%)`;
}

function AsciiMiniCard({ content }) {
  const preRef = useRef(null);
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;
    const fit = () => {
      if (!pre.scrollWidth || !pre.scrollHeight) return;
      setScale(Math.min(box.clientWidth / pre.scrollWidth, box.clientHeight / pre.scrollHeight, 1));
    };
    const t = setTimeout(fit, 50);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [content]);

  return (
    <div ref={boxRef} className="w-full h-full overflow-hidden flex items-center justify-center relative">
      <pre
        ref={preRef}
        className="whitespace-pre font-mono leading-none text-xs text-accent-text absolute"
        style={{ transform: `scale(${scale})` }}
      >
        {content}
      </pre>
    </div>
  );
}

function UserCard({ profile }) {
  return (
    <Link
      to={`/u/${profile.username}`}
      className="flex items-center gap-3 p-3 bg-accent-bg border border-area-border rounded-xl hover:border-main-text transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-area-border overflow-hidden flex-shrink-0 flex items-center justify-center">
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          : <span className="text-accent-text font-bold font-jetbrains text-sm">
              {profile.username?.slice(0, 2).toUpperCase()}
            </span>
        }
      </div>
      <div className="min-w-0">
        <p className="text-accent-text font-medium text-sm truncate">
          {profile.display_name || profile.username}
        </p>
        <p className="text-main-text text-xs truncate">@{profile.username}</p>
      </div>
    </Link>
  );
}

export default function Profile({ user }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile,       setProfile]       = useState(null);
  const [posts,         setPosts]         = useState([]);
  const [likedPosts,    setLikedPosts]    = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [activeTab,     setActiveTab]     = useState('Overview');
  const [loading,       setLoading]       = useState(true);
  const [notFound,      setNotFound]      = useState(false);
  const [currentUser,   setCurrentUser]   = useState(null);
  const [isFollowing,   setIsFollowing]   = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const followerCount  = followersList.length;
  const followingCount = followingList.length;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  const isOwn = profile?.id === currentUser?.id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotFound(false);

      const { data: prof, error } = await supabase
        .from('profiles').select('*').eq('username', username).single();

      if (error || !prof) { setNotFound(true); setLoading(false); return; }
      setProfile(prof);

      const { data: userPosts } = await supabase
        .from('posts')
        .select('*, post_views(views)')
        .eq('user_id', prof.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      setPosts(userPosts || []);

      const { data: likesRaw } = await supabase
        .from('post_likes')
        .select('post_id, created_at')
        .eq('user_id', prof.id)
        .order('created_at', { ascending: false });

      const likedIds = (likesRaw || []).map(r => r.post_id);
      if (likedIds.length > 0) {
        const { data: likedPostsData } = await supabase
          .from('posts').select('id, title, content, description, created_at').in('id', likedIds);
        setLikedPosts(likedIds.map(id => (likedPostsData || []).find(p => p.id === id)).filter(Boolean));
      } else {
        setLikedPosts([]);
      }

      const { data: followersRaw } = await supabase
        .from('follows')
        .select('follower_id, profiles!follows_follower_id_fkey(id, username, display_name, avatar_url)')
        .eq('following_id', prof.id);
      setFollowersList((followersRaw || []).map(r => r.profiles).filter(Boolean));

      const { data: followingRaw } = await supabase
        .from('follows')
        .select('following_id, profiles!follows_following_id_fkey(id, username, display_name, avatar_url)')
        .eq('follower_id', prof.id);
      setFollowingList((followingRaw || []).map(r => r.profiles).filter(Boolean));

      setLoading(false);
    }
    load();
  }, [username]);

  useEffect(() => {
    if (!currentUser || !profile || isOwn) return;
    supabase.from('follows')
      .select('follower_id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', profile.id)
      .maybeSingle()
      .then(({ data }) => setIsFollowing(!!data));
  }, [currentUser, profile, isOwn]);

  const handleFollow = useCallback(async () => {
    if (!currentUser || !profile || followLoading) return;
    setFollowLoading(true);

    if (isFollowing) {
      await supabase.from('follows').delete()
        .eq('follower_id', currentUser.id).eq('following_id', profile.id);
      setIsFollowing(false);
      setFollowersList(prev => prev.filter(p => p.id !== currentUser.id));
    } else {
      await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: profile.id });
      setIsFollowing(true);
      const { data: me } = await supabase
        .from('profiles').select('id, username, display_name, avatar_url')
        .eq('id', currentUser.id).single();
      if (me) setFollowersList(prev => [me, ...prev]);
    }

    setFollowLoading(false);
  }, [currentUser, profile, isFollowing, followLoading]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-main-text font-jetbrains text-sm">
      loading...
    </div>
  );

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-main-text font-grotesk">
      <p className="text-accent-text text-xl font-bold">user not found</p>
      <p className="text-sm">@{username} doesn't exist.</p>
    </div>
  );

  const recentPosts = posts.slice(0, 2);
  const pinnedPost  = posts[0] || null;
  const recentLiked = likedPosts.slice(0, 4);

  return (
    <div className="bg-bg min-h-screen font-grotesk">
      <div className="container mx-auto px-3 sm:px-6 md:px-12 py-4 sm:py-8 max-w-[1200px]">

        {/* profile card */}
        <div className="bg-area border border-area-border rounded-2xl overflow-hidden mb-1">

          {/* banner */}
          <div
            className="h-[120px] sm:h-[160px] w-full"
            style={
              profile.banner_url
                ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: bannerGradient(profile.username) }
            }
          />

          {/* avatar + action row */}
          <div className="px-4 sm:px-6 relative">
            <div className="absolute -top-[38px] sm:-top-[45px] left-4 sm:left-6 w-[76px] h-[76px] sm:w-[90px] sm:h-[90px] rounded-full bg-accent-bg border-4 border-area overflow-hidden flex items-center justify-center">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-accent-text font-bold font-jetbrains text-lg sm:text-xl">
                    {profile.username?.slice(0, 2).toUpperCase()}
                  </span>
              }
            </div>

            <div className="flex justify-end pt-3 pb-4 gap-2">
              {isOwn ? (
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="border border-area-border rounded-xl px-4 py-1.5 text-sm text-accent-text hover:bg-button-bg transition-colors"
                >
                  edit profile
                </button>
              ) : currentUser ? (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                    isFollowing
                      ? 'border border-area-border text-main-text hover:border-red-400 hover:text-red-400'
                      : 'bg-accent-text text-bg hover:opacity-90'
                  }`}
                >
                  {followLoading ? '...' : isFollowing ? 'following' : 'follow'}
                </button>
              ) : null}
            </div>
          </div>

          {/* info */}
          <div className="px-4 sm:px-6 pb-5 mt-4 sm:mt-6">
            <h1 className="text-accent-text font-bold text-lg sm:text-xl leading-7">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-main-text text-sm mt-0.5">@{profile.username}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-main-text text-xs">
              {profile.location && <span>{profile.location}</span>}
              {profile.location && profile.website && <span>·</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-accent-text transition-colors">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {(profile.location || profile.website) && profile.created_at && <span>·</span>}
              {profile.created_at && <span>joined {joinedDate(profile.created_at)}</span>}
            </div>

            {profile.bio && <p className="text-main-text text-sm mt-3">{profile.bio}</p>}

            {/* stats */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: 'Followers',   value: followerCount,    tab: 'Followers' },
                { label: 'Following',   value: followingCount,   tab: 'Following' },
                { label: 'Posts Liked', value: likedPosts.length, tab: 'Liked' },
                { label: 'Posts',       value: posts.length,     tab: 'Posts' },
              ].map(({ label, value, tab }) => (
                <button
                  key={label}
                  onClick={() => tab && setActiveTab(tab)}
                  className="bg-[#171717] border border-[#322c2a] rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm text-accent-text hover:border-main-text transition-colors"
                >
                  <span className="font-bold">{value}</span>
                  <span className="font-normal text-main-text"> {label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* tabs — scrollable on mobile */}
        <div className="border-b border-area-border flex gap-4 sm:gap-6 mb-6 overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium relative transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab ? 'text-accent-text' : 'text-main-text hover:text-accent-text'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-text rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* overview tab */}
        {activeTab === 'Overview' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-5 w-full">

              {/* pinned post */}
              <div className="bg-area border border-area-border rounded-2xl p-4 sm:p-5">
                <h2 className="text-accent-text font-bold text-base mb-4">Pinned Post</h2>
                {pinnedPost ? (
                  <Link to={`/post/${pinnedPost.id}`} className="flex flex-col sm:flex-row gap-4 group">
                    <div className="w-full sm:w-[260px] h-[160px] sm:h-[200px] flex-shrink-0 bg-accent-bg border border-area-border rounded-xl overflow-hidden">
                      <AsciiMiniCard content={pinnedPost.content} />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <p className="text-accent-text font-medium group-hover:underline">{pinnedPost.title}</p>
                      {pinnedPost.description && (
                        <p className="text-main-text text-sm line-clamp-2">{pinnedPost.description}</p>
                      )}
                      <p className="text-main-text text-xs">{timeAgo(pinnedPost.created_at)}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full sm:w-[260px] h-[160px] bg-accent-bg border border-area-border rounded-xl flex items-center justify-center text-main-text text-sm">
                    no posts yet
                  </div>
                )}
              </div>

              {/* recently liked */}
              <div>
                <h2 className="text-accent-text font-bold text-base mb-3">Recently Liked</h2>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {recentLiked.length > 0
                    ? recentLiked.map(post => (
                        <Link
                          key={post.id}
                          to={`/post/${post.id}`}
                          className="w-[110px] sm:w-[120px] h-[85px] sm:h-[90px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors flex-shrink-0"
                        >
                          <AsciiMiniCard content={post.content} />
                        </Link>
                      ))
                    : [0, 1, 2, 3].map(i => (
                        <div key={i} className="w-[110px] sm:w-[120px] h-[85px] sm:h-[90px] bg-accent-bg border border-area-border rounded-xl flex-shrink-0" />
                      ))
                  }
                </div>
              </div>

              {/* recent posts */}
              <div>
                <h2 className="text-accent-text font-bold text-base mb-3">Recent Posts</h2>
                <div className="flex gap-4">
                  {recentPosts.length > 0
                    ? recentPosts.map(post => (
                        <Link
                          key={post.id}
                          to={`/post/${post.id}`}
                          className="flex-1 h-[140px] sm:h-[160px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors"
                        >
                          <AsciiMiniCard content={post.content} />
                        </Link>
                      ))
                    : [0, 1].map(i => (
                        <div key={i} className="flex-1 h-[140px] sm:h-[160px] bg-accent-bg border border-area-border rounded-xl" />
                      ))
                  }
                </div>
              </div>
            </div>

            {/* sidebar — goes below on mobile */}
            <div className="w-full lg:w-[220px] flex-shrink-0 flex flex-row lg:flex-col gap-3 flex-wrap">
              <div className="bg-area border border-area-border rounded-2xl p-4 sm:p-5 flex-1 lg:flex-none">
                <div className="flex flex-col gap-1 mb-3">
                  <button onClick={() => setActiveTab('Followers')} className="text-left text-accent-text text-lg hover:underline">
                    <span className="font-bold">{followerCount}</span>
                    <span className="text-base font-normal text-main-text"> Followers</span>
                  </button>
                  <button onClick={() => setActiveTab('Following')} className="text-left text-accent-text text-lg hover:underline">
                    <span className="font-bold">{followingCount}</span>
                    <span className="text-base font-normal text-main-text"> Following</span>
                  </button>
                </div>
                {profile.created_at && (
                  <p className="text-main-text text-sm">joined {joinedDate(profile.created_at)}</p>
                )}
              </div>

              <div className="bg-area border border-area-border rounded-2xl p-4 sm:p-5 flex-1 lg:flex-none">
                <h3 className="text-accent-text font-bold text-base mb-3">Achievements</h3>
                <div className="flex flex-col gap-1 text-main-text text-sm">
                  <p>—</p><p>—</p><p>—</p>
                </div>
              </div>

              {profile.website && (
                <div className="bg-area border border-area-border rounded-2xl p-4 sm:p-5 flex-1 lg:flex-none">
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-accent-text text-sm hover:underline break-all">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* posts tab */}
        {activeTab === 'Posts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {posts.length > 0
              ? posts.map(post => (
                  <Link key={post.id} to={`/post/${post.id}`}
                    className="h-[150px] sm:h-[200px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors">
                    <AsciiMiniCard content={post.content} />
                  </Link>
                ))
              : <p className="text-main-text text-sm col-span-2 md:col-span-3">no posts yet.</p>
            }
          </div>
        )}

        {/* liked tab */}
        {activeTab === 'Liked' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {likedPosts.length > 0
              ? likedPosts.map(post => (
                  <Link key={post.id} to={`/post/${post.id}`}
                    className="h-[150px] sm:h-[200px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors">
                    <AsciiMiniCard content={post.content} />
                  </Link>
                ))
              : <p className="text-main-text text-sm col-span-2 md:col-span-3">no liked posts yet.</p>
            }
          </div>
        )}

        {/* following tab */}
        {activeTab === 'Following' && (
          <div>
            {followingList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {followingList.map(p => <UserCard key={p.id} profile={p} />)}
              </div>
            ) : (
              <p className="text-main-text text-sm">not following anyone yet.</p>
            )}
          </div>
        )}

        {/* followers tab */}
        {activeTab === 'Followers' && (
          <div>
            {followersList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {followersList.map(p => <UserCard key={p.id} profile={p} />)}
              </div>
            ) : (
              <p className="text-main-text text-sm">no followers yet.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}