import TicketTable from '../components/TicketTable'

function TechnicianDashboard({
                                 user,
                                 tickets,
                                 countByStatus,
                                 assignedToMeTickets,
                                 technicianView,
                                 setTechnicianView,
                                 displayedTechnicianTickets,
                                 onOpenTicket,
                             }) {
    return (
        <>
            <div className="welcome-section">

                <div>
                    <p className="eyebrow">
                        TECHNICIAN PORTAL
                    </p>

                    <h1>
                        Welcome back, {user.name}
                    </h1>

                    <p>
                        Review and manage IT support tickets across AeroDesk.
                    </p>
                </div>

            </div>

            <section className="stats-grid">

                <div className="stat-card">
                    <span>Open Tickets</span>

                    <strong>
                        {countByStatus('OPEN')}
                    </strong>

                    <p>
                        Waiting for IT support
                    </p>
                </div>

                <div className="stat-card">
                    <span>In Progress</span>

                    <strong>
                        {countByStatus('IN_PROGRESS')}
                    </strong>

                    <p>
                        Tickets being worked
                    </p>
                </div>

                <div className="stat-card">
                    <span>Resolved</span>

                    <strong>
                        {countByStatus('RESOLVED')}
                    </strong>

                    <p>
                        Completed tickets
                    </p>
                </div>

                <div className="stat-card">
                    <span>Assigned to Me</span>

                    <strong>
                        {assignedToMeTickets.length}
                    </strong>

                    <p>
                        Your active workload
                    </p>
                </div>

            </section>

            <section className="tickets-section">

                <div className="section-heading technician-heading">

                    <div>
                        <h2>
                            Service Queue
                        </h2>

                        <p>
                            Review and work AeroDesk support tickets
                        </p>
                    </div>

                    <div className="queue-filters">

                        <button
                            type="button"
                            className={
                                technicianView === 'ALL'
                                    ? 'queue-filter active'
                                    : 'queue-filter'
                            }
                            onClick={() =>
                                setTechnicianView('ALL')
                            }
                        >
                            All Tickets
                        </button>

                        <button
                            type="button"
                            className={
                                technicianView === 'MINE'
                                    ? 'queue-filter active'
                                    : 'queue-filter'
                            }
                            onClick={() =>
                                setTechnicianView('MINE')
                            }
                        >
                            Assigned to Me
                        </button>

                    </div>

                </div>

                <TicketTable
                    tickets={displayedTechnicianTickets}
                    onOpenTicket={onOpenTicket}
                    showRequester={true}
                    showTechnician={true}
                />

            </section>
        </>
    )
}

export default TechnicianDashboard