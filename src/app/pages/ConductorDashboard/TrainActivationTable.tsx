/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
type Props = {
  className: string
  trains: any[]
  hasEdit: boolean
  isLockedPage: boolean
  drivers: any[]
  activeTab: string
  updateDriver: (data: any) => any
  updateStatus: (data: any) => any
  handleUpdateDriverAndRedirect: (data: any) => any
  //   handleStatusUpdate: (data: any) => any
}

const TrainActiviationTable: React.FC<Props> = ({
  className,
  trains,
  hasEdit,
  drivers,
  updateDriver,
  activeTab,
  updateStatus,
  handleUpdateDriverAndRedirect,
  isLockedPage,
}) => {
  return (
    <div className={`card ${className}`}>
      {/* {HandleSelectAllButton()} */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}

          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            <thead>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className='min-w-150px' text={`שם רכבת`} />
                <TableHeadView className='min-w-150px' text={`האם פעילה`} />
                <TableHeadView className='min-w-150px' text={`נהג`} />
                <TableHeadView className='min-w-150px' text={``} />
                <TableHeadView className='min-w-150px' text={`סטטוס מילוי`} />
              </tr>
            </thead>
            <tbody>
              {trains.map((item: any) => {
                const {
                  name,
                  id,
                  driver,
                  driverId,
                  Status,
                  handleStatus,
                  car1Id,
                  car2Id,
                  car2Name,
                  car1Name,
                } = item

                return (
                  <tr>
                    <td className='text-muted' style={{fontSize: '16px', fontWeight: 'bold'}}>
                      {name}
                    </td>
                    <TableDataView
                      key={id}
                      flexValue={1}
                      activeTab={activeTab}
                      driverId={driverId}
                      drivers={drivers}
                      tab={'train'}
                      isLockedPage={isLockedPage}
                      updateStatus={updateStatus}
                      Status={Status}
                      text={name}
                      id={id}
                      updateDriver={updateDriver}
                      edit={false}
                    />

                    <TableDataViewForDrivers
                      driverId={driverId}
                      drivers={drivers}
                      isLockedPage={isLockedPage}
                      status={Status}
                      id={id}
                      name={name}
                      updateDriver={updateDriver}
                    />
                    <TableDataViewForButton
                      driverId={driverId}
                      isLockedPage={isLockedPage}
                      driver={driver}
                      id={id}
                      status={Status}
                      name={name}
                      car1Id={car1Id}
                      car2Id={car2Id}
                      car2Name={car2Name}
                      car1Name={car1Name}
                      handleUpdateDriverAndRedirect={handleUpdateDriverAndRedirect}
                      updateDriver={updateDriver}
                    />
                    <td>
                      <span>{handleStatus}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export {TrainActiviationTable}
const TableDataViewForButton = (props: any) => {
  const {
    driverId,
    id,
    handleUpdateDriverAndRedirect,
    status,
    name,
    car1Id,
    car2Id,
    car2Name,
    car1Name,
    isLockedPage,
  } = props
  const createCarButtons = () => {
    return (
      <>
        {' '}
        <button
          disabled={
            driverId === null || status == 2 || status == null || isLockedPage === true
              ? true
              : false
          }
          className='btn btn-sm btn-secondary'
          style={{marginLeft: '30px'}}
          onClick={(e) => {
            handleUpdateDriverAndRedirect({
              carId: car1Id,
              name: name,
              trainId: id,
            })
          }}
        >
          {car1Name == null ? 'None' : car1Name}
        </button>
        <button
          disabled={
            driverId === null || status == 2 || status == null || isLockedPage === true
              ? true
              : false
          }
          className='btn btn-sm btn-secondary'
          style={{marginLeft: '30px'}}
          onClick={(e) => {
            handleUpdateDriverAndRedirect({
              carId: car2Id,
              name: name,
              trainId: id,
            })
          }}
        >
          {car2Name == null ? 'None' : car2Name}
        </button>
      </>
    )
  }
  return (
    <td>
      {/* <button
        className='btn btn-primary'
        disabled={driverId === null ? true : false}
        onClick={(e) => {
          if (driverId !== null) {
            handleUpdateDriverAndRedirect({
              trainId: id,
              driverId: driverId,
              name,
            })
          }
        }}
      >
        <span>{name}</span>
      </button> */}
      {createCarButtons()}
    </td>
  )
}
const TableDataViewForDrivers = (props: any) => {
  const [ActiveDriver, setDriver] = useState(1)
  const {
    // text,
    status,
    drivers,
    driverId,
    updateDriver,
    isLockedPage,
    id,
  } = props
  useEffect(() => {
    setDriver(driverId)
  }, [driverId])
  const renderDriversData = () => {
    return drivers?.map((item: any) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      )
    })
  }

  const handleUpdateDriver = (_activeDriver: any) => {
    if (_activeDriver) {
      let data = drivers.find((driver: any) => driver.id == _activeDriver)
      data.trainId = id
      updateDriver(data)
    }
  }
  const renderFields = () => {
    return (
      <>
        <td>
          <select
            disabled={status === 2 || status === null || isLockedPage === true ? true : false}
            className='form-control'
            onChange={(e: any) => {
              setDriver(e.target.value)
              handleUpdateDriver(e.target.value)
            }}
            value={ActiveDriver}
          >
            <option value=''></option>
            {renderDriversData()}
          </select>
        </td>
      </>
    )
  }
  return <>{renderFields()}</>
}
const TableDataView = (props: any) => {
  const {
    text,
    className,
    Status,
    tab,
    edit,
    drivers,
    driverId,
    updateDriver,
    id,
    activeTab,
    updateStatus,
    isLockedPage,
  } = props
  const [showModal, setShowModal] = useState(false)
  const [ActiveDriver, setDriver] = useState(1)

  const handleEditDriver = () => {
    setShowModal(true)
  }
  useEffect(() => {
    setDriver(driverId)
  }, [])
  const renderDriversData = () => {
    return drivers?.map((item: any) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      )
    })
  }
  const handleUpdateDriver = () => {
    if (ActiveDriver) {
      let data = drivers.find((driver: any) => driver.id == ActiveDriver)
      data.trainId = id
      updateDriver(data)
    }
  }
  const handleUpdateStatus = (statusToUpdate: number) => {
    if (activeTab == 'today') {
      let data = {
        status: statusToUpdate,
        id: id,
      }
      updateStatus(data)
    }
  }
  const renderFields = () => {
    return tab === 'train' ? (
      <td className={`${className} `} style={{minWidth: '150px'}}>
        <span>
          {Status !== null ? (
            // not null
            Status === 2 ? (
              <>
                <button
                  disabled={isLockedPage}
                  style={{marginLeft: '16px', background: '#3F4254'}} //: '#E4E6EF'
                  className='btn btn-secondary btn-sm'
                  onClick={(e) => handleUpdateStatus(2)}
                >
                  <i
                    className='fa fa-times'
                    style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                  ></i>
                </button>
                <button
                  disabled={isLockedPage}
                  onClick={(e) => handleUpdateStatus(1)}
                  className='btn btn-secondary btn-sm'
                >
                  <i
                    className='fa fa-check'
                    style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                    aria-hidden='true'
                  ></i>
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={isLockedPage}
                  style={{marginLeft: '16px'}} //: '#E4E6EF'
                  className='btn btn-secondary btn-sm'
                  onClick={(e) => handleUpdateStatus(2)}
                >
                  <i
                    className='fa fa-times'
                    style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                  ></i>
                </button>
                <button
                  disabled={isLockedPage}
                  onClick={(e) => handleUpdateStatus(1)}
                  style={{background: '#3F4254'}}
                  className='btn btn-secondary btn-sm'
                >
                  <i
                    className='fa fa-check'
                    style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                    aria-hidden='true'
                  ></i>
                </button>
              </>
            )
          ) : (
            //if null

            <>
              <button
                disabled={isLockedPage}
                style={{marginLeft: '16px'}} //: '#E4E6EF'
                className='btn btn-secondary btn-sm'
                onClick={(e) => handleUpdateStatus(2)}
              >
                <i
                  className='fa fa-times'
                  style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                ></i>
              </button>
              <button
                disabled={isLockedPage}
                onClick={(e) => handleUpdateStatus(1)}
                className='btn btn-secondary btn-sm'
              >
                <i
                  className='fa fa-check'
                  style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                  aria-hidden='true'
                ></i>
              </button>
            </>
          )}
        </span>
      </td>
    ) : null
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {
    text,
    className,
    index,
    drivers,
    driverName,
    driverId,
    status,
    trainId,
    reloadApi,
    handleToastMessage,
    selectedDate,
    severity,
    signedByDriver,
  } = props

  return (
    <th>
      <span>{text}</span>
    </th>
  )
}
