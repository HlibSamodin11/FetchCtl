import { useEffect, useState, useRef } from 'react';
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

    const t  = setTimeout(fit, 50);
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

export default function Profile({ user }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile,        setProfile]        = useState(null);
  const [posts,          setPosts]          = useState([]);
  const [likedArts,      setLikedArts]      = useState([]);
  const [activeTab,      setActiveTab]      = useState('Overview');
  const [loading,        setLoading]        = useState(true);
  const [followerCount,  setFollowerCount]  = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [notFound,       setNotFound]       = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  const isOwn = profile?.id === currentUser?.id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotFound(false);

      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !prof) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(prof);

      const { data: userPosts } = await supabase
        .from('posts')
        .select('*, post_views(views)')
        .eq('user_id', prof.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      setPosts(userPosts || []);

      const { data: likes } = await supabase
        .from('art_likes')
        .select('art_id')
        .eq('user_id', prof.id);
      setLikedArts(likes || []);

      setLoading(false);
    }
    load();
  }, [username]);

  function bannerGradient(uname) {
    let hash = 0;
    for (let i = 0; i < (uname || '').length; i++) hash = uname.charCodeAt(i) + ((hash << 5) - hash);
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1},30%,12%) 0%, hsl(${h2},25%,16%) 100%)`;
  }

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

  return (
    <div className="bg-bg min-h-screen font-grotesk">
      <div className="container mx-auto px-6 md:px-12 py-8 max-w-[1200px]">

        {/* profile card */}
        <div className="bg-area border border-area-border rounded-2xl overflow-hidden mb-1">

          {/* banner */}
          <div
            className="h-[160px] w-full"
            style={
              profile.banner_url
                ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: bannerGradient(profile.username) }
            }
          />

          {/* avatar + button row */}
          <div className="px-6 relative">
            <div className="absolute -top-[45px] left-6 w-[90px] h-[90px] rounded-full bg-accent-bg border-4 border-area overflow-hidden flex items-center justify-center">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-accent-text font-bold font-jetbrains text-xl">
                    {profile.username?.slice(0, 2).toUpperCase()}
                  </span>
              }
            </div>

            <div className="flex justify-end pt-3 pb-4">
              {isOwn && (
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="border border-area-border rounded-xl px-4 py-1.5 text-sm text-accent-text hover:bg-button-bg transition-colors"
                >
                  edit profile
                </button>
              )}
            </div>
          </div>

          {/* info */}
          <div className="px-6 pb-5 mt-6">
            <h1 className="text-accent-text font-bold text-xl leading-7">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-main-text text-sm mt-0.5">@{profile.username}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-main-text text-xs">
              {profile.location && (
                <span>{profile.location}</span>
              )}
              {profile.location && profile.website && <span>·</span>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-text transition-colors"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {(profile.location || profile.website) && profile.created_at && <span>·</span>}
              {profile.created_at && (
                <span>joined {joinedDate(profile.created_at)}</span>
              )}
            </div>

            {profile.bio && (
              <p className="text-main-text text-sm mt-3">{profile.bio}</p>
            )}

            {/* stats pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: 'Followers',  value: followerCount },
                { label: 'Following',  value: followingCount },
                { label: 'Arts Liked', value: likedArts.length },
                { label: 'Posts',      value: posts.length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#171717] border border-[#322c2a] rounded-full px-4 py-1 text-sm text-accent-text">
                  <span className="font-bold">{value}</span>
                  <span className="font-normal text-main-text"> {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="border-b border-area-border flex gap-6 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium relative transition-colors ${
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
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* pinned post */}
              <div className="bg-area border border-area-border rounded-2xl p-5">
                <h2 className="text-accent-text font-bold text-base mb-4">Pinned Post</h2>
                {pinnedPost
                  ? (
                    <Link to={`/post/${pinnedPost.id}`} className="flex gap-5 group">
                      <div className="w-[260px] h-[200px] flex-shrink-0 bg-accent-bg border border-area-border rounded-xl overflow-hidden">
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
                  )
                  : (
                    <div className="w-[260px] h-[200px] bg-accent-bg border border-area-border rounded-xl flex items-center justify-center text-main-text text-sm">
                      no posts yet
                    </div>
                  )
                }
              </div>

              {/* recently liked */}
              <div>
                <h2 className="text-accent-text font-bold text-base mb-3">Recently Liked</h2>
                <div className="flex gap-3">
                  {likedArts.length > 0
                    ? likedArts.slice(0, 4).map(like => (
                        <div key={like.art_id} className="w-[120px] h-[90px] bg-accent-bg border border-area-border rounded-xl flex items-center justify-center text-main-text text-xs">
                          {like.art_id}
                        </div>
                      ))
                    : [0,1,2,3].map(i => (
                        <div key={i} className="w-[120px] h-[90px] bg-accent-bg border border-area-border rounded-xl" />
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
                          className="flex-1 h-[160px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors"
                        >
                          <AsciiMiniCard content={post.content} />
                        </Link>
                      ))
                    : [0,1].map(i => (
                        <div key={i} className="flex-1 h-[160px] bg-accent-bg border border-area-border rounded-xl" />
                      ))
                  }
                </div>
              </div>
            </div>

            {/* right sidebar */}
            <div className="w-[220px] flex-shrink-0 flex flex-col gap-3">

              <div className="bg-area border border-area-border rounded-2xl p-5">
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-accent-text text-lg">
                    <span className="font-bold">{followerCount}</span>
                    <span className="text-base font-normal text-main-text"> Followers</span>
                  </p>
                  <p className="text-accent-text text-lg">
                    <span className="font-bold">{followingCount}</span>
                    <span className="text-base font-normal text-main-text"> Following</span>
                  </p>
                </div>
                {profile.created_at && (
                  <p className="text-main-text text-sm">
                    joined {joinedDate(profile.created_at)}
                  </p>
                )}
              </div>

              <div className="bg-area border border-area-border rounded-2xl p-5">
                <h3 className="text-accent-text font-bold text-base mb-3">Achievements</h3>
                <div className="flex flex-col gap-1 text-main-text text-sm">
                  <p>—</p>
                  <p>—</p>
                  <p>—</p>
                </div>
              </div>

              {profile.website && (
                <div className="bg-area border border-area-border rounded-2xl p-5">
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-text text-sm hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* posts tab */}
        {activeTab === 'Posts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts.length > 0
              ? posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="h-[200px] bg-accent-bg border border-area-border rounded-xl overflow-hidden hover:border-main-text transition-colors"
                  >
                    <AsciiMiniCard content={post.content} />
                  </Link>
                ))
              : <p className="text-main-text text-sm col-span-3">no posts yet.</p>
            }
          </div>
        )}

        {/* liked tab */}
        {activeTab === 'Liked' && (
          <div>
            {likedArts.length > 0
              ? <p className="text-main-text text-sm">{likedArts.length} liked arts</p>
              : <p className="text-main-text text-sm">no liked arts yet.</p>
            }
          </div>
        )}

        {/* following / followers tabs */}
        {(activeTab === 'Following' || activeTab === 'Followers') && (
          <p className="text-main-text text-sm">coming soon.</p>
        )}

      </div>
    </div>
  );
}
