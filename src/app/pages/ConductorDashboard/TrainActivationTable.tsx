/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
type Props = {
  className: string
  trains: any[]
  hasEdit: boolean
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
}) => {
  return (
    <div className={`card ${className}`}>
      {/* {HandleSelectAllButton()} */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            <tbody>
              {trains.map((item: any) => {
                const {name, id, driver, driverId, Status} = item

                return (
                  <tr>
                    <TableDataView
                      key={id}
                      flexValue={1}
                      activeTab={activeTab}
                      driverId={driverId}
                      drivers={drivers}
                      tab={'train'}
                      updateStatus={updateStatus}
                      Status={Status}
                      text={name}
                      id={id}
                      updateDriver={updateDriver}
                      edit={false}
                    />
                    <TableDataView
                      key={id}
                      flexValue={1}
                      activeTab={activeTab}
                      updateStatus={updateStatus}
                      drivers={drivers}
                      driverId={driverId}
                      tab={'driver'}
                      Status={Status}
                      text={driver}
                      id={id}
                      edit={false}
                      updateDriver={updateDriver}
                    />
                    {hasEdit === true ? (
                      <TableDataView
                        key={id}
                        flexValue={1}
                        updateDriver={updateDriver}
                        activeTab={activeTab}
                        updateStatus={updateStatus}
                        driverId={driverId}
                        tab={'driver'}
                        drivers={drivers}
                        edit={true}
                        Status={Status}
                        text={'edit'}
                        id={id}
                      />
                    ) : null}

                    <TableDataViewForButton
                      driverId={driverId}
                      driver={driver}
                      id={id}
                      handleUpdateDriverAndRedirect={handleUpdateDriverAndRedirect}
                    />
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
  const {driverId, driver, id, handleUpdateDriverAndRedirect} = props
  return (
    <td>
      <button
        className='btn btn-primary'
        disabled={driverId === null ? true : false}
        onClick={(e) => {
          if (driverId !== null) {
            handleUpdateDriverAndRedirect({
              trainId: id,
              driverId: driverId,
            })
          }
        }}
      >
        עדכן בדיקות בשם נהג
      </button>
    </td>
  )
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
        <span> {text} </span>
        <span style={{float: 'left'}}>
          {Status !== null ? (
            // not null
            Status === 2 ? (
              <>
                <button
                  style={{marginLeft: '16px', background: '#3F4254'}} //: '#E4E6EF'
                  className='btn btn-secondary btn-sm'
                  onClick={(e) => handleUpdateStatus(2)}
                >
                  <i
                    className='fa fa-times'
                    style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                  ></i>
                </button>
                <button onClick={(e) => handleUpdateStatus(1)} className='btn btn-secondary btn-sm'>
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
                style={{marginLeft: '16px'}} //: '#E4E6EF'
                className='btn btn-secondary btn-sm'
                onClick={(e) => handleUpdateStatus(2)}
              >
                <i
                  className='fa fa-times'
                  style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                ></i>
              </button>
              <button onClick={(e) => handleUpdateStatus(1)} className='btn btn-secondary btn-sm'>
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
    ) : (
      <td className={`${className} `} style={{maxWidth: '40px'}}>
        <span>
          {edit === true ? (
            <i
              style={{cursor: 'pointer'}}
              onClick={(e) => handleEditDriver()}
              className='fa fa-edit'
            ></i>
          ) : (
            text
          )}
          {/* <button>עדכן בדיקות בשם נהג</button> */}
        </span>

        {/* Modal Start */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false)
            handleUpdateDriver()
          }}
          // style={{    minWidth: "700px"}}
          size='lg'
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <>
              <select
                className='form-control'
                onChange={(e: any) => setDriver(e.target.value)}
                value={ActiveDriver}
              >
                <option value=''></option>
                {renderDriversData()}
              </select>
            </>
          </Modal.Body>
          <Modal.Footer>
            <div
              className=''
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <button
                type='button'
                onClick={() => {
                  setShowModal(false)
                  handleUpdateDriver()
                }}
                className='btn btn-primary'
              >
                Submit
              </button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Modal End */}
      </td>
    )
  }

  return <>{renderFields()}</>
}
