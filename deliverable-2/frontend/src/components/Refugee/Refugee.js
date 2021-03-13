import React from 'react'
import { useState } from 'react'
import './Refugee.css'

/**
 * Expects props to have the following structure.
 * 
 * {
 *  name: String,
 *  phone: String,
 *  email: String,
 *  location: String,
 *  workType: String,
 *  schedule: String,
 *  numWorkHours: int
 * }
 * 
 * In the near future, schedule should be updated so that its a 3-dimensional array.
 */
const Refugee = (props) => {

    // Stores a Refugees' details
    const [info, setInfo] = useState(props)

    // Acts like a buffer for updated details.
    const [editDetailsBuffer, setEditDetailsBuffer] = useState(props)
    const [beingEdited, setBeingEdited] = useState(false)

    const handleEdit = (event, detailToUpdate) => {
        let updatedInfo = { ...editDetailsBuffer }
        updatedInfo[detailToUpdate] = event.target.value
        setEditDetailsBuffer(updatedInfo)
    }

    const saveEdit = (save) => {
        if (save) {
            // TODO: Create a PUT request; only update state if response is OK
            setInfo(editDetailsBuffer)
        } else {
            // Reset the update buffer object.
            setEditDetailsBuffer(info)
        }
        setBeingEdited(false)
    }

    const generateCardBody = () => {

        if (beingEdited) { // Render editable inputs.
            // Create a controlled input for each piece of info.
            let inputs = Object.keys(info).map(detail =>
                <input
                    key={detail}
                    placeholder={editDetailsBuffer[detail]}
                    value={editDetailsBuffer[detail]}
                    onChange={(e) => handleEdit(e, detail)}>
                </input>)

            return (
                <div className="refugee-card">
                    <div className="refugee-card-btn-tray">
                        <button onClick={() => saveEdit(true)}>Save</button>
                        <button onClick={() => saveEdit(false)}>Cancel</button>
                    </div>
                    {inputs}

                </div>)
        } else { // Render immutable paragraphs.
            return (
                <div className="refugee-card">
                    <button onClick={() => setBeingEdited(true)}>Edit</button>
                    <p className="refugee-name">{info.name}</p>
                    <p>Phone: {info.phone}</p>
                    <p>Email: {info.email}</p>
                    <p>Location: {info.location}</p>
                    <p>Work Type: {info.workType}</p>
                    <p>Schedule: {info.schedule}</p>
                    <p>Hours: {info.numWorkHours}</p>
                </div>)
        }
    }

    return (
        // Acts as a div, without creating a div in the DOM.
        <React.Fragment>
            {generateCardBody()}
        </React.Fragment>
    )
}

export default Refugee