/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'

import './user.css'
type Props = {
  className: string
  users: any[]
  userRoles: any[]
  getSelectedUser: (id: any) => any
  saveUserDetails: (detalis: any) => any
  css: string
  resetUserPassword: (id: any) => any
  getUsers: () => any
  resetPasswordMessage: string
}

const ReportTable: React.FC<Props> = ({
  users,
  className,
  getSelectedUser,
  saveUserDetails,
  userRoles,
  resetUserPassword,
  resetPasswordMessage,
  css,
  getUsers,
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
  console.log({
    stickyCss,
    y,
    px: window.screenY,
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
                <TableHeadView className='' text={'שם '} />
                <TableHeadView className='' text={'דוא"ל'} />
                <TableHeadView className='' text={'מספר נייד'} />
                <TableHeadView className='' text={'תפקיד'} />
                <TableHeadView className='' text={'שם משתמש'} />
                <TableHeadView className='' text={'האם פעיל'} />
                <TableHeadView className='' text={'פעולות'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {users.map((item: any, index: any) => {
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
                      resetUserPassword={resetUserPassword}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      userRoles={userRoles}
                      text={item.email}
                      getSelectedUser={getSelectedUser}
                      userId={item.userId}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      resetUserPassword={resetUserPassword}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      userRoles={userRoles}
                      text={item.mobile}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={false}
                      resetUserPassword={resetUserPassword}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.UserRoleName}
                      userRoles={userRoles}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      resetUserPassword={resetUserPassword}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.userName}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      userRoles={userRoles}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      resetUserPassword={resetUserPassword}
                    />
                    <td>{item.isActive === true ? `✅` : `❌`}</td>
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={`edit`}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userRoles={userRoles}
                      userId={item.userId}
                      isEdit={true}
                      getUsers={getUsers}
                      resetUserPassword={resetUserPassword}
                      resetPasswordMessage={resetPasswordMessage}
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

export {ReportTable}
const TableDataView = (props: any) => {
  const {addToast} = useToasts()

  const {
    isEdit,
    text,
    className,
    getSelectedUser,
    userId,
    userRoles,
    resetUserPassword,
    resetPasswordMessage,
    getUsers,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeUser, setActiveUesr] = useState({
    name: '',
    email: '',
    UserRoleName: '',
    mobile: '',
    userName: '',
    userId: '',
    isActive: true,
  })
  const baseUrl = process.env.REACT_APP_API_URL
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')

  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const saveUserDetailsEndPoint = `${baseUrl}/api/account/SaveUserDetails`
  const [showModal, setShowModal] = useState(false)
  const handleUpdateUser = () => {
    saveUserDetails(activeUser)
  }
  const saveUserDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      addToast(`User ${type} successfully`, {appearance: 'success', autoDismiss: true})
    }
    getUsers()
  }

  const handleResetPassword = (e: any) => {
    e.preventDefault()
    resetUserPassword(userId)
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
              onClick={(e) => {
                let user = getSelectedUser(userId)

                setActiveUesr({
                  name: user.name,
                  email: user.email,
                  UserRoleName: user.userRoleId,
                  mobile: user.mobile,
                  userName: user.userName,
                  userId: user.userId,
                  isActive: user.isActive,
                })
                setShowModal(true)
              }}
              className='fa fa-edit'
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
                  {errors &&
                    errors.length > 0 &&
                    errors.map((item: any) => (
                      <>
                        <span style={{color: 'red'}}>{item}</span>
                        <br />
                      </>
                    ))}
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
                          email: e.target.value,
                        })
                      }}
                      value={activeUser.email}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <select
                      value={activeUser.UserRoleName}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          UserRoleName: e.target.value,
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
                      value={activeUser.mobile}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          mobile: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <label>שם משתמש</label>
                    <input
                      type='text'
                      value={activeUser.userName}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          userName: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>

                  <div className='form-group mt-3 mb-3'>
                    <label>פעיל האם</label>
                    <span style={{marginRight: '22px'}}>
                      <label
                        onClick={(e) => {
                          setActiveUesr({
                            ...activeUser,
                            isActive: true,
                          })
                        }}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: activeUser.isActive === true ? 'black' : '',
                        }}
                      >
                        ✅
                      </label>
                      <label
                        onClick={(e) => {
                          setActiveUesr({
                            ...activeUser,
                            isActive: false,
                          })
                        }}
                        style={{
                          cursor: 'pointer',
                          marginRight: '20px',
                          backgroundColor: activeUser.isActive === false ? 'black' : '',
                        }}
                      >
                        ❌
                      </label>
                    </span>
                  </div>
                  <div className='form-group m-5'>
                    <button type='button' className='btn btn-warning' onClick={handleResetPassword}>
                      איפוס סיסמא
                    </button>
                    {resetPasswordMessage.length > 0 ? (
                      <span className='alert alert-success' style={{marginRight: '30px'}}>
                        {resetPasswordMessage}
                      </span>
                    ) : null}
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
