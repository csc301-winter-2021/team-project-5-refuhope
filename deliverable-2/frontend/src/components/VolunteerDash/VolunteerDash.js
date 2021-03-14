import React from 'react'
import { useState, useEffect } from 'react'

import Refugee, { Detail, REFUGEE_TEMPLATE } from '../Refugee/Refugee'
import './VolunteerDash.css'


const RefugeeDash = () => {

    const [refugees, setRefugees] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)
    const [newRefugee, setNewRefugee] = useState(Object.create(REFUGEE_TEMPLATE))

    const handleEdit = (event, key) => {
        // Modified attributes are first stored in the buffer.
        let updatedInfo = { ...newRefugee }
        updatedInfo[key] = event.target.value
        setNewRefugee(updatedInfo)
    }

    const saveEdit = (save) => {
        if (save) {
            // TODO: Create a POST request; only add new Refugee to state if status is OK.
            let newRefugeeComp = <Refugee {...newRefugee}></Refugee>
            setRefugees([...refugees, newRefugeeComp])
        } else {
            setNewRefugee(Object.create(REFUGEE_TEMPLATE))
        }
        setBeingEdited(false)
    }

    const renderModal = () => {
        if (beingEdited) {

            const details = Object.keys(REFUGEE_TEMPLATE).map(key => {
                return (
                    <Detail
                        key={key}
                        detailKey={key}
                        beingEdited={beingEdited}
                        label={REFUGEE_TEMPLATE[key]}
                        value={newRefugee[key]}
                        handleEdit={handleEdit}>
                    </Detail>
                )
            })

            return (
                <div className="refugeedash-modal-back">
                    <div className="refugeedash-modal-body">
                        <div className="refugee-card-btn-tray">
                            <button onClick={() => saveEdit(true)}>Save</button>
                            <button onClick={() => saveEdit(false)}>Cancel</button>
                        </div>
                        <p className="refugeedash-modal-header">Add New Refugee</p>
                        {details}
                    </div>
                </div>
            )
        }
    }

    return (
        <React.Fragment>
            <nav className="refugeedash-nav">
                <p>RefuTalent</p>
                <button onClick={() => setBeingEdited(true)}>Create New Refugee</button>
            </nav>
            <div className="refugeedash">
                {renderModal()}
                {refugees}
            </div>
        </React.Fragment>
    )
}

export default RefugeeDash
