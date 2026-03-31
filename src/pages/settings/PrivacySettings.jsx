import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function Switch({ label, desc, value, onToggle, disabled, icon }) {
  return (
    <div className="p-5 rounded-2xl bg-area border border-area-border space-y-4">
      <div className="flex items-center justify-between py-3 gap-10">
        <div className="flex gap-2">
          <svg className="w-5 h-5 my-1 flex-shrink-0">
            <use
              href={`/sprite.svg#${icon}`}
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

function PrivacySettings() {
  const [settings, setSettings] = useState({
    private_account: false,
    show_activity_status: true,
    show_liked_posts: true,
    show_following: true,
    allow_dm: true,
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
          'private_account, show_activity_status, show_liked_posts, show_following, allow_dm',
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
      <h2 className="text-accent-text font-bold text-xl">Privacy</h2>
      <p>Control who can see your profile and activity.</p>

      <div className="pt-5 flex flex-col gap-6">
        <Switch
          label="Private Account"
          desc="Only approved followers can see your posts and activity."
          value={settings.private_account}
          onToggle={() => toggle('private_account')}
          disabled={loading}
          icon={'icon-lock'}
        />

        <Switch
          label="Show Activity Status"
          desc="Let others see when you were last active."
          value={settings.show_activity_status}
          onToggle={() => toggle('show_activity_status')}
          disabled={loading}
          icon={'icon-eye'}
        />

        <Switch
          label="Show Liked Posts"
          desc="Allow others to see posts you've liked."
          value={settings.show_liked_posts}
          onToggle={() => toggle('show_liked_posts')}
          disabled={loading}
          icon={'icon-eye'}
        />

        <Switch
          label="Show Following List"
          desc="Let others see who you follow."
          value={settings.show_following}
          onToggle={() => toggle('show_following')}
          disabled={loading}
          icon={'icon-eye'}
        />

        <Switch
          label="Allow Direct Messages"
          desc="Let anyone send you a message."
          value={settings.allow_dm}
          onToggle={() => toggle('allow_dm')}
          disabled={loading}
          icon={'icon-globe'}
        />
      </div>
    </div>
  );
}

export default PrivacySettings;
