import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BIO_MAX = 160;

function bannerStyle(username) {
  if (!username) return {};
  const hue = [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 60) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue}deg 30% 12%) 0%, hsl(${hue2}deg 25% 18%) 50%, hsl(${hue}deg 20% 10%) 100%)`,
  };
}

function Initials({ username, size = 80 }) {
  const initials = username?.slice(0, 2).toUpperCase() ?? '??';
  const hue = username
    ? [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
    : 200;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold font-jetbrains select-none"
      style={{
        width: size, height: size,
        background: `hsl(${hue}deg 40% 18%)`,
        color:      `hsl(${hue}deg 70% 70%)`,
        fontSize:    size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}

function Field({ label, value, onChange, multiline, readOnly, prefix, placeholder, maxLength, hint }) {
  const [focused, setFocused] = useState(false);

  const inputCls = `w-full bg-[#1a1a1a] border rounded-xl px-3 py-2.5 text-sm text-accent-text placeholder:text-[#4a4542] outline-none resize-none transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
    focused ? 'border-[#78736d]' : 'border-[#2c2726] hover:border-[#3a3432]'
  }`;

  const shared = {
    disabled: readOnly,
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
  };

  return (
    <div className={`bg-[#141414] border rounded-2xl px-4 sm:px-5 pt-4 pb-5 transition-all duration-150 ${
      focused ? 'border-[#3a3432]' : 'border-[#2c2726]'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <label className={`text-[11px] font-medium tracking-widest uppercase transition-colors duration-150 ${
          focused ? 'text-[#a09890]' : 'text-[#78736d]'
        }`}>
          {label}
        </label>
        {maxLength && !readOnly && (
          <span className={`text-[10px] tabular-nums transition-colors duration-150 ${
            (value?.length ?? 0) > maxLength * 0.9
              ? (value?.length ?? 0) >= maxLength ? 'text-red-400' : 'text-yellow-500/70'
              : 'text-[#4a4542]'
          }`}>
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
        {readOnly && (
          <span className="text-[10px] text-[#4a4542] tracking-wide">can't change this</span>
        )}
      </div>

      {multiline ? (
        <textarea
          className={inputCls}
          value={value}
          rows={4}
          maxLength={maxLength}
          placeholder={placeholder ?? label}
          onChange={e => onChange?.(e.target.value)}
          {...shared}
        />
      ) : prefix ? (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors duration-150 ${focused ? 'text-[#a09890]' : 'text-[#78736d]'}`}>
            {prefix}
          </span>
          <input
            className={inputCls}
            value={value}
            placeholder={placeholder ?? label}
            onChange={e => onChange?.(e.target.value)}
            {...shared}
          />
        </div>
      ) : (
        <input
          className={inputCls}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder ?? label}
          onChange={e => onChange?.(e.target.value)}
          {...shared}
        />
      )}

      {hint && !readOnly && (
        <p className="text-[10px] text-[#4a4542] mt-2">{hint}</p>
      )}
    </div>
  );
}

function Toast({ message, type = 'success' }) {
  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 flex items-center gap-2 transition-all duration-300 max-w-[calc(100vw-2rem)] ${
      type === 'error'
        ? 'bg-red-900/80 border border-red-700/50 text-red-200'
        : 'bg-[#1f1f1f] border border-[#2c2726] text-accent-text'
    }`}>
      <span>{type === 'error' ? '✕' : '✓'}</span>
      {message}
    </div>
  );
}

export default function EditProfile({ user }) {
  const navigate = useNavigate();

  const [profile,      setProfile]      = useState(null);
  const [displayName,  setDisplayName]  = useState('');
  const [bio,          setBio]          = useState('');
  const [location,     setLocation]     = useState('');
  const [website,      setWebsite]      = useState('');

  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const [bannerFile,    setBannerFile]    = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const bannerRef = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (!data) return;
        setProfile(data);
        setDisplayName(data.display_name ?? '');
        setBio(data.bio ?? '');
        setLocation(data.location ?? '');
        setWebsite(data.website ?? '');
        setAvatarPreview(data.avatar_url ?? null);
        setBannerPreview(data.banner_url ?? null);
      });
  }, [user]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarRemoved(false);
    setAvatarPreview(URL.createObjectURL(f));
  }

  function pickBanner(e) {
    const f = e.target.files[0];
    if (!f) return;
    setBannerFile(f);
    setBannerRemoved(false);
    setBannerPreview(URL.createObjectURL(f));
  }

  function removeAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarRemoved(true);
  }

  function removeBanner() {
    setBannerFile(null);
    setBannerPreview(null);
    setBannerRemoved(true);
  }

  async function save() {
    if (!profile) return;
    setLoading(true);

    let avatar_url = avatarRemoved ? null : profile.avatar_url;
    let banner_url = bannerRemoved ? null : profile.banner_url;

    if (avatarFile) {
      const ext  = avatarFile.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars').upload(path, avatarFile, { upsert: true });
      if (upErr) { showToast(upErr.message, 'error'); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      avatar_url = urlData.publicUrl + '?t=' + Date.now();
    }

    if (bannerFile) {
      const ext  = bannerFile.name.split('.').pop();
      const path = `${user.id}/banner.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars').upload(path, bannerFile, { upsert: true });
      if (upErr) { showToast(upErr.message, 'error'); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      banner_url = urlData.publicUrl + '?t=' + Date.now();
    }

    const { error: saveErr } = await supabase.from('profiles').update({
      display_name: displayName.trim() || null,
      bio:          bio.trim()         || null,
      location:     location.trim()    || null,
      website:      website.trim()     || null,
      avatar_url,
      banner_url,
    }).eq('id', user.id);

    setLoading(false);
    if (saveErr) { showToast(saveErr.message, 'error'); return; }
    showToast('profile saved!');
    setTimeout(() => navigate(`/u/${profile.username}`), 800);
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#78736d] text-sm font-jetbrains animate-pulse">loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen font-grotesk">
      <div className="max-w-[840px] mx-auto px-3 sm:px-4 py-6 sm:py-10 flex flex-col gap-3">

        <button
          onClick={() => navigate(`/u/${profile.username}`)}
          className="flex items-center gap-2 text-accent-text font-bold text-lg mb-4 sm:mb-6 hover:opacity-70 transition-opacity w-fit group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-150" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          account
        </button>

        {/* banner + avatar */}
        <div className="bg-[#141414] border border-[#2c2726] rounded-2xl overflow-hidden relative mb-2">
          <div
            className="h-28 sm:h-36 w-full cursor-pointer relative group"
            onClick={() => bannerRef.current?.click()}
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={bannerStyle(profile.username)} />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm">Change banner</span>
            </div>
            {bannerPreview && (
              <button
                onClick={e => { e.stopPropagation(); removeBanner(); }}
                title="Remove banner"
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-red-400 hover:border-red-500/40 transition-all duration-150 flex items-center justify-center text-[11px] font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="h-10 sm:h-12 bg-[#141414]" />

          <div className="absolute left-4 sm:left-5 bottom-2 sm:bottom-3">
            <div className="relative group">
              <div
                className="rounded-full border-4 border-[#141414] overflow-hidden bg-[#1f1f1f] w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : <Initials username={profile.username} size={64} />
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
                title="Change photo"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              {avatarPreview && (
                <button
                  onClick={removeAvatar}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#141414] border border-[#2c2726] text-[#78736d] hover:text-red-400 hover:border-red-500/40 transition-all duration-150 flex items-center justify-center text-[10px] font-bold leading-none"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <input ref={fileRef}   type="file" accept="image/*" className="hidden" onChange={pickFile} />
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={pickBanner} />
        </div>

        <Field label="Display Name" value={displayName} onChange={setDisplayName} placeholder="how you want to appear" maxLength={50} />
        <Field label="Username" value={profile.username} prefix="@" readOnly />
        <Field label="Bio" value={bio} onChange={setBio} multiline placeholder="a little something about yourself..." maxLength={BIO_MAX} />
        <Field label="Location" value={location} onChange={setLocation} placeholder="where in the world?" />
        <Field label="Website" value={website} onChange={setWebsite} placeholder="yoursite.com" hint="include https:// for external links" />

        <div className="flex justify-end sm:justify-end pt-2">
          <button
            onClick={save}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#b7b7b7] hover:bg-white text-black text-sm font-medium rounded-xl px-8 py-2.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="7" cy="7" r="5" strokeOpacity="0.3"/>
                  <path d="M7 2a5 5 0 0 1 5 5"/>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}