import React from 'react'
import { useState, useEffect } from 'react'

import Opportunity from '../Opportunity/Opportunity'
import Form from "../Form/Form"
import './HostDash.css'

/* API Calls. */

const getOpportunities = async (poster_id) => {

    const request = new Request(`/api/opportunities?poster=${poster_id}`, { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}

const postOpportunity = async (newOpportunity) => {

    const request = new Request(
        '/api/opportunities',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newOpportunity)
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

const putOpportunity = async (updatedOpportunity) => {

    const request = new Request(
        `/api/opportunities/${updatedOpportunity._id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(updatedOpportunity)
        }
    )
    const response = await fetch(request)
    return response.ok
}

const deleteOpportunity = async (id) => {

    const request = new Request(
        `/api/opportunities/${id}`,
        {
            method: 'DELETE'
        }
    )
    const response = await fetch(request)
    return response.ok
}

const postLogout = async () => {

    const request = new Request('/api/logout',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', }
        }
    )
    const response = await fetch(request)
    return response.ok
}

const HostDash = (props) => {

    /* Setup */

    const [opportunities, setOpportunities] = useState([])
    const [modalContent, setModalContent] = useState(null)

    // The empty array argument indicates that this funciton should only be run on this component's intial render.
    useEffect(() => {

        // Apparently this IIFE is needed to avoid race conditions in rendering.
        (async () => {
            const opportunitiesList = await getOpportunities(props.user._id)
            if (opportunitiesList === null) {
                alert("Couldn't load Posts.")
            } else {
                setOpportunities(opportunitiesList)
            }
        })()
    }, [])

    /* Helpers and callbacks. */

    // Gather only the attributes required for a Opportunity object
    const constructBody = (formValues) => {

        const newOpportunity = {
            title: formValues.title,
            city: formValues.city,
            province: formValues.province,
            workType: formValues.workType,
            additionalInfo: formValues.additionalInfo,
            numWorkHours: formValues.numWorkHours,
            schedule: formValues.schedule
        }

        // If constructing the body for a PUT call, we must ensure that  _id is included
        if (formValues._id) newOpportunity._id = formValues._id

        if (formValues.workType === "TUTORING") {
            newOpportunity.subjects = formValues.subject
            newOpportunity.gradeLevel = formValues.level
        } else if (formValues.workType === "GROCERIES") {
            newOpportunity.hasCar = formValues.hasCar
            newOpportunity.hasPhone = formValues.hasPhone
        }

        return newOpportunity
    }

    // Render UI for creating a new Opportunity.
    const createNewOpportunity = () => {

        let content = (
            <div className="hostdash-modal-back">
                <Form formType="OPPORTUNITY" save={saveOpportunity} cancel={cancel} />
            </div>
        )

        setModalContent(content)
    }

    // Render UI for editing a pre-existing Opportunity.
    const editOpportunity = (id) => {

        let opportunityToUpdate = opportunities.find(post => post._id === id)
        let content = (
            <div className="hostdash-modal-back">
                <Form
                    formType="OPPORTUNITY"
                    init={opportunityToUpdate}
                    save={modifyOpportunity}
                    cancel={cancel}
                ></Form>
            </div>
        )

        setModalContent(content)
    }

    // Send new Opportunity to the server, and update UI according to its response.
    const saveOpportunity = (formValues) => {

        const newOpportunity = constructBody(formValues)
        let id = postOpportunity(newOpportunity)

        // Opportunity successfully stored in DB; add newRefugee to list.
        if (id) {
            newOpportunity._id = id
            setOpportunities([...opportunities, newOpportunity])
        } else {
            alert("Woops! Couldn't write Opportunity to DB, please try again!")
        }

        setModalContent(null)
    }

    // Send modified Opportunity to the server, and update UI according to its response.
    const modifyOpportunity = (formValues) => {

        const updatedOpportunity = constructBody(formValues)
        let result = putOpportunity(updatedOpportunity)

        // Opportunity successfully stored in DB; add newRefugee to list.
        if (result) {
            let newOpportunities = [...opportunities]
            let index = newOpportunities.findIndex(post => post._id === updatedOpportunity._id)
            // Replace old post with updated one
            newOpportunities[index] = updatedOpportunity
            setOpportunities(newOpportunities)
        } else {
            alert("Woops! Couldn't write Opportunity to DB, please try again!")
        }

        setModalContent(null)
    }

    const delOpportunity = (id) => {

        const result = deleteOpportunity(id)

        if (result) {
            let newOpportunities = [...opportunities]
            let index = newOpportunities.findIndex(opp => opp._id === id)
            newOpportunities.splice(index, 1)
            setOpportunities(newOpportunities)
        } else {
            alert("Woops! Couldn't delete Opportunity, please try again!")
        }
    }

    const cancel = () => {
        setModalContent(null)
    }

    return (
        <div className="hostdash-container">
            <nav className="hostdash-nav">
                <p>RefuTalent</p>
                <div>
                    <button onClick={createNewOpportunity}>Create New Opportunity</button>
                    <button onClick={() => postLogout()}>Logout</button>
                </div>
            </nav>
            <div className="hostdash">
                {modalContent}
                {opportunities.map(opp => {
                    return (
                        <Opportunity
                            key={opp._id}
                            _id={opp._id}
                            title={opp.title}
                            status={opp.status}
                            location={opp.city + ", " + opp.province}
                            workType={opp.workType}
                            hours={opp.numWorkHours}
                            additionalInfo={opp.additionalInfo}
                            edit={editOpportunity}
                            delete={delOpportunity}
                        ></Opportunity>
                    )
                })}
            </div>
        </div>
    )
}

export default HostDash