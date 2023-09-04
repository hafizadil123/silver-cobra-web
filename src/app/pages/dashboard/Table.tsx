/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {FormattedMessage} from 'react-intl'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

import './user.css'
const API_URL = process.env.REACT_APP_API_URL

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
  _initateUpdateOtherPassMessage: string
  _initiateOtherPass: (userId: any, newPassword: string, confirmPassword: string) => any
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
  _initiateOtherPass,
  _initateUpdateOtherPassMessage,
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
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
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
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
  const [openSecondModal, setOpenSecondModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const getUser = JSON.parse(logged_user_detail)
  const {addToast} = useToasts()
  const initialValues = {
    oldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  }

  const updatePasswordSchema = Yup.object().shape({
    NewPassword: Yup.string().required(),
    ConfirmPassword: Yup.string().required(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: updatePasswordSchema,
    onSubmit: () => {},
  })

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
    users,
    _initateUpdateOtherPassMessage,
    _initiateOtherPass,
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
  const logged_user_details: any = localStorage.getItem('logged_user_detail')

  const loggedInUserDetails = JSON.parse(logged_user_details)

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const saveUserDetailsEndPoint = `${baseUrl}/api/account/SaveUserDetails`
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
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

  const handleOtherPassChange = (e: any) => {
    e.preventDefault()
    setOpenSecondModal(true)
  }

  const renderFields = () => {
    const onSubmitV = async (e: any) => {
      e.preventDefault()
      try {
        setLoading(true)

        if (activeUser) {
          const data = {
            userName: activeUser.userName,
            newPassword: formik.values.NewPassword,
            confirmPassword: formik.values.ConfirmPassword,
          }
          const response = await axios.post(API_URL + '/api/account/AdminChangePassword', data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${getUser.access_token}`,
            },
          })
          if (response.data.result === true) {
            setHasErrors(false)
            setLoading(false)
            setStatus({
              code: 201,
              message: response.data.message,
            })
            setLoading(false)
            formik.resetForm()
            // addToast(response.data.message, {appearance: 'success', autoDismiss: true})
          } else {
            setHasErrors(true)
            // addToast(response.data.message, {appearance: 'warning', autoDismiss: true})
            setStatus({
              code: 200,
              message: response.data.message || 'passwords not updated',
            })
            setLoading(false)
            formik.resetForm()
          }
        }
      } catch (err: any) {
        setHasErrors(true)
        setLoading(false)
        setStatus({
          code: 500,
          message: JSON.stringify(err.ModelState),
        })
        addToast(JSON.stringify(err.ModelState), {appearance: 'error', autoDismiss: true})
      }
    }
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
                setOpenSecondModal(false)
                setStatus({})
              }}
              // style={{    minWidth: "700px"}}
              size='lg'
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <>
                  {!openSecondModal && (
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
                      <div
                        style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}
                      >
                        <div className='form-group m-5'>
                          <button
                            type='button'
                            className='btn btn-warning'
                            onClick={handleResetPassword}
                          >
                            איפוס סיסמא
                          </button>
                          {resetPasswordMessage.length > 0 ? (
                            <span className='alert alert-success' style={{marginRight: '30px'}}>
                              {resetPasswordMessage}
                            </span>
                          ) : null}
                        </div>
                        <div className='form-group m-5'>
                          <button
                            type='button'
                            className='btn btn-danger showmodal'
                            data-show-modal='infoModal'
                            onClick={handleOtherPassChange}
                          >
                            שנה סיסמא
                          </button>
                          {_initateUpdateOtherPassMessage.length > 0 ? (
                            <span className='alert alert-success' style={{marginRight: '30px'}}>
                              {_initateUpdateOtherPassMessage}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </form>
                  )}

                  {openSecondModal && (
                    <form
                      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
                      noValidate
                      id='kt_login_password_reset_form'
                      onSubmit={(e) => onSubmitV(e)}
                    >
                      <div className='text-center mb-10'>
                        <h1 className='text-dark mb-3'>שנה סיסמא</h1>
                        <div className='text-gray-400 fw-bold fs-4'>
                          {/* Enter your email to reset your password. */}
                        </div>
                      </div>
                      {console.log({
                        hasErrors,
                        status,
                      })}
                      {hasErrors === true && status.code === 500 && (
                        <div className='mb-lg-15 alert alert-danger'>
                          <div className='alert-text font-weight-bold'>
                            {status.message || 'something wents wrong'}
                          </div>
                        </div>
                      )}
                      {hasErrors === false && status.code === 201 && (
                        <div className='mb-lg-15 alert alert-success'>
                          <div className='alert-text font-weight-bold'>{status.message}</div>
                        </div>
                      )}
                      {hasErrors === true && status.code === 200 && (
                        <div className='mb-lg-15 alert alert-danger'>
                          <div className='alert-text font-weight-bold'>{status.message}</div>
                        </div>
                      )}

                      <div className='fv-row mb-10'>
                        <label
                          className='form-label fw-bolder text-gray-900 fs-6'
                          style={{marginTop: '5px'}}
                        >
                          סיסמא חדשה
                        </label>
                        <input
                          type='password'
                          placeholder=''
                          autoComplete='off'
                          {...formik.getFieldProps('NewPassword')}
                          className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.NewPassword && formik.errors.NewPassword},
                            {
                              'is-valid': formik.touched.NewPassword && !formik.errors.NewPassword,
                            }
                          )}
                        />
                        {formik.touched.NewPassword && formik.errors.NewPassword && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              <span role='alert'>{formik.errors.NewPassword}</span>
                            </div>
                          </div>
                        )}

                        <label
                          className='form-label fw-bolder text-gray-900 fs-6'
                          style={{marginTop: '5px'}}
                        >
                          אישור סיסמא
                        </label>
                        <input
                          type='password'
                          placeholder=''
                          autoComplete='off'
                          {...formik.getFieldProps('ConfirmPassword')}
                          className={clsx(
                            'form-control form-control-lg',
                            {
                              'is-invalid':
                                formik.touched.ConfirmPassword && formik.errors.ConfirmPassword,
                            },
                            {
                              'is-valid':
                                formik.touched.ConfirmPassword && !formik.errors.ConfirmPassword,
                            }
                          )}
                        />
                        {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              <span role='alert'>{formik.errors.ConfirmPassword}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
                        <button
                          type='submit'
                          id='kt_password_reset_submit'
                          className='btn btn-lg btn-primary fw-bolder me-4'
                        >
                          {loading ? (
                            <span className='indicator-label'>אנא המתן....</span>
                          ) : (
                            <span className='indicator-label'>
                              <FormattedMessage id='AUTH.GENERAL.SUBMIT' />
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              </Modal.Body>
              {!openSecondModal && (
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
              )}
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
