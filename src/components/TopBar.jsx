export default function TopBar({ user, page, navItems, nsToken, served, depts, onNav, onLogout }) {
  const totalWaiting = Object.values(depts).reduce((a, d) => a + d.count, 0);

  const tickerItems = [
    `Now calling: #${nsToken}`,
    `Served today: ${served}`,
    `Total waiting: ${totalWaiting}`,
    ...Object.entries(depts).map(([n, d]) => `${n}: ${d.count} waiting`),
  ];

  // Duplicate for seamless loop
  const tickerContent = [...tickerItems, ...tickerItems];

  return (
    <>
      {/* MAIN TOPBAR */}
      <header className="app-topbar">
        <div className="logo">
          <div className="logo-icon">⚕️</div>
          Medi<span>Queue</span>
        </div>

        <nav className="topnav">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              className={`nav-btn ${page === id ? 'active' : ''}`}
              onClick={() => onNav(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <div className="live-badge">
            <div className="live-dot" />
            LIVE
          </div>
          <div className="user-chip" onClick={onLogout} title="Click to sign out">
            <div className="user-avatar">
              {user.role === 'admin' ? '🛡️' : '👤'}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {user.name.split(' ')[0]}
            </span>
            <span className={`role-badge ${user.role}`}>
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* LIVE TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {tickerContent.map((item, i) => (
            <span key={i}>
              {item.includes(':') ? (
                <>
                  {item.split(':')[0]}:{' '}
                  <em>{item.split(':').slice(1).join(':').trim()}</em>
                </>
              ) : item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}