import React from 'react'
import './Refugee.css'

const Refugee = (prop) => {

    return (
        <div className="refugee-card">
            <p className="refugee-name">{prop.name}</p>
            <p>Phone: {prop.phone}</p>
            <p>Email: {prop.email}</p>
            <p>Location: {prop.location}</p>
            <p>Work Type: {prop.workType}</p>
            <p>Schedule: {prop.schedule}</p>
            <p>Hours: {prop.numWorkHours}</p>
        </div>
    )
}

export default Refugee