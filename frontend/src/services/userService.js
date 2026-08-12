const API_BASE_URL = 'http://localhost:8080'

function authHeaders(token, extraHeaders = {}) {
    return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
    }
}

export async function getUsers(token) {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: authHeaders(token),
    })

    if (!response.ok) {
        const error = new Error('Unable to load users')
        error.status = response.status
        throw error
    }

    return response.json()
}

export async function createUser(user, token) {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: authHeaders(token, {
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        const error = new Error('Unable to create user.')
        error.status = response.status
        throw error
    }

    return response.json()
}