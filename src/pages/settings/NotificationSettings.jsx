import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function Switch({ label, desc, value, onToggle, disabled }) {
  return (
    <div className="p-5 rounded-2xl bg-area border border-area-border space-y-4">
      <div className="flex items-center justify-between py-3 gap-10">
        <div className="flex gap-2">
          <svg className="w-5 h-5 my-1 flex-shrink-0">
            <use
              href={`/sprite.svg#icon-bell`}
              className="stroke-main-text fill-none"
            ></use>{' '}
          </svg>
          <div>
            <h3 className="text-accent-text text-lg">{label}</h3>
            <p className="text-sm opacity-70">{desc}</p>
          </div>
        </div>

        <button
          disabled={disabled}
          onClick={onToggle}
          className={`
            w-14 h-7 flex items-center rounded-full p-1 transition-colors flex-shrink-0
            ${value ? 'bg-accent-text' : 'bg-button-bg'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div
            className={`
              w-5 h-5 rounded-full
              transform transition-all duration-200 ease-in-out
              ${value ? 'translate-x-7 bg-bg' : 'translate-x-0 bg-reverse'}
            `}
          />
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    notif_likes: true,
    notif_comments: true,
    notif_followers: true,
    notif_mentions: true,
    notif_email: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'notif_likes, notif_comments, notif_followers, notif_mentions, notif_email',
        )
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setSettings(data);
      }

      setLoading(false);
    };

    fetchSettings();
  }, []);

  const toggle = async (key) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const newValue = !settings[key];

    setSettings((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    const { error } = await supabase
      .from('profiles')
      .update({ [key]: newValue })
      .eq('id', user.id);

    if (error) {
      setSettings((prev) => ({
        ...prev,
        [key]: !newValue,
      }));
    }
  };

  return (
    <div>
      <h2 className="text-accent-text font-bold text-xl">Notifications</h2>
      <p>Choose what you want to be notified about.</p>

      <div className="pt-5 flex flex-col gap-6">
        <Switch
          label="Likes"
          desc="Get notified when someone likes your post."
          value={settings.notif_likes}
          onToggle={() => toggle('notif_likes')}
          disabled={loading}
        />

        <Switch
          label="Comments"
          desc="Get notified when someone comments on your post."
          value={settings.notif_comments}
          onToggle={() => toggle('notif_comments')}
          disabled={loading}
        />

        <Switch
          label="New Followers"
          desc="Get notified when someone follows you."
          value={settings.notif_followers}
          onToggle={() => toggle('notif_followers')}
          disabled={loading}
        />

        <Switch
          label="Mentions"
          desc="Get notified when someone mentions you."
          value={settings.notif_mentions}
          onToggle={() => toggle('notif_mentions')}
          disabled={loading}
        />

        <Switch
          label="Email Notifications"
          desc="Receive notifications via email."
          value={settings.notif_email}
          onToggle={() => toggle('notif_email')}
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default NotificationSettings;
