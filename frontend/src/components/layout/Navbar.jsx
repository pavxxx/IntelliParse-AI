// TODO: Navigation bar component providing header links and app navigation.
const Navbar = ({ activeTab = 'home', onSelectTab }) => {
  const navItems = [
    { id: 'home', label: '01 // UPLOAD' },
    { id: 'resume', label: '02 // RESUME' },
    { id: 'library', label: '03 // LIBRARY' },
    { id: 'chat', label: '04 // CHAT' },
  ];

  return (
    <nav className="border-b-3 border-[#E0E0E0] bg-[#121212] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Engine Status */}
          <div className="flex items-center gap-4">
            <div className="border-3 border-[#E0E0E0] bg-[#E0E0E0] text-[#121212] px-3 py-1 text-sm font-extrabold tracking-wider uppercase">
              INTELLIPARSE AI
            </div>
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest text-[#B0B0B0]">
              ● SYSTEM ONLINE
            </span>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab && onSelectTab(item.id)}
                  className={`border-3 px-4 py-2 text-xs md:text-sm font-extrabold uppercase tracking-wider transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#E0E0E0] text-[#121212] border-[#E0E0E0]'
                      : 'bg-[#121212] text-[#E0E0E0] border-[#888888] hover:bg-[#888888] hover:text-[#121212]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
