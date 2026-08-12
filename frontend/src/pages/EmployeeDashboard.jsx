import TicketTable from '../components/TicketTable'
import TicketFilters from '../components/TicketFilters'

function EmployeeDashboard({
                               user,
                               tickets,
                               filteredTickets,
                               countByStatus,
                               onCreateTicket,
                               onOpenTicket,
                               searchTerm,
                               setSearchTerm,
                               statusFilter,
                               setStatusFilter,
                               priorityFilter,
                               setPriorityFilter,
                               categoryFilter,
                               setCategoryFilter,
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

                <TicketFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                />

                <TicketTable
                    tickets={filteredTickets}
                    onOpenTicket={onOpenTicket}
                />
            </section>
        </>
    )
}

export default EmployeeDashboard