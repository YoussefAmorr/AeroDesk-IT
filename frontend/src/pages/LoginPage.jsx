function LoginPage({
                       email,
                       setEmail,
                       password,
                       setPassword,
                       message,
                       loading,
                       onLogin,
                   }) {
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

                <form onSubmit={onLogin}>

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

export default LoginPage