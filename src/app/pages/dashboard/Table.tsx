/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'

type Props = {
  className: string
  users: any[]
  getSelectedUser: (id: any) => any
  saveUserDetails: (detalis: any) => any
}

const ReportTable: React.FC<Props> = ({users, className, getSelectedUser, saveUserDetails}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className='min-w-150px' text={'Name'} />
                <TableHeadView className='min-w-150px' text={'Email'} />
                <TableHeadView className='min-w-150px' text={'Mobile'} />
                <TableHeadView className='min-w-150px' text={'User Role Name'} />
                <TableHeadView className='min-w-150px' text={'UserName'} />
                <TableHeadView className='min-w-150px' text={'Action'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {users.map((item: any, index: any) => {
                return (
                  <tr>
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.name}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={false}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.email}
                      getSelectedUser={getSelectedUser}
                      userId={item.userId}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.mobile}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={false}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.UserRoleName}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={item.userName}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                    />
                    <TableDataView
                      className='min-w-150px'
                      index={index}
                      flexValue={1}
                      text={`edit`}
                      getSelectedUser={getSelectedUser}
                      saveUserDetails={saveUserDetails}
                      userId={item.userId}
                      isEdit={true}
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
  const {isEdit, text, className, getSelectedUser, userId, saveUserDetails} = props
  const [activeUser, setActiveUesr] = useState({
    name: '',
    email: '',
    UserRoleName: '',
    mobile: '',
    userName: '',
  })
  const [showModal, setShowModal] = useState(false)
  const handleUpdateUser = () => {
    console.log({activeUser})
    saveUserDetails(activeUser)
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
                console.log({user})
                setActiveUesr(user)
                setShowModal(true)
              }}
              className='fa fa-edit'
            ></i>
            <Modal
              show={showModal}
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
                    <label>Name</label>
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
                    <label>Email</label>
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
                    <label>User Role Name</label>
                    <input
                      type='text'
                      value={activeUser.UserRoleName}
                      onChange={(e) => {
                        setActiveUesr({
                          ...activeUser,
                          UserRoleName: e.target.value,
                        })
                      }}
                      className='form-control'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Mobile</label>
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
                    <label>UserName</label>
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
                    Submit
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
