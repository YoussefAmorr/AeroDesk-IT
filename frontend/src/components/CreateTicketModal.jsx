function CreateTicketModal({
                               newTicket,
                               setNewTicket,
                               ticketMessage,
                               onClose,
                               onSubmit,
                           }) {
    return (
        <div className="modal-overlay">
            <div className="ticket-modal">

                <div className="modal-header">
                    <div>
                        <h2>Create Support Ticket</h2>
                        <p>
                            Tell the IT team what you need help with.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>

                    <div className="form-group">
                        <label>Title</label>

                        <input
                            type="text"
                            placeholder="Briefly describe the issue"
                            value={newTicket.title}
                            onChange={(event) =>
                                setNewTicket({
                                    ...newTicket,
                                    title: event.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            placeholder="Describe the problem in more detail..."
                            value={newTicket.description}
                            onChange={(event) =>
                                setNewTicket({
                                    ...newTicket,
                                    description: event.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Category</label>

                            <select
                                value={newTicket.category}
                                onChange={(event) =>
                                    setNewTicket({
                                        ...newTicket,
                                        category: event.target.value,
                                    })
                                }
                            >
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Network">Network</option>
                                <option value="Account">Account</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                value={newTicket.priority}
                                onChange={(event) =>
                                    setNewTicket({
                                        ...newTicket,
                                        priority: event.target.value,
                                    })
                                }
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                    </div>

                    {ticketMessage && (
                        <p className="ticket-error">
                            {ticketMessage}
                        </p>
                    )}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-ticket-button"
                        >
                            Submit Ticket
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateTicketModal