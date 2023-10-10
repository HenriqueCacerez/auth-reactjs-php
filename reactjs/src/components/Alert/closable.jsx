import React from 'react'

function AlertClosable({title, message, color = "warning", onClose}) {
    return (
        <div className={`alert text-center alert-${color} alert-dismissible fade show`} role="alert">
            <strong>{title}</strong> {message}
            <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}

export default AlertClosable