import React from 'react'
import { Link } from 'react-router-dom'
import VehicleAndDriversReport from './reportDriverAndVehicles'

const reportDashboard = () => {
  return (
    <div className='flex flex-col'>
      <div className="">
        <Link to= '/VehicleAndDriversReport' >Vehicle AndDrivers Report</Link>
        
      </div>
      <div className="div">
        <Link to= '/GarbageEntries' >GarbageEntries</Link>
        </div>

    </div>
  )
}

export default reportDashboard
