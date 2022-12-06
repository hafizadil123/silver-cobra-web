/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import {useToasts} from 'react-toast-notifications'
import axios from 'axios'

import './user.css'
type Props = {
  className: string
  users: any[]
  userRoles: any[]
  getSelectedUser: (id: any) => any
  getUsersAfterUpdate: () => any
  // ActiveEditModel: () => any
  saveUserDetails: (detalis: any) => any
  css: string
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
  getUsersAfterUpdate,
}) => {
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const handleNavigation = (e: any) => {
    const window = e.currentTarget
    if (window.scrollY >= 238) {
      setStickyCss('white')
    } else if (y < window.scrollY) {
      setStickyCss('')
    }
    setY(window.scrollY)
  }

  useEffect(() => {
    setY(window.scrollY)

    window.addEventListener('scroll', (e) => handleNavigation(e))
  }, [])

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
                <TableHeadView className='' text={'שם'} />
                <TableHeadView className='' text={'עבור קרון'} />
                <TableHeadView className='' text={'עבור חיבורים'} />
                <TableHeadView className='' text={'סדר'} />
                <TableHeadView className='' text={'חומרה'} />
                <TableHeadView className='' text={'ימי הצגה בחודש'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {users &&
                users.length > 0 &&
                users.map((item: any, index: any) => {
                  return (
                    <tr>
                      <TableDataView
                        className=''
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
                        className=''
                        index={index}
                        flexValue={1}
                        userRoles={userRoles}
                        text={item.isForCar ? `✅` : `❌`}
                        getSelectedUser={getSelectedUser}
                        userId={item.userId}
                        saveUserDetails={saveUserDetails}
                        isEdit={false}
                        isDelete={false}
                        id={item.id}
                        handleDelete={handleDelete}
                      />
                      <TableDataView
                        className=''
                        index={index}
                        flexValue={1}
                        userRoles={userRoles}
                        text={item.isForTrain ? `✅` : `❌`}
                        getSelectedUser={getSelectedUser}
                        saveUserDetails={saveUserDetails}
                        userId={item.userId}
                        isEdit={false}
                        isDelete={false}
                        id={item.id}
                        handleDelete={handleDelete}
                      />
                      <TableDataView
                        className=''
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
                        className=''
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
                      {/* <TableDataView
                        className=''
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
                      /> */}
                      <td>{item.activeDays}</td>
                      <TableDataView
                        className=''
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
                        getUsersAfterUpdate={getUsersAfterUpdate}
                        // ActiveEditModel={ActiveEditModel}
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
  const {
    isEdit,
    text,
    className,
    getSelectedUser,
    userId,
    // saveUserDetails,
    userRoles,
    isDelete,
    id,
    handleDelete,
    getUsersAfterUpdate,
    // ActiveEditModel,
  } = props
  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const saveUserDetailsEndPoint = `${baseUrl}/api/Common/SaveDailyAttendanceCheckTypeDetails`
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const [activeUser, setActiveUesr] = useState({
    name: '',
    isForCar: false,
    isForTrain: false,
    order: '',
    severity: '',
    id: '',
    activeDays: '',
  })
  const [showModal, setShowModal] = useState(false)
  const handleUpdateUser = () => {
    saveUserDetails(activeUser)
  }

  const saveUserDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error', autoDismiss: true})
      })
    } else {
      setShowModal(false)
      // setLoading(true)
      addToast(`Code ${type} successfully`, {appearance: 'success', autoDismiss: true})
      getUsersAfterUpdate()
    }
  }
  const handleChangeActions = (isDelete: boolean, userId: any, id: any) => {
    let user = getSelectedUser(id)
    if (!isDelete) {
      setActiveUesr({
        name: user.name,
        isForCar: user.isForCar,
        isForTrain: user.isForTrain,
        order: user.order,
        severity: user.severity,
        id: user.id,
        activeDays: user.activeDays,
      })
      setShowModal(true)
      // ActiveEditModel()
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
              style={{float: 'right', cursor: 'pointer', marginLeft: '20px'}}
              onClick={(e) => handleChangeActions(false, userId, id)}
              className={'fa fa-edit'}
            ></i>
            <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => handleChangeActions(true, userId, id)}
              className={'fa fa-trash'}
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
                  <div className='chebox-style'>
                    <div className='form-check'>
                      <label>עבור קרון</label>
                      <input
                        type='checkbox'
                        onChange={(e) => {
                          setActiveUesr({
                            ...activeUser,
                            isForCar: e.target.checked,
                          })
                        }}
                        checked={activeUser.isForCar}
                        className='form-check-input'
                      />
                    </div>
                    <div className='form-check'>
                      <label>עבור חיבורים</label>
                      <input
                        type='checkbox'
                        checked={activeUser.isForTrain}
                        onChange={(e) => {
                          setActiveUesr({
                            ...activeUser,
                            isForTrain: e.target.checked,
                          })
                        }}
                        className='form-check-input'
                      />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label>סדר</label>
                    <input
                      type='number'
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
                    <label>חומרה</label>
                    <input
                      type='number'
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
                  <div className='form-group'>
                    <label>ימי הצגה בחודש</label>
                    <input
                      type='text'
                      pattern='^[0-9,]*$'
                      value={activeUser.activeDays}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          activeDays: e.target.value,
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
                      // setShowModal(false)
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
