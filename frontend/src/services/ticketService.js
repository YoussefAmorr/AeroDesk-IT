const API_BASE_URL = 'http://localhost:8080'

function authHeaders(token, extraHeaders = {}) {
    return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
    }
}

async function requireOk(response, message) {
    if (!response.ok) {
        const error = new Error(message)
        error.status = response.status
        throw error
    }

    return response
}

export async function getTickets(token) {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        headers: authHeaders(token),
    })

    await requireOk(response, 'Unable to load tickets')

    return response.json()
}

export async function getTicketById(ticketId, token) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}`,
        {
            headers: authHeaders(token),
        }
    )

    await requireOk(response, 'Unable to load ticket')

    return response.json()
}

export async function createTicket(ticket, token) {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: authHeaders(token, {
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(ticket),
    })

    await requireOk(response, 'Unable to create ticket.')

    return response.json()
}

export async function getComments(ticketId, token) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/comments`,
        {
            headers: authHeaders(token),
        }
    )

    await requireOk(response, 'Unable to load comments')

    return response.json()
}

export async function addComment(ticketId, message, token) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/comments`,
        {
            method: 'POST',
            headers: authHeaders(token, {
                'Content-Type': 'text/plain',
            }),
            body: message,
        }
    )

    await requireOk(response, 'Unable to add comment.')

    return response.json()
}

export async function updateTicketStatus(
    ticketId,
    status,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/status/${status}`,
        {
            method: 'PUT',
            headers: authHeaders(token),
        }
    )

    await requireOk(
        response,
        'Unable to update ticket status.'
    )

    return response.json()
}

export async function assignTechnician(
    ticketId,
    technicianId,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/assign/${technicianId}`,
        {
            method: 'PUT',
            headers: authHeaders(token),
        }
    )

    await requireOk(
        response,
        'Unable to assign technician.'
    )

    return response.json()
}

export async function deleteTicket(ticketId, token) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}`,
        {
            method: 'DELETE',
            headers: authHeaders(token),
        }
    )

    await requireOk(response, 'Unable to delete ticket.')
}