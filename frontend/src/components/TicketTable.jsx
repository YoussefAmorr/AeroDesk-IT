function TicketTable({
                         tickets,
                         onOpenTicket,
                         showRequester = false,
                         showTechnician = false,
                     }) {
    if (tickets.length === 0) {
        return (
            <div className="empty-state">
                <h3>No tickets found</h3>
                <p>There are no tickets in this view.</p>
            </div>
        )
    }

    return (
        <div className="ticket-table-wrapper">

            <table className="ticket-table">

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>

                    {showRequester && (
                        <th>Requester</th>
                    )}

                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>

                    {showTechnician && (
                        <th>Technician</th>
                    )}
                </tr>
                </thead>

                <tbody>

                {tickets.map((ticket) => (
                    <tr
                        key={ticket.id}
                        className="ticket-row"
                        onClick={() => onOpenTicket(ticket)}
                    >

                        <td>
                            #{ticket.id}
                        </td>

                        <td className="ticket-title">
                            {ticket.title}
                        </td>

                        {showRequester && (
                            <td>
                                {ticket.requester?.name || 'Unknown'}
                            </td>
                        )}

                        <td>
                            {ticket.category}
                        </td>

                        <td>
                <span
                    className={`badge priority-${ticket.priority?.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
                        </td>

                        <td>
                <span
                    className={`badge status-${ticket.status?.toLowerCase()}`}
                >
                  {ticket.status?.replace('_', ' ')}
                </span>
                        </td>

                        {showTechnician && (
                            <td>
                                {ticket.assignedTechnician?.name ||
                                    'Unassigned'}
                            </td>
                        )}

                    </tr>
                ))}

                </tbody>

            </table>

        </div>
    )
}

export default TicketTable