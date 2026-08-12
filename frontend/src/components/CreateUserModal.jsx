function CreateUserModal({
                             newUser,
                             setNewUser,
                             userMessage,
                             onClose,
                             onSubmit,
                         }) {
    return (
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
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>

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
                                <option value="EMPLOYEE">
                                    Employee
                                </option>

                                <option value="TECHNICIAN">
                                    Technician
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>
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
                            onClick={onClose}
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
    )
}

export default CreateUserModal