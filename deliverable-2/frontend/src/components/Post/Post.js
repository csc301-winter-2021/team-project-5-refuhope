import React, { useState } from 'react'
import './Post.css'

function Post() {
    const [title, setTitle] = useState('Title')
    const [status, setStatus] = useState('In Review')
    const [host, setHost] = useState('')
    const [workType, setWorkType] = useState('')
    const [location, setLocation] = useState('')
    const [schedule, setSchedule] = useState('')
    const [hours, setHours] = useState('')
    const [info, setInfo] = useState('')
    var statusColor = "statusIR"

    function updateTitle(title) {
        setTitle(title)
    }

    function updateStatus(status) {
        setStatus(status)
        if (status === "Matched") {
            statusColor = "statusM"
        }
    }

    function updateHost(host) {
        setHost(host)
    }

    function updateWorkType(workType) {
        setWorkType(workType)
    }

    function updateLocation(location) {
        setLocation(location)
    }

    function updateSchedule(schedule) {
        setSchedule(schedule)
    }

    function updateHours(hours) {
        setHours(hours)
    }

    function updateInfo(info) {
        setInfo(info)
    }

    return (
        <div className="postbox" data-title = {title}>
            <div className={statusColor}> 
                {status}
            </div>
            <div className="info">
                <span className="section">Host:</span> <br></br>{host}
                <br></br>
                <span className="section">Work Type:</span> <br></br>{workType}
                <br></br>
                <span className="section">Location:</span> <br></br>{location}
                <br></br>
                <span className="section">Schedule:</span> <br></br>{schedule}
                <br></br>
                <span className="section">Hours:</span> <br></br>{hours}
                <br></br>
                <span className="section">Additional information:</span> <br></br>{info}
            </div>
        </div>
    )
}

export default Post