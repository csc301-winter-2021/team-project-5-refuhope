import React from 'react'
import { useState, useEffect } from 'react'

import Refugee, { Detail, REFUGEE_TEMPLATE } from '../Refugee/Refugee'
import './VolunteerDash.css'

/* API Calls. */

const getRefugees = async () => {

    const request = new Request('/api/refugeeSearch', { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}

const postRefugee = async (newRefugee) => {

    const body = {
        name: newRefugee.name,
        phone: newRefugee.phone,
        email: newRefugee.email,
        // Expects location to be in the form: city, province
        city: newRefugee.location.split(",")[0],
        // key is "prov" and not "province" due for compatability with backend. FIX IT
        prov: newRefugee.location.split(",")[1],
        workType: newRefugee.workType,
        schedule: [],
        numWorkHours: newRefugee.numWorkHours,
        // additionalInfo: newRefugee.additionalInfo
    }

    const request = new Request(
        '/api/refugeeAdd',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(body)
        }
    )
    const response = await fetch(request)

    return response.ok
}

const RefugeeDash = () => {

    /* Setup */

    const [refugees, setRefugees] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)
    const [newRefugee, setNewRefugee] = useState(Object.create(REFUGEE_TEMPLATE))

    // The empty array argument indicates that this funciton should only be run on this component's intial render.
    useEffect(() => {

        // Apparently this IIFE is needed to avoid race conditions in rendering.
        (async () => {
            const refugeeList = await getRefugees()
            if (refugeeList === null) {
                alert("Couldn't load  Refugees.")
            } else {
                const refugeeComponents = refugeeList.map(ref => {
                    return (
                        <Refugee
                            key={ref._id}
                            name={ref.name}
                            phone={ref.phone}
                            email={ref.email}
                            location={ref.city + ", " + ref.province}
                            workType={ref.workType}
                            schedule={"WIP"}
                            numWorkHours={ref.numWorkHours}
                        ></Refugee>
                    )
                })
                setRefugees(refugeeComponents)
            }
        })()
    }, [])

    /* Helpers and callbacks. */

    const handleEdit = (event, key) => {
        // Modified attributes are first stored in the buffer.
        let updatedInfo = { ...newRefugee }
        updatedInfo[key] = event.target.value
        setNewRefugee(updatedInfo)
    }

    const saveEdit = (save) => {

        // Try to write refugee to DB.
        if (save) {
            const successful = postRefugee(newRefugee)
            // Refugee successfully stored in DB; create UI element.
            if (successful) {
                let newRefugeeComp = <Refugee {...newRefugee}></Refugee>
                setRefugees([...refugees, newRefugeeComp])
            } else {
                // Write to databse failed.
                alert("Woops! Couldn't write Refugee to DB, please try again!")
            }
            // Reset edit buffer.
            setNewRefugee(Object.create(REFUGEE_TEMPLATE))
        }

        // Change back to non-edit mode.
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
