import TicketTable from '../components/TicketTable'

function AdminDashboard({
                            user,
                            tickets,
                            users,
                            adminView,
                            setAdminView,
                            countByStatus,
                            technicianUsers,
                            onOpenTicket,
                            onCreateUser,
                        }) {
    const employeeCount = users.filter(
        (account) => account.role === 'EMPLOYEE'
    ).length

    const adminCount = users.filter(
        (account) => account.role === 'ADMIN'
    ).length

    return (
        <>
            <div className="welcome-section">

                <div>
                    <p className="eyebrow">
                        ADMIN PORTAL
                    </p>

                    <h1>
                        Welcome back, {user.name}
                    </h1>

                    <p>
                        Manage AeroDesk tickets, assignments, and user accounts.
                    </p>
                </div>

                {adminView === 'USERS' && (
                    <button
                        type="button"
                        className="create-ticket-button"
                        onClick={onCreateUser}
                    >
                        + Create User
                    </button>
                )}

            </div>

            <div className="admin-navigation">

                <button
                    type="button"
                    className={
                        adminView === 'TICKETS'
                            ? 'admin-nav-button active'
                            : 'admin-nav-button'
                    }
                    onClick={() =>
                        setAdminView('TICKETS')
                    }
                >
                    Ticket Management
                </button>

                <button
                    type="button"
                    className={
                        adminView === 'USERS'
                            ? 'admin-nav-button active'
                            : 'admin-nav-button'
                    }
                    onClick={() =>
                        setAdminView('USERS')
                    }
                >
                    User Management
                </button>

            </div>

            {adminView === 'TICKETS' && (
                <>
                    <section className="stats-grid">

                        <div className="stat-card">
              <span>
                Open Tickets
              </span>

                            <strong>
                                {countByStatus('OPEN')}
                            </strong>

                            <p>
                                Waiting for support
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                In Progress
              </span>

                            <strong>
                                {countByStatus('IN_PROGRESS')}
                            </strong>

                            <p>
                                Currently being worked
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                Resolved
              </span>

                            <strong>
                                {countByStatus('RESOLVED')}
                            </strong>

                            <p>
                                Completed requests
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                Total Tickets
              </span>

                            <strong>
                                {tickets.length}
                            </strong>

                            <p>
                                All AeroDesk requests
                            </p>
                        </div>

                    </section>

                    <section className="tickets-section">

                        <div className="section-heading">
                            <div>
                                <h2>
                                    Ticket Management
                                </h2>

                                <p>
                                    View, assign, update, and manage all support tickets.
                                </p>
                            </div>
                        </div>

                        <TicketTable
                            tickets={tickets}
                            onOpenTicket={onOpenTicket}
                            showRequester={true}
                            showTechnician={true}
                        />

                    </section>
                </>
            )}

            {adminView === 'USERS' && (
                <>
                    <section className="stats-grid">

                        <div className="stat-card">
              <span>
                Total Users
              </span>

                            <strong>
                                {users.length}
                            </strong>

                            <p>
                                All AeroDesk accounts
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                Employees
              </span>

                            <strong>
                                {employeeCount}
                            </strong>

                            <p>
                                Employee accounts
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                Technicians
              </span>

                            <strong>
                                {technicianUsers.length}
                            </strong>

                            <p>
                                IT support accounts
                            </p>
                        </div>

                        <div className="stat-card">
              <span>
                Administrators
              </span>

                            <strong>
                                {adminCount}
                            </strong>

                            <p>
                                Administrative accounts
                            </p>
                        </div>

                    </section>

                    <section className="tickets-section">

                        <div className="section-heading">
                            <div>
                                <h2>
                                    User Management
                                </h2>

                                <p>
                                    Review AeroDesk accounts and their assigned roles.
                                </p>
                            </div>
                        </div>

                        {users.length === 0 ? (
                            <div className="empty-state">
                                <h3>
                                    No users found
                                </h3>

                                <p>
                                    No AeroDesk accounts are available.
                                </p>
                            </div>
                        ) : (
                            <div className="ticket-table-wrapper">

                                <table className="ticket-table">

                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {users.map((account) => (
                                        <tr key={account.id}>

                                            <td>
                                                #{account.id}
                                            </td>

                                            <td className="ticket-title">
                                                {account.name}
                                            </td>

                                            <td>
                                                {account.email}
                                            </td>

                                            <td>
                          <span
                              className={`badge role-${account.role?.toLowerCase()}`}
                          >
                            {account.role}
                          </span>
                                            </td>

                                        </tr>
                                    ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </section>
                </>
            )}
        </>
    )
}

export default AdminDashboard