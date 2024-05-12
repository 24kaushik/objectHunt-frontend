import React from 'react'
import { useError } from '../context/ErrorContext'

const Error = () => {
    const { error, setError } = useError()

    const handleClose = () => {
        setError("");
    }
    return (
        <div>
            <div className={error === "" ? 'menu_display' : 'menu_display show'} style={{ maxWidth: "450px", margin: "0 auto", left: 0, right: 0 }}>
                <h1>Error: </h1>
                <div className='error_message'>
                    {error}
                </div>
                <div className="display_icons">
                    <button className="db_2" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default Error
