function TicketDetailsModal({
                                selectedTicket,
                                onClose,

                                isTechnician,
                                isAdmin,

                                technicianUsers,
                                adminActionLoading,
                                adminActionError,
                                onAssignTechnician,
                                onDeleteTicket,

                                updatingStatus,
                                statusError,
                                onUpdateStatus,

                                comments,
                                newComment,
                                setNewComment,
                                commentError,
                                onAddComment,
                            }) {
    return (
        <div className="modal-overlay">

            <div className="ticket-modal">

                <div className="modal-header">

                    <div>
                        <p className="ticket-number">
                            Ticket #{selectedTicket.id}
                        </p>

                        <h2>
                            {selectedTicket.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="ticket-details-grid">

                    <div>
                        <span>Status</span>

                        <strong>
                            {selectedTicket.status?.replace(
                                '_',
                                ' '
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Priority</span>

                        <strong>
                            {selectedTicket.priority}
                        </strong>
                    </div>

                    <div>
                        <span>Category</span>

                        <strong>
                            {selectedTicket.category}
                        </strong>
                    </div>

                </div>

                {(isTechnician || isAdmin) && (
                    <div className="ticket-detail-section">

                        <h3>
                            Requester
                        </h3>

                        <p>
                            {selectedTicket.requester
                                ? `${selectedTicket.requester.name} — ${selectedTicket.requester.email}`
                                : 'No requester information'}
                        </p>

                    </div>
                )}

                <div className="ticket-detail-section">

                    <h3>
                        Description
                    </h3>

                    <p>
                        {selectedTicket.description}
                    </p>

                </div>

                <div className="ticket-detail-section">

                    <h3>
                        Assigned Technician
                    </h3>

                    <p>
                        {selectedTicket.assignedTechnician
                            ? selectedTicket.assignedTechnician.name
                            : 'Not assigned yet'}
                    </p>

                </div>

                {isAdmin && (
                    <div className="ticket-detail-section">

                        <h3>
                            Admin Controls
                        </h3>

                        <div className="admin-ticket-controls">

                            <div className="admin-assignment-control">

                                <label htmlFor="technician-assignment">
                                    Assigned Technician
                                </label>

                                <select
                                    id="technician-assignment"
                                    value={
                                        selectedTicket.assignedTechnician?.id || ''
                                    }
                                    disabled={adminActionLoading}
                                    onChange={(event) =>
                                        onAssignTechnician(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option
                                        value=""
                                        disabled
                                    >
                                        Select technician
                                    </option>

                                    {technicianUsers.map(
                                        (technician) => (
                                            <option
                                                key={technician.id}
                                                value={technician.id}
                                            >
                                                {technician.name}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <button
                                type="button"
                                className="delete-ticket-button"
                                disabled={adminActionLoading}
                                onClick={onDeleteTicket}
                            >
                                Delete Ticket
                            </button>

                        </div>

                        {technicianUsers.length === 0 && (
                            <p className="status-error">
                                No technician accounts are available.
                            </p>
                        )}

                        {adminActionError && (
                            <p className="status-error">
                                {adminActionError}
                            </p>
                        )}

                    </div>
                )}

                {(isTechnician || isAdmin) && (
                    <div className="ticket-detail-section">

                        <h3>
                            Ticket Workflow
                        </h3>

                        <div className="status-actions">

                            {selectedTicket.status === 'OPEN' && (
                                <button
                                    type="button"
                                    className="status-button start-button"
                                    disabled={updatingStatus}
                                    onClick={() =>
                                        onUpdateStatus(
                                            'IN_PROGRESS'
                                        )
                                    }
                                >
                                    {updatingStatus
                                        ? 'Updating...'
                                        : 'Start Working'}
                                </button>
                            )}

                            {selectedTicket.status ===
                                'IN_PROGRESS' && (
                                    <button
                                        type="button"
                                        className="status-button resolve-button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            onUpdateStatus(
                                                'RESOLVED'
                                            )
                                        }
                                    >
                                        {updatingStatus
                                            ? 'Updating...'
                                            : 'Mark Resolved'}
                                    </button>
                                )}

                            {selectedTicket.status ===
                                'RESOLVED' && (
                                    <p className="resolved-message">
                                        This ticket has been resolved.
                                    </p>
                                )}

                        </div>

                        {statusError && (
                            <p className="status-error">
                                {statusError}
                            </p>
                        )}

                    </div>
                )}

                <div className="ticket-detail-section">

                    <h3>
                        Comments
                    </h3>

                    {comments.length === 0 ? (
                        <p className="no-comments">
                            No comments yet.
                        </p>
                    ) : (
                        <div className="comments-list">

                            {comments.map((comment) => (
                                <div
                                    className="comment"
                                    key={comment.id}
                                >

                                    <strong>
                                        {comment.user?.name ||
                                            comment.author?.name ||
                                            comment.createdBy?.name ||
                                            'AeroDesk User'}
                                    </strong>

                                    <p>
                                        {comment.message}
                                    </p>

                                </div>
                            ))}

                        </div>
                    )}

                    <form
                        className="comment-form"
                        onSubmit={onAddComment}
                    >

            <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(event) =>
                    setNewComment(
                        event.target.value
                    )
                }
                required
            />

                        {commentError && (
                            <p className="comment-error">
                                {commentError}
                            </p>
                        )}

                        <div className="comment-actions">

                            <button
                                type="submit"
                                className="add-comment-button"
                            >
                                Add Comment
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default TicketDetailsModal