import TicketTable from '../components/TicketTable'

function EmployeeDashboard({
                               user,
                               tickets,
                               countByStatus,
                               onCreateTicket,
                               onOpenTicket,
                           }) {
    return (
        <>
            <div className="welcome-section">

                <div>
                    <p className="eyebrow">
                        EMPLOYEE PORTAL
                    </p>

                    <h1>
                        Welcome back, {user.name}
                    </h1>

                    <p>
                        View and manage your IT support requests.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-ticket-button"
                    onClick={onCreateTicket}
                >
                    + Create Ticket
                </button>

            </div>

            <section className="stats-grid">

                <div className="stat-card">
                    <span>Open</span>

                    <strong>
                        {countByStatus('OPEN')}
                    </strong>

                    <p>
                        Tickets awaiting support
                    </p>
                </div>

                <div className="stat-card">
                    <span>In Progress</span>

                    <strong>
                        {countByStatus('IN_PROGRESS')}
                    </strong>

                    <p>
                        Currently being worked
                    </p>
                </div>

                <div className="stat-card">
                    <span>Resolved</span>

                    <strong>
                        {countByStatus('RESOLVED')}
                    </strong>

                    <p>
                        Completed requests
                    </p>
                </div>

                <div className="stat-card">
                    <span>Total Tickets</span>

                    <strong>
                        {tickets.length}
                    </strong>

                    <p>
                        Your submitted requests
                    </p>
                </div>

            </section>

            <section className="tickets-section">

                <div className="section-heading">
                    <div>
                        <h2>
                            My Tickets
                        </h2>

                        <p>
                            Your recent IT support requests
                        </p>
                    </div>
                </div>

                <TicketTable
                    tickets={tickets}
                    onOpenTicket={onOpenTicket}
                />

            </section>
        </>
    )
}

export default EmployeeDashboard