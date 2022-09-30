/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
type Props = {
  className: string
  assemblyId: number
  assemblies: any[]
  assemblyName: string
  handleStatusUpdate: (data: any) => any
}

const TrainAssemblyTable: React.FC<Props> = ({
  className,
  assemblies,
  assemblyId,
  handleStatusUpdate,
  assemblyName,
  
}) => {
  
  return (
    <div className={`card ${className}`}>
      <h3 style={{marginTop: '15px', paddingRight: '30px'}}>{assemblyName}  
      
      

      </h3>
      {/* {HandleSelectAllButton()} */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {assemblies.map((item: any) => {
                const {name, id, value} = item
                return (
                  <tr>
                    <TableDataView
                      handleStatusUpdate={handleStatusUpdate}
                      value={value}
                      assemblyId={assemblyId}
                      tab='data'
                      key={id}
                      flexValue={1}
                      text={name}
                      id={id}
                    />
                    <TableDataView
                      handleStatusUpdate={handleStatusUpdate}
                      value={value}
                      assemblyId={assemblyId}
                      tab='controls'
                      key={id}
                      flexValue={1}
                      text={name}
                      id={id}
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

export {TrainAssemblyTable}
const TableDataView = (props: any) => {
  const {text, id, className, tab, value, assemblyId, handleStatusUpdate} = props
  const handleChangeTrainStatus = (selectedValue: any) => {
    let data = {
      selectedValue,
      assemblyId,
      checkId: id,
    }
    handleStatusUpdate(data)
  }
  const renderFields = () => {
    return tab === 'data' ? (
      <td className={`${className} `} style={{minWidth: '150px'}}>
        <span> {text} </span>
      </td>
    ) : (
      <td className={`${className} `} style={{minWidth: '150px'}}>
        {value === null ? (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => {
                handleChangeTrainStatus(false)
              }}
              style={{marginLeft: '16px'}}
              className='btn btn-secondary btn-sm'
            >
              <i
                className='fa fa-times'
                style={{ color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
              ></i>
            </button>
            <button
              onClick={() => {
                handleChangeTrainStatus(true)
              }}
              className='btn btn-secondary btn-sm'
            >
              <i
                className='fa fa-check'
                style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                aria-hidden='true'
              ></i>
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => {
                handleChangeTrainStatus(false)
              }}
              style={{marginLeft: '16px', background: value === false ? '#3F4254' : '#E4E6EF'}}
              className='btn btn-secondary btn-sm'
            >
              <i
                className='fa fa-times'
                style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
              ></i>
            </button>
            <button
              onClick={() => {
                handleChangeTrainStatus(true)
              }}
              style={{background: value === true ? '#3F4254' : '#E4E6EF'}}
              className='btn btn-secondary btn-sm'
            >
              <i
                className='fa fa-check'
                style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                aria-hidden='true'
              ></i>
            </button>
          </div>
        )}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {text, className} = props

  return (
    <th style={{minWidth: '150px'}} className={`${className}`}>
      <span>{text}</span>
    </th>
  )
}
