import { useState } from 'react'
import './App.css'

import DashboardHeader from './components/DashboardHeader'
import CreateTicketModal from './components/CreateTicketModal'
import CreateUserModal from './components/CreateUserModal'
import TicketDetailsModal from './components/TicketDetailsModal'

import LoginPage from './pages/LoginPage'
import EmployeeDashboard from './pages/EmployeeDashboard'
import TechnicianDashboard from './pages/TechnicianDashboard'
import AdminDashboard from './pages/AdminDashboard'

import { login } from './services/authService'

import {
  addComment,
  assignTechnician,
  createTicket,
  deleteTicket,
  getComments,
  getTicketById,
  getTickets,
  updateTicketStatus,
} from './services/ticketService'

import {
  createUser,
  getUsers,
} from './services/userService'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])

  const [showCreateTicket, setShowCreateTicket] =
      useState(false)

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'MEDIUM',
  })

  const [ticketMessage, setTicketMessage] =
      useState('')

  const [selectedTicket, setSelectedTicket] =
      useState(null)

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState('')

  const [statusError, setStatusError] = useState('')
  const [updatingStatus, setUpdatingStatus] =
      useState(false)

  const [technicianView, setTechnicianView] =
      useState('ALL')

  // Admin portal state
  const [users, setUsers] = useState([])
  const [adminView, setAdminView] =
      useState('TICKETS')

  const [showCreateUser, setShowCreateUser] =
      useState(false)

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    password: '',
  })

  const [userMessage, setUserMessage] = useState('')

  const [adminActionError, setAdminActionError] =
      useState('')

  const [
    adminActionLoading,
    setAdminActionLoading,
  ] = useState(false)

  const loadTickets = async (token) => {
    const data = await getTickets(token)
    setTickets(data)
  }

  const loadUsers = async (token) => {
    const data = await getUsers(token)
    setUsers(data)
  }

  const openTicket = async (ticket) => {
    const token = localStorage.getItem('token')

    setCommentError('')
    setStatusError('')
    setAdminActionError('')
    setNewComment('')

    try {
      const [ticketData, commentsData] =
          await Promise.all([
            getTicketById(ticket.id, token),
            getComments(ticket.id, token),
          ])

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
      await createTicket(newTicket, token)

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
      if (
          error.message === 'Unable to create ticket.'
      ) {
        setTicketMessage(
            'Unable to create ticket.'
        )
      } else {
        setTicketMessage(
            'Unable to connect to AeroDesk.'
        )
      }
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
      const savedComment = await addComment(
          selectedTicket.id,
          newComment,
          token
      )

      setComments((currentComments) => [
        ...currentComments,
        savedComment,
      ])

      setNewComment('')
    } catch (error) {
      if (
          error.message === 'Unable to add comment.'
      ) {
        setCommentError(
            'Unable to add comment.'
        )
      } else {
        setCommentError(
            'Unable to connect to AeroDesk.'
        )
      }
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    const token = localStorage.getItem('token')

    setStatusError('')
    setUpdatingStatus(true)

    try {
      const updatedTicket =
          await updateTicketStatus(
              selectedTicket.id,
              newStatus,
              token
          )

      setSelectedTicket(updatedTicket)

      setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
              ticket.id === updatedTicket.id
                  ? updatedTicket
                  : ticket
          )
      )
    } catch (error) {
      if (
          error.message ===
          'Unable to update ticket status.'
      ) {
        setStatusError(
            'Unable to update ticket status.'
        )
      } else {
        setStatusError(
            'Unable to connect to AeroDesk.'
        )
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    setUserMessage('')

    try {
      await createUser(newUser, token)

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
      if (error.status === 409) {
        setUserMessage(
            'A user with this email already exists.'
        )
      } else if (error.status === 400) {
        setUserMessage(
            'Please check the user information and try again.'
        )
      } else if (error.status) {
        setUserMessage(
            'Unable to create user.'
        )
      } else {
        setUserMessage(
            'Unable to connect to AeroDesk.'
        )
      }
    }
  }

  const handleAssignTechnician = async (
      technicianId
  ) => {
    if (!selectedTicket || !technicianId) {
      return
    }

    const token = localStorage.getItem('token')

    setAdminActionError('')
    setAdminActionLoading(true)

    try {
      const updatedTicket =
          await assignTechnician(
              selectedTicket.id,
              technicianId,
              token
          )

      setSelectedTicket(updatedTicket)

      setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
              ticket.id === updatedTicket.id
                  ? updatedTicket
                  : ticket
          )
      )
    } catch (error) {
      if (
          error.message ===
          'Unable to assign technician.'
      ) {
        setAdminActionError(
            'Unable to assign technician.'
        )
      } else {
        setAdminActionError(
            'Unable to connect to AeroDesk.'
        )
      }
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
      await deleteTicket(
          selectedTicket.id,
          token
      )

      setTickets((currentTickets) =>
          currentTickets.filter(
              (ticket) =>
                  ticket.id !== selectedTicket.id
          )
      )

      closeTicketDetails()
    } catch (error) {
      if (
          error.message ===
          'Unable to delete ticket.'
      ) {
        setAdminActionError(
            'Unable to delete ticket.'
        )
      } else {
        setAdminActionError(
            'Unable to connect to AeroDesk.'
        )
      }
    } finally {
      setAdminActionLoading(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const data = await login(
          email,
          password
      )

      localStorage.setItem(
          'token',
          data.token
      )

      localStorage.setItem(
          'user',
          JSON.stringify(data)
      )

      setUser(data)

      await loadTickets(data.token)

      if (data.role === 'ADMIN') {
        await loadUsers(data.token)
      }
    } catch (error) {
      if (error.status) {
        setMessage(
            'Invalid email or password.'
        )
      } else {
        setMessage(
            'Unable to connect to AeroDesk.'
        )
      }
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
              ticket.assignedTechnician?.id ===
              user.id
      )
      : []

  const displayedTechnicianTickets =
      technicianView === 'MINE'
          ? assignedToMeTickets
          : tickets

  const isEmployee =
      user?.role === 'EMPLOYEE'

  const isTechnician =
      user?.role === 'TECHNICIAN'

  const isAdmin =
      user?.role === 'ADMIN'

  const technicianUsers = users.filter(
      (account) =>
          account.role === 'TECHNICIAN'
  )

  if (user) {
    return (
        <div className="dashboard">

          <DashboardHeader
              user={user}
              onLogout={handleLogout}
          />

          <main className="dashboard-content">

            {isEmployee && (
                <EmployeeDashboard
                    user={user}
                    tickets={tickets}
                    countByStatus={countByStatus}
                    onCreateTicket={() =>
                        setShowCreateTicket(true)
                    }
                    onOpenTicket={openTicket}
                />
            )}

            {isTechnician && (
                <TechnicianDashboard
                    user={user}
                    tickets={tickets}
                    countByStatus={countByStatus}
                    assignedToMeTickets={
                      assignedToMeTickets
                    }
                    technicianView={
                      technicianView
                    }
                    setTechnicianView={
                      setTechnicianView
                    }
                    displayedTechnicianTickets={
                      displayedTechnicianTickets
                    }
                    onOpenTicket={openTicket}
                />
            )}

            {isAdmin && (
                <AdminDashboard
                    user={user}
                    tickets={tickets}
                    users={users}
                    adminView={adminView}
                    setAdminView={setAdminView}
                    countByStatus={countByStatus}
                    technicianUsers={
                      technicianUsers
                    }
                    onOpenTicket={openTicket}
                    onCreateUser={() => {
                      setUserMessage('')
                      setShowCreateUser(true)
                    }}
                />
            )}

            {showCreateTicket &&
                isEmployee && (
                    <CreateTicketModal
                        newTicket={newTicket}
                        setNewTicket={
                          setNewTicket
                        }
                        ticketMessage={
                          ticketMessage
                        }
                        onClose={() =>
                            setShowCreateTicket(
                                false
                            )
                        }
                        onSubmit={
                          handleCreateTicket
                        }
                    />
                )}

            {showCreateUser &&
                isAdmin && (
                    <CreateUserModal
                        newUser={newUser}
                        setNewUser={setNewUser}
                        userMessage={
                          userMessage
                        }
                        onClose={() => {
                          setShowCreateUser(false)
                          setUserMessage('')
                        }}
                        onSubmit={
                          handleCreateUser
                        }
                    />
                )}

            {selectedTicket && (
                <TicketDetailsModal
                    selectedTicket={
                      selectedTicket
                    }
                    onClose={
                      closeTicketDetails
                    }
                    isTechnician={
                      isTechnician
                    }
                    isAdmin={isAdmin}
                    technicianUsers={
                      technicianUsers
                    }
                    adminActionLoading={
                      adminActionLoading
                    }
                    adminActionError={
                      adminActionError
                    }
                    onAssignTechnician={
                      handleAssignTechnician
                    }
                    onDeleteTicket={
                      handleDeleteTicket
                    }
                    updatingStatus={
                      updatingStatus
                    }
                    statusError={statusError}
                    onUpdateStatus={
                      handleUpdateStatus
                    }
                    comments={comments}
                    newComment={newComment}
                    setNewComment={
                      setNewComment
                    }
                    commentError={
                      commentError
                    }
                    onAddComment={
                      handleAddComment
                    }
                />
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