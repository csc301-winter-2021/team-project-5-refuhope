import React from 'react'
import { useState, useEffect } from 'react'

import Refugee from '../Refugee/Refugee'
import Form from "../Form/Form"
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

    const request = new Request(
        '/api/refugeeAdd',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newRefugee)
        }
    )
    const response = await fetch(request)
    return response.ok
}

const RefugeeDash = () => {

    /* Setup */

    const [refugees, setRefugees] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)

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
                            additionalInfo={ref.additionalInfo}
                        ></Refugee>
                    )
                })
                setRefugees(refugeeComponents)
            }
        })()
    }, [])

    /* Helpers and callbacks. */

    const save = (newRefugee) => {

        // Try to write Refugee to DB.
        const successful = postRefugee(newRefugee)

        // Refugee successfully stored in DB; create UI element.
        if (successful) {
            let newRefugeeComp = <Refugee {...newRefugee}></Refugee>
            setRefugees([...refugees, newRefugeeComp])
        } else {
            alert("Woops! Couldn't write Refugee to DB, please try again!")
        }
        setBeingEdited(false)
    }

    const cancel = () => {
        setBeingEdited(false)
    }

    const renderModal = () => {

        if (beingEdited) {
            return (
                <div className="hostdash-modal-back">
                    <Form formType="REFUGEE" save={save} cancel={cancel} />
                </div>
            )
        }
    }

    return (
        <div className="refugeedash-container">
            <nav className="refugeedash-nav">
                <p>RefuTalent</p>
                <button onClick={() => setBeingEdited(true)}>Create New Refugee</button>
            </nav>
            <div className="refugeedash">
                {renderModal()}
                {refugees}
            </div>
        </div>
    )
}

export default RefugeeDash
