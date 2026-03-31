import { useNavigate, useLocation, Outlet } from 'react-router-dom';

function Settings({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Profile', path: '/settings/profile', icon: 'icon-user' },
    { name: 'Privacy', path: '/settings/privacy', icon: 'icon-shield' },
    {
      name: 'Notifications',
      path: '/settings/notifications',
      icon: 'icon-bell',
    },
    { name: 'Appearance', path: '/settings/appearance', icon: 'icon-palette' },
    {
      name: 'Danger Zone',
      path: '/settings/danger',
      icon: 'icon-bin',
      danger: true,
    },
  ];

  return (
    <section className="bg-bg w-full min-h-screen font-grotesk text-main-text flex justify-center py-10 px-6 md:px-12">
      <div className="container">
        <header>
          <h1
            className="flex text-accent-text items-center gap-2 text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg className="w-5 h-5">
              <use
                href="/sprite.svg#icon-arrow"
                className="fill-main-text rotate-180 origin-center"
              ></use>
            </svg>
            Settings
          </h1>
        </header>

        <div className="flex gap-10 mt-10 flex-wrap">
          {/* nav */}
          <div className="w-64">
            <nav className="flex flex-col gap-2 text-sm">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg w-full transition-colors

                      ${
                        item.danger
                          ? isActive
                            ? 'bg-[#EF4444]/10 text-[#EF4444]'
                            : 'text-[#EF4444]/70 hover:bg-[#EF4444]/10'
                          : isActive
                            ? 'bg-button-bg text-accent-text'
                            : 'text-accent-text hover:bg-button-bg/70'
                      }
                    `}
                  >
                    <svg className="w-5 h-5">
                      <use
                        href={`/sprite.svg#${item.icon}`}
                        className={`
                          fill-none
                          ${
                            item.danger
                              ? 'stroke-[#EF4444]'
                              : 'stroke-main-text'
                          }
                        `}
                      ></use>
                    </svg>

                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
