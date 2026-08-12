import { useState } from 'react'
import './App.css'
import DashboardHeader from './components/DashboardHeader'
import LoginPage from './pages/LoginPage'
import CreateTicketModal from './components/CreateTicketModal'
import CreateUserModal from './components/CreateUserModal'
import TicketDetailsModal from './components/TicketDetailsModal'
import TicketTable from './components/TicketTable'

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

          <DashboardHeader
              user={user}
              onLogout={handleLogout}
          />

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
                <CreateTicketModal
                    newTicket={newTicket}
                    setNewTicket={setNewTicket}
                    ticketMessage={ticketMessage}
                    onClose={() => setShowCreateTicket(false)}
                    onSubmit={handleCreateTicket}
                />
            )}

            {showCreateUser && isAdmin && (
                <CreateUserModal
                    newUser={newUser}
                    setNewUser={setNewUser}
                    userMessage={userMessage}
                    onClose={() => {
                      setShowCreateUser(false)
                      setUserMessage('')
                    }}
                    onSubmit={handleCreateUser}
                />
            )}



            {selectedTicket && (
                <TicketDetailsModal
                    selectedTicket={selectedTicket}
                    onClose={closeTicketDetails}
                    isTechnician={isTechnician}
                    isAdmin={isAdmin}
                    technicianUsers={technicianUsers}
                    adminActionLoading={adminActionLoading}
                    adminActionError={adminActionError}
                    onAssignTechnician={handleAssignTechnician}
                    onDeleteTicket={handleDeleteTicket}
                    updatingStatus={updatingStatus}
                    statusError={statusError}
                    onUpdateStatus={handleUpdateStatus}
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    commentError={commentError}
                    onAddComment={handleAddComment}
                />
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

                    <TicketTable
                        tickets={tickets}
                        onOpenTicket={openTicket}
                    />

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

                    <TicketTable
                        tickets={displayedTechnicianTickets}
                        onOpenTicket={openTicket}
                        showRequester={true}
                        showTechnician={true}
                    />

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

                          <TicketTable
                              tickets={tickets}
                              onOpenTicket={openTicket}
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
      <LoginPage
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          message={message}
          loading={loading}
          onLogin={handleLogin}
      />
  )
}

export default App