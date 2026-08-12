const API_BASE_URL = 'http://localhost:8080'

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })

    if (!response.ok) {
        const error = new Error('Invalid email or password.')
        error.status = response.status
        throw error
    }

    return response.json()
}