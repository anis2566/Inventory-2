import { db } from '@/lib/db'
import React from 'react'

const Dashobard = async () => {
    const user = await db.employee.findMany({
        include: {
            user: true
        }
    })

    console.log(user)
    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashobard
