import React from 'react'
import { useState, useEffect } from 'react'

import Refugee from '../Refugee/Refugee'
import Form from "../Form/Form"
import './VolunteerDash.css'

/* API Calls. */

const getRefugees = async () => {

    const request = new Request('/api/refugees', { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return false
    }
}

const postRefugee = async (newRefugee) => {

    const request = new Request(
        '/api/refugees',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newRefugee)
        }
    )

    const response = await fetch(request)
    if (response.ok) {
        const data = await response.json()
        return data.response._id
    } else {
        return false
    }
}

const putRefugee = async (updatedRefugee) => {

    const request = new Request(
        `/api/refugees/${updatedRefugee._id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(updatedRefugee)
        }
    )
    const response = await fetch(request)
    return response.ok
}

const deleteRefugee = async (id) => {

    const request = new Request(
        `/api/refugees/${id}`,
        {
            method: 'DELETE'
        }
    )
    const response = await fetch(request)
    return response.ok
}

const RefugeeDash = () => {

    /* Setup */

    const [refugees, setRefugees] = useState([])
    const [modalContent, setModalContent] = useState(null)

    // The empty array argument indicates that this funciton should only be run on this component's intial render.
    useEffect(() => {

        // Apparently this IIFE is needed to avoid race conditions in rendering.
        (async () => {
            const refugeeList = await getRefugees()
            if (refugeeList === null) {
                alert("Couldn't load  Refugees.")
            } else {
                setRefugees(refugeeList)
            }
        })()
    }, [])

    /* Helpers and callbacks. */

    // Gather only the attributes required for a Refugee object
    const constructBody = (formValues) => {

        const newRefugee = {
            name: formValues.name,
            phone: formValues.phone,
            email: formValues.email,
            city: formValues.city,
            province: formValues.province,
            workType: formValues.workType,
            additionalInfo: formValues.additionalInfo,
            numWorkHours: formValues.numWorkHours,
            schedule: formValues.schedule
        }

        // If constructing the body for a PUT call, we must ensure that  _id is included
        if (formValues._id) newRefugee._id = formValues._id

        if (formValues.workType === "TUTORING") {
            newRefugee.subjects = formValues.subject
            newRefugee.gradeLevel = formValues.level
        } else if (formValues.workType === "GROCERIES") {
            newRefugee.hasCar = formValues.hasCar
            newRefugee.hasPhone = formValues.hasPhone
        }

        return newRefugee
    }

    // Render UI for creating a new Refugee.
    const createNewRefugee = () => {

        let content = (
            <div className="hostdash-modal-back">
                <Form formType="REFUGEE" save={saveRefugee} cancel={cancel} />
            </div>
        )

        setModalContent(content)
    }

    // Render UI for editing a pre-existing Refugee.
    const editRefugee = (id) => {

        let refToUpdate = refugees.find(ref => ref._id === id)
        let content = (
            <div className="hostdash-modal-back">
                <Form formType="REFUGEE" init={refToUpdate} save={modifyRefugee} cancel={cancel} />
            </div>
        )

        setModalContent(content)
    }

    // Send new Refugee to the server, and update UI according to its response.
    const saveRefugee = (formValues) => {

        const newRefugee = constructBody(formValues)
        let id = postRefugee(newRefugee)

        // Refugee successfully stored in DB; add newRefugee to list.
        if (id) {
            newRefugee._id = id
            setRefugees([...refugees, newRefugee])
        } else {
            alert("Woops! Couldn't write Refugee to DB, please try again!")
        }

        setModalContent(null)
    }

    // Send modified Refugee to the server, and update UI according to its response.
    const modifyRefugee = (formValues) => {

        const updatedRefugee = constructBody(formValues)
        let result = putRefugee(updatedRefugee)

        // Refugee successfully stored in DB; add newRefugee to list.
        if (result) {
            let newRefugees = [...refugees]
            let index = newRefugees.findIndex(ref => ref._id === updatedRefugee._id)
            // Replace old refugee with updated one
            newRefugees[index] = updatedRefugee
            setRefugees(newRefugees)
        } else {
            alert("Woops! Couldn't write Refugee to DB, please try again!")
        }

        setModalContent(null)
    }

    const delRefugee = (id) => {

        const result = deleteRefugee(id)

        if (result) {
            let newRefugees = [...refugees]
            let index = newRefugees.findIndex(ref => ref._id === id)
            newRefugees.splice(index, 1)
            setRefugees(newRefugees)
        } else {
            alert("Woops! Couldn't delete Refugee, please try again!")
        }
    }

    const cancel = () => {
        setModalContent(null)
    }

    return (
        <div className="refugeedash-container">
            <nav className="refugeedash-nav">
                <p>RefuTalent</p>
                <button onClick={createNewRefugee}>Create New Refugee</button>
            </nav>
            <div className="refugeedash">
                {modalContent}
                {refugees.map(ref => {
                    return (
                        <Refugee
                            key={ref._id}
                            _id={ref._id}
                            name={ref.name}
                            phone={ref.phone}
                            email={ref.email}
                            location={ref.city + ", " + ref.province}
                            workType={ref.workType}
                            additionalInfo={ref.additionalInfo}
                            edit={editRefugee}
                            delete={delRefugee}
                        ></Refugee>
                    )
                })}
            </div>
        </div >
    )
}

export default RefugeeDash
