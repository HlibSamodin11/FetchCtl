import "@fontsource/jetbrains-mono/400";
import "@fontsource/jetbrains-mono/500";
import "@fontsource/jetbrains-mono/600";
import "@fontsource/jetbrains-mono/700";
import "@fontsource/jetbrains-mono/800";
import "@fontsource/space-grotesk/400";
import "@fontsource/space-grotesk/500";
import "@fontsource/space-grotesk/600";
import "@fontsource/space-grotesk/700";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Main from "./pages/Main";
import Builder from "./pages/Builder";
import Ascii from "./pages/Ascii";
import Community from "./pages/Community";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import FullscreenLayout from "./layouts/FullscreenLayout";
import GetStarted from "./components/GetStarted";
import UsernameSetup from "./components/UsernameSetup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NewPostPage from "./pages/NewPostPage";
import PostPage from "./pages/PostPage";
import SettingsLayout from "./pages/settings/SettingsLayout";
import PrivacySettings from "./pages/settings/PrivacySettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import DangerSettings from "./pages/settings/DangerSettings";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [needsUsername, setNeedsUsername] = useState(false);

  async function checkProfile(u) {
    if (!u) return;
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", u.id)
      .single();
    if (!data?.username) setNeedsUsername(true);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      checkProfile(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const u = session?.user || null;
        setUser(u);
        if (event === "SIGNED_IN") checkProfile(u);
        if (event === "SIGNED_OUT") setNeedsUsername(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const openLogin = () => setShowLogin(true);

  return (
    <>
      <Routes>
        <Route element={<MainLayout user={user} onOpenLogin={openLogin} />}>
          <Route path="/" element={<Main user={user} />} />
          <Route path="/builder" element={<Builder />} />
          <Route
            path="/ascii"
            element={<Ascii user={user} onOpenLogin={openLogin} />}
          />
          <Route path="/community" element={<Community />} />
          <Route
            path="/u/:username"
            element={<Profile currentUser={user} onOpenLogin={openLogin} />}
          />
          <Route path="/post/new" element={<NewPostPage user={user} />} />
          <Route
            path="/post/:id"
            element={<PostPage user={user} onOpenLogin={openLogin} />}
          />
        </Route>

        <Route element={<FullscreenLayout />}>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/edit-profile" element={<EditProfile user={user} />} />
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="privacy" replace />} />
            <Route path="privacy" element={<PrivacySettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
            <Route path="danger" element={<DangerSettings />} />
          </Route>
        </Route>
      </Routes>

      {showLogin && <GetStarted onClose={() => setShowLogin(false)} />}
      {needsUsername && user && (
        <UsernameSetup user={user} onDone={() => setNeedsUsername(false)} />
      )}
    </>
  );
}

export default App;
