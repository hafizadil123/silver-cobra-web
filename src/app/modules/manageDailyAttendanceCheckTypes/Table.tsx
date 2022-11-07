/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import './user.css'
type Props = {
  className: string
  users: any[]
  userRoles: any[]
  getSelectedUser: (id: any) => any
  saveUserDetails: (detalis: any) => any
  css: string,
  handleDelete: any
}

const DailAttendaceTable: React.FC<Props> = ({
  users,
  className,
  getSelectedUser,
  saveUserDetails,
  userRoles,
  css,
  handleDelete,
}) => {
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const handleNavigation = (e: any) => {
    const window = e.currentTarget
    if (window.scrollY >= 238) {
      setStickyCss('')
    } else if (y < window.scrollY) {
      setStickyCss('')
    }
    setY(window.scrollY)
  }

  useEffect(() => {
    setY(window.scrollY)

    window.addEventListener('scroll', (e) => handleNavigation(e))
  }, [])
  console.log({
    stickyCss,
    y,
    px: window.screenY,
    users
  })
  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className={`table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3`}>
            {/* begin::Table head */}
            <thead style={{background: stickyCss, top: `${stickyCss && '65px'}`}}>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className='min-w-150px' text={'שם'} />
                <TableHeadView className='min-w-150px' text={'עבור חיבורים'} />
                <TableHeadView className='min-w-150px' text={'עבור קרון'}/>
                <TableHeadView className='min-w-150px' text={'חומרה'} />
                <TableHeadView className='min-w-150px' text={'סדר'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {users && users.length > 0 && users.map((item: any, index: any) => {
                return (
                  <tr>
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.name}
                      userRoles={userRoles}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={false}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      userRoles={userRoles}
                      text={item.isForCar ? 'True' : 'False'}
                      getSelectedUser={getSelectedUser}
                      userId={item.userId}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      userRoles={userRoles}
                      text={item.isForTrain ? 'True' : 'False'}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={false}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.order}
                      userRoles={userRoles}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.severity}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      userRoles={userRoles}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={`edit`}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userRoles={userRoles}
                      userId={item.userId}
                      isEdit={true}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={`trash`}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userRoles={userRoles}
                      userId={item.userId}
                      isEdit={true}
                      isDelete={true}
                      id={item.id}
                      handleDelete={handleDelete}
                    />
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {DailAttendaceTable}
const TableDataView = (props: any) => {
  const {isEdit, text, className, getSelectedUser, userId, saveUserDetails, userRoles, isDelete, id, handleDelete} = props
  const [activeUser, setActiveUesr] = useState({
    name: '',
    isForCar: '',
    isForTrain: '',
    order: '',
    severity: '',
  })
  const [showModal, setShowModal] = useState(false)
  const handleUpdateUser = () => {
    saveUserDetails(activeUser)
  }

  const handleChangeActions = (isDelete: boolean, userId: any, id: any) => {
    let user = getSelectedUser(userId)
    if(!isDelete) {
        setActiveUesr({
          name: user.name,
          isForCar: user.isForCar,
          isForTrain: user.isForTrain,
          order: user.order,
          severity: user.severity,
        })
        setShowModal(true)
    } else {
        handleDelete(id)
    }
  }
  const renderFields = () => {
    return (
      <td className={`${className} `}>
        {isEdit === false ? (
          <span style={{float: 'right'}}> {text}</span>
        ) : (
          <>
            {/* Modal Start */}
            <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => handleChangeActions(isDelete, userId, id) }
              className={isDelete ? `fa fa-trash`: 'fa fa-edit'}
            ></i>
            <Modal
              show={showModal}
              style={{direction: 'rtl'}}
              onHide={() => {
                setShowModal(false)
              }}
              // style={{    minWidth: "700px"}}
              size='lg'
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <form>
                  <div className='form-group'>
                    <label>שם</label>
                    <input
                      type='text'
                      value={activeUser.name}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          name: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <label>דוא"ל</label>
                    <input
                      type='text'
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          isForCar: e.target.value,
                        })
                      }}
                      value={activeUser.isForCar}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <select
                      value={activeUser.isForTrain}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          isForTrain: e.target.value,
                        })
                      }}
                      className='form-control'
                    >
                      {userRoles.map((role: any) => {
                        return <option value={role.id}>{role.name}</option>
                      })}
                    </select>
                  </div>
                  <div className='form-group'>
                    <label>מספר נייד</label>
                    <input
                      type='text'
                      value={activeUser.order}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          order: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <label>שם משתמש</label>
                    <input
                      type='text'
                      value={activeUser.severity}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          severity: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>
                </form>
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
                      handleUpdateUser()
                    }}
                    className='btn btn-primary'
                  >
                    שמירה
                  </button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Modal End */}
          </>
        )}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {text, className} = props

  return (
    <th className={`${className}`}>
      <span>{text}</span>
    </th>
  )
}
