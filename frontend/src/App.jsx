import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])

  const [showCreateTicket, setShowCreateTicket] = useState(false)

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'MEDIUM',
  })

  const [ticketMessage, setTicketMessage] = useState('')

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState('')

  const [statusError, setStatusError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const [technicianView, setTechnicianView] = useState('ALL')

  // Admin portal state
  const [users, setUsers] = useState([])
  const [adminView, setAdminView] = useState('TICKETS')
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    password: '',
  })
  const [userMessage, setUserMessage] = useState('')
  const [adminActionError, setAdminActionError] = useState('')
  const [adminActionLoading, setAdminActionLoading] = useState(false)

  const loadTickets = async (token) => {
    const response = await fetch(
        'http://localhost:8080/api/tickets',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )

    if (!response.ok) {
      throw new Error('Unable to load tickets')
    }

    const data = await response.json()
    setTickets(data)
  }

  const loadUsers = async (token) => {
    const response = await fetch(
        'http://localhost:8080/api/users',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )

    if (!response.ok) {
      throw new Error('Unable to load users')
    }

    const data = await response.json()
    setUsers(data)
  }

  const openTicket = async (ticket) => {
    const token = localStorage.getItem('token')

    setCommentError('')
    setStatusError('')
    setAdminActionError('')
    setNewComment('')

    try {
      const ticketResponse = await fetch(
          `http://localhost:8080/api/tickets/${ticket.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )

      if (!ticketResponse.ok) {
        throw new Error('Unable to load ticket')
      }

      const ticketData = await ticketResponse.json()

      const commentsResponse = await fetch(
          `http://localhost:8080/api/tickets/${ticket.id}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )

      if (!commentsResponse.ok) {
        throw new Error('Unable to load comments')
      }

      const commentsData = await commentsResponse.json()

      setSelectedTicket(ticketData)
      setComments(commentsData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateTicket = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
          'http://localhost:8080/api/tickets',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTicket),
          }
      )

      if (!response.ok) {
        setTicketMessage('Unable to create ticket.')
        return
      }

      setNewTicket({
        title: '',
        description: '',
        category: 'Hardware',
        priority: 'MEDIUM',
      })

      setTicketMessage('')
      setShowCreateTicket(false)

      await loadTickets(token)
    } catch (error) {
      setTicketMessage('Unable to connect to AeroDesk.')
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()

    if (!newComment.trim()) {
      return
    }

    const token = localStorage.getItem('token')

    setCommentError('')

    try {
      const response = await fetch(
          `http://localhost:8080/api/tickets/${selectedTicket.id}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              Authorization: `Bearer ${token}`,
            },
            body: newComment,
          }
      )

      if (!response.ok) {
        setCommentError('Unable to add comment.')
        return
      }

      const savedComment = await response.json()

      setComments((currentComments) => [
        ...currentComments,
        savedComment,
      ])

      setNewComment('')
    } catch (error) {
      setCommentError('Unable to connect to AeroDesk.')
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    const token = localStorage.getItem('token')

    setStatusError('')
    setUpdatingStatus(true)

    try {
      const response = await fetch(
          `http://localhost:8080/api/tickets/${selectedTicket.id}/status/${newStatus}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )

      if (!response.ok) {
        setStatusError('Unable to update ticket status.')
        return
      }

      const updatedTicket = await response.json()

      setSelectedTicket(updatedTicket)

      setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
              ticket.id === updatedTicket.id
                  ? updatedTicket
                  : ticket
          )
      )
    } catch (error) {
      setStatusError('Unable to connect to AeroDesk.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')
    setUserMessage('')

    try {
      const response = await fetch(
          'http://localhost:8080/api/users',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUser),
          }
      )

      if (!response.ok) {
        let errorMessage = 'Unable to create user.'

        if (response.status === 409) {
          errorMessage = 'A user with this email already exists.'
        } else if (response.status === 400) {
          errorMessage = 'Please check the user information and try again.'
        }

        setUserMessage(errorMessage)
        return
      }

      setNewUser({
        name: '',
        email: '',
        role: 'EMPLOYEE',
        password: '',
      })

      setUserMessage('')
      setShowCreateUser(false)
      await loadUsers(token)
    } catch (error) {
      setUserMessage('Unable to connect to AeroDesk.')
    }
  }

  const handleAssignTechnician = async (technicianId) => {
    if (!selectedTicket || !technicianId) {
      return
    }

    const token = localStorage.getItem('token')
    setAdminActionError('')
    setAdminActionLoading(true)

    try {
      const response = await fetch(
          `http://localhost:8080/api/tickets/${selectedTicket.id}/assign/${technicianId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )

      if (!response.ok) {
        setAdminActionError('Unable to assign technician.')
        return
      }

      const updatedTicket = await response.json()
      setSelectedTicket(updatedTicket)

      setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
              ticket.id === updatedTicket.id
                  ? updatedTicket
                  : ticket
          )
      )
    } catch (error) {
      setAdminActionError('Unable to connect to AeroDesk.')
    } finally {
      setAdminActionLoading(false)
    }
  }

  const handleDeleteTicket = async () => {
    if (!selectedTicket) {
      return
    }

    const confirmed = window.confirm(
        `Delete ticket #${selectedTicket.id} "${selectedTicket.title}"? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    const token = localStorage.getItem('token')
    setAdminActionError('')
    setAdminActionLoading(true)

    try {
      const response = await fetch(
          `http://localhost:8080/api/tickets/${selectedTicket.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )

      if (!response.ok) {
        setAdminActionError('Unable to delete ticket.')
        return
      }

      setTickets((currentTickets) =>
          currentTickets.filter(
              (ticket) => ticket.id !== selectedTicket.id
          )
      )

      closeTicketDetails()
    } catch (error) {
      setAdminActionError('Unable to connect to AeroDesk.')
    } finally {
      setAdminActionLoading(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
          'http://localhost:8080/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
      )

      if (!response.ok) {
        setMessage('Invalid email or password.')
        return
      }

      const data = await response.json()

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))

      setUser(data)

      await loadTickets(data.token)

      if (data.role === 'ADMIN') {
        await loadUsers(data.token)
      }
    } catch (error) {
      setMessage('Unable to connect to AeroDesk.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setTickets([])
    setSelectedTicket(null)
    setComments([])
    setNewComment('')
    setCommentError('')
    setStatusError('')
    setTechnicianView('ALL')
    setUsers([])
    setAdminView('TICKETS')
    setShowCreateUser(false)
    setNewUser({
      name: '',
      email: '',
      role: 'EMPLOYEE',
      password: '',
    })
    setUserMessage('')
    setAdminActionError('')
    setAdminActionLoading(false)
    setEmail('')
    setPassword('')
    setMessage('')
  }

  const closeTicketDetails = () => {
    setSelectedTicket(null)
    setComments([])
    setNewComment('')
    setCommentError('')
    setStatusError('')
    setAdminActionError('')
  }

  const countByStatus = (status) => {
    return tickets.filter(
        (ticket) => ticket.status === status
    ).length
  }

  const assignedToMeTickets = user
      ? tickets.filter(
          (ticket) =>
              ticket.assignedTechnician?.id === user.id
      )
      : []

  const displayedTechnicianTickets =
      technicianView === 'MINE'
          ? assignedToMeTickets
          : tickets

  const isEmployee = user?.role === 'EMPLOYEE'
  const isTechnician = user?.role === 'TECHNICIAN'
  const isAdmin = user?.role === 'ADMIN'

  const technicianUsers = users.filter(
      (account) => account.role === 'TECHNICIAN'
  )

  if (user) {
    return (
        <div className="dashboard">

          <header className="dashboard-header">

            <div className="dashboard-brand">
              <div className="small-brand-badge">
                AD
              </div>

              <div>
                <h2>AeroDesk IT</h2>
                <span>Service Management</span>
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
                  onClick={handleLogout}
              >
                Sign Out
              </button>

            </div>

          </header>

          <main className="dashboard-content">

            <div className="welcome-section">

              <div>

                <p className="eyebrow">
                  {isEmployee
                      ? 'EMPLOYEE PORTAL'
                      : isTechnician
                          ? 'TECHNICIAN PORTAL'
                          : 'ADMIN PORTAL'}
                </p>

                <h1>
                  Welcome back, {user.name}
                </h1>

                <p>
                  {isEmployee
                      ? 'View and manage your IT support requests.'
                      : isTechnician
                          ? 'Review and manage IT support tickets across AeroDesk.'
                          : 'Manage AeroDesk tickets, assignments, and user accounts.'}
                </p>

              </div>

              {isEmployee && (
                  <button
                      type="button"
                      className="create-ticket-button"
                      onClick={() =>
                          setShowCreateTicket(true)
                      }
                  >
                    + Create Ticket
                  </button>
              )}

              {isAdmin && adminView === 'USERS' && (
                  <button
                      type="button"
                      className="create-ticket-button"
                      onClick={() => {
                        setUserMessage('')
                        setShowCreateUser(true)
                      }}
                  >
                    + Create User
                  </button>
              )}

            </div>

            {showCreateTicket && isEmployee && (
                <div className="modal-overlay">

                  <div className="ticket-modal">

                    <div className="modal-header">

                      <div>
                        <h2>
                          Create Support Ticket
                        </h2>

                        <p>
                          Tell the IT team what you need help with.
                        </p>
                      </div>

                      <button
                          type="button"
                          className="close-button"
                          onClick={() =>
                              setShowCreateTicket(false)
                          }
                      >
                        ×
                      </button>

                    </div>

                    <form onSubmit={handleCreateTicket}>

                      <div className="form-group">

                        <label>
                          Title
                        </label>

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

                        <label>
                          Description
                        </label>

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

                          <label>
                            Category
                          </label>

                          <select
                              value={newTicket.category}
                              onChange={(event) =>
                                  setNewTicket({
                                    ...newTicket,
                                    category: event.target.value,
                                  })
                              }
                          >
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

                        <div className="form-group">

                          <label>
                            Priority
                          </label>

                          <select
                              value={newTicket.priority}
                              onChange={(event) =>
                                  setNewTicket({
                                    ...newTicket,
                                    priority: event.target.value,
                                  })
                              }
                          >
                            <option value="LOW">
                              Low
                            </option>

                            <option value="MEDIUM">
                              Medium
                            </option>

                            <option value="HIGH">
                              High
                            </option>
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
                            onClick={() =>
                                setShowCreateTicket(false)
                            }
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
            )}

            {showCreateUser && isAdmin && (
                <div className="modal-overlay">

                  <div className="ticket-modal">

                    <div className="modal-header">

                      <div>
                        <h2>Create AeroDesk User</h2>
                        <p>
                          Add an employee, technician, or administrator account.
                        </p>
                      </div>

                      <button
                          type="button"
                          className="close-button"
                          onClick={() => {
                            setShowCreateUser(false)
                            setUserMessage('')
                          }}
                      >
                        ×
                      </button>

                    </div>

                    <form onSubmit={handleCreateUser}>

                      <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={newUser.name}
                            onChange={(event) =>
                                setNewUser({
                                  ...newUser,
                                  name: event.target.value,
                                })
                            }
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="name@aerodesk.com"
                            value={newUser.email}
                            onChange={(event) =>
                                setNewUser({
                                  ...newUser,
                                  email: event.target.value,
                                })
                            }
                            required
                        />
                      </div>

                      <div className="form-row">

                        <div className="form-group">
                          <label>Role</label>
                          <select
                              value={newUser.role}
                              onChange={(event) =>
                                  setNewUser({
                                    ...newUser,
                                    role: event.target.value,
                                  })
                              }
                          >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="TECHNICIAN">Technician</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Temporary Password</label>
                          <input
                              type="password"
                              placeholder="Enter password"
                              value={newUser.password}
                              onChange={(event) =>
                                  setNewUser({
                                    ...newUser,
                                    password: event.target.value,
                                  })
                              }
                              required
                          />
                        </div>

                      </div>

                      {userMessage && (
                          <p className="ticket-error">
                            {userMessage}
                          </p>
                      )}

                      <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                              setShowCreateUser(false)
                              setUserMessage('')
                            }}
                        >
                          Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-ticket-button"
                        >
                          Create User
                        </button>

                      </div>

                    </form>

                  </div>

                </div>
            )}

            {selectedTicket && (
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
                          onClick={closeTicketDetails}
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

                          <h3>Admin Controls</h3>

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
                                      handleAssignTechnician(
                                          event.target.value
                                      )
                                  }
                              >
                                <option value="" disabled>
                                  Select technician
                                </option>

                                {technicianUsers.map((technician) => (
                                    <option
                                        key={technician.id}
                                        value={technician.id}
                                    >
                                      {technician.name}
                                    </option>
                                ))}
                              </select>
                            </div>

                            <button
                                type="button"
                                className="delete-ticket-button"
                                disabled={adminActionLoading}
                                onClick={handleDeleteTicket}
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
                                        handleUpdateStatus(
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
                                            handleUpdateStatus(
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
                          onSubmit={handleAddComment}
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
            )}

            {isEmployee && (
                <>
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

                    {tickets.length === 0 ? (
                        <div className="empty-state">

                          <h3>
                            No tickets yet
                          </h3>

                          <p>
                            Create your first support request
                            to get started.
                          </p>

                        </div>
                    ) : (
                        <div className="ticket-table-wrapper">

                          <table className="ticket-table">

                            <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Priority</th>
                              <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>

                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    className="ticket-row"
                                    onClick={() =>
                                        openTicket(ticket)
                                    }
                                >

                                  <td>
                                    #{ticket.id}
                                  </td>

                                  <td className="ticket-title">
                                    {ticket.title}
                                  </td>

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
                                {ticket.status?.replace(
                                    '_',
                                    ' '
                                )}
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

            {isTechnician && (
                <>
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

                    {displayedTechnicianTickets.length ===
                    0 ? (
                        <div className="empty-state">

                          <h3>
                            No tickets found
                          </h3>

                          <p>
                            There are no tickets in this view.
                          </p>

                        </div>
                    ) : (
                        <div className="ticket-table-wrapper">

                          <table className="ticket-table">

                            <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Requester</th>
                              <th>Category</th>
                              <th>Priority</th>
                              <th>Status</th>
                              <th>Technician</th>
                            </tr>
                            </thead>

                            <tbody>

                            {displayedTechnicianTickets.map(
                                (ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="ticket-row"
                                        onClick={() =>
                                            openTicket(ticket)
                                        }
                                    >

                                      <td>
                                        #{ticket.id}
                                      </td>

                                      <td className="ticket-title">
                                        {ticket.title}
                                      </td>

                                      <td>
                                        {ticket.requester?.name ||
                                            'Unknown'}
                                      </td>

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
                                    {ticket.status?.replace(
                                        '_',
                                        ' '
                                    )}
                                  </span>
                                      </td>

                                      <td>
                                        {ticket
                                                .assignedTechnician
                                                ?.name ||
                                            'Unassigned'}
                                      </td>

                                    </tr>
                                )
                            )}

                            </tbody>

                          </table>

                        </div>
                    )}

                  </section>
                </>
            )}

            {isAdmin && (
                <>

                  <div className="admin-navigation">

                    <button
                        type="button"
                        className={
                          adminView === 'TICKETS'
                              ? 'admin-nav-button active'
                              : 'admin-nav-button'
                        }
                        onClick={() => setAdminView('TICKETS')}
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
                        onClick={() => setAdminView('USERS')}
                    >
                      User Management
                    </button>

                  </div>

                  {adminView === 'TICKETS' && (
                      <>

                        <section className="stats-grid">

                          <div className="stat-card">
                            <span>Open Tickets</span>
                            <strong>{countByStatus('OPEN')}</strong>
                            <p>Waiting for support</p>
                          </div>

                          <div className="stat-card">
                            <span>In Progress</span>
                            <strong>{countByStatus('IN_PROGRESS')}</strong>
                            <p>Currently being worked</p>
                          </div>

                          <div className="stat-card">
                            <span>Resolved</span>
                            <strong>{countByStatus('RESOLVED')}</strong>
                            <p>Completed requests</p>
                          </div>

                          <div className="stat-card">
                            <span>Total Tickets</span>
                            <strong>{tickets.length}</strong>
                            <p>All AeroDesk requests</p>
                          </div>

                        </section>

                        <section className="tickets-section">

                          <div className="section-heading">
                            <div>
                              <h2>Ticket Management</h2>
                              <p>
                                View, assign, update, and manage all support tickets.
                              </p>
                            </div>
                          </div>

                          {tickets.length === 0 ? (
                              <div className="empty-state">
                                <h3>No tickets found</h3>
                                <p>There are currently no AeroDesk tickets.</p>
                              </div>
                          ) : (
                              <div className="ticket-table-wrapper">

                                <table className="ticket-table">

                                  <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Requester</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Technician</th>
                                  </tr>
                                  </thead>

                                  <tbody>

                                  {tickets.map((ticket) => (
                                      <tr
                                          key={ticket.id}
                                          className="ticket-row"
                                          onClick={() => openTicket(ticket)}
                                      >
                                        <td>#{ticket.id}</td>

                                        <td className="ticket-title">
                                          {ticket.title}
                                        </td>

                                        <td>
                                          {ticket.requester?.name || 'Unknown'}
                                        </td>

                                        <td>{ticket.category}</td>

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

                                        <td>
                                          {ticket.assignedTechnician?.name ||
                                              'Unassigned'}
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

                  {adminView === 'USERS' && (
                      <>

                        <section className="stats-grid">

                          <div className="stat-card">
                            <span>Total Users</span>
                            <strong>{users.length}</strong>
                            <p>All AeroDesk accounts</p>
                          </div>

                          <div className="stat-card">
                            <span>Employees</span>
                            <strong>
                              {
                                users.filter(
                                    (account) =>
                                        account.role === 'EMPLOYEE'
                                ).length
                              }
                            </strong>
                            <p>Employee accounts</p>
                          </div>

                          <div className="stat-card">
                            <span>Technicians</span>
                            <strong>{technicianUsers.length}</strong>
                            <p>IT support accounts</p>
                          </div>

                          <div className="stat-card">
                            <span>Administrators</span>
                            <strong>
                              {
                                users.filter(
                                    (account) =>
                                        account.role === 'ADMIN'
                                ).length
                              }
                            </strong>
                            <p>Administrative accounts</p>
                          </div>

                        </section>

                        <section className="tickets-section">

                          <div className="section-heading">
                            <div>
                              <h2>User Management</h2>
                              <p>
                                Review AeroDesk accounts and their assigned roles.
                              </p>
                            </div>
                          </div>

                          {users.length === 0 ? (
                              <div className="empty-state">
                                <h3>No users found</h3>
                                <p>No AeroDesk accounts are available.</p>
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
                                        <td>#{account.id}</td>
                                        <td className="ticket-title">
                                          {account.name}
                                        </td>
                                        <td>{account.email}</td>
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
            )}

          </main>

        </div>
    )
  }

  return (
      <div className="login-page">

        <div className="login-brand">

          <div className="brand-badge">
            AD
          </div>

          <h1>
            AeroDesk IT
          </h1>

          <p>
            Secure IT service management for employees,
            technicians, and administrators.
          </p>

        </div>

        <div className="login-card">

          <div className="login-header">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to AeroDesk.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                  id="email"
                  type="email"
                  placeholder="name@aerodesk.com"
                  value={email}
                  onChange={(event) =>
                      setEmail(event.target.value)
                  }
                  required
              />

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                      setPassword(event.target.value)
                  }
                  required
              />

            </div>

            <button
                className="login-button"
                type="submit"
                disabled={loading}
            >
              {loading
                  ? 'Signing in...'
                  : 'Sign In'}
            </button>

            {message && (
                <p className="login-message">
                  {message}
                </p>
            )}

          </form>

        </div>

      </div>
  )
}

export default App