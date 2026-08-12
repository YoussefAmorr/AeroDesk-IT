function DashboardHeader({ user, onLogout }) {
    return (
        <header className="dashboard-header">

            <div className="dashboard-brand">
                <div className="small-brand-badge">AD</div>

                <div>
                    <h2>AeroDesk IT</h2>
                    <span>{user.role} PORTAL</span>
                </div>
            </div>

            <div className="user-area">

                <div className="user-info">
                    <strong>{user.name}</strong>
                    <span>{user.role}</span>
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={onLogout}
                >
                    Sign Out
                </button>

            </div>

        </header>
    )
}

export default DashboardHeader