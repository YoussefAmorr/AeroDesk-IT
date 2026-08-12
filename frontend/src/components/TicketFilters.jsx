function TicketFilters({
                           searchTerm,
                           setSearchTerm,
                           statusFilter,
                           setStatusFilter,
                           priorityFilter,
                           setPriorityFilter,
                           categoryFilter,
                           setCategoryFilter,
                           technicianFilter,
                           setTechnicianFilter,
                           technicians = [],
                           showTechnicianFilter = false,
                       }) {
    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('ALL')
        setPriorityFilter('ALL')
        setCategoryFilter('ALL')

        if (showTechnicianFilter) {
            setTechnicianFilter('ALL')
        }
    }

    return (
        <div className="ticket-filters">

            <div className="filter-search">
                <label htmlFor="ticket-search">
                    Search
                </label>

                <input
                    id="ticket-search"
                    type="text"
                    placeholder="Search ID, title, requester..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                />
            </div>

            <div className="filter-group">
                <label htmlFor="status-filter">
                    Status
                </label>

                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">
                        In Progress
                    </option>
                    <option value="RESOLVED">
                        Resolved
                    </option>
                    <option value="CLOSED">
                        Closed
                    </option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="priority-filter">
                    Priority
                </label>

                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(event) =>
                        setPriorityFilter(event.target.value)
                    }
                >
                    <option value="ALL">
                        All Priorities
                    </option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">
                        Critical
                    </option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="category-filter">
                    Category
                </label>

                <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(event) =>
                        setCategoryFilter(event.target.value)
                    }
                >
                    <option value="ALL">
                        All Categories
                    </option>
                    <option value="Hardware">
                        Hardware
                    </option>
                    <option value="Software">
                        Software
                    </option>
                    <option value="Network">
                        Network
                    </option>
                    <option value="Account">
                        Account
                    </option>
                    <option value="Other">
                        Other
                    </option>
                </select>
            </div>

            {showTechnicianFilter && (
                <div className="filter-group">
                    <label htmlFor="technician-filter">
                        Technician
                    </label>

                    <select
                        id="technician-filter"
                        value={technicianFilter}
                        onChange={(event) =>
                            setTechnicianFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Technicians
                        </option>

                        <option value="UNASSIGNED">
                            Unassigned
                        </option>

                        {technicians.map((technician) => (
                            <option
                                key={technician.id}
                                value={String(technician.id)}
                            >
                                {technician.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="filter-actions">
                <button
                    type="button"
                    className="clear-filter-button"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>

        </div>
    )
}

export default TicketFilters