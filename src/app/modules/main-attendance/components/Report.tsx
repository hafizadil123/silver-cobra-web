/* eslint-disable jsx-a11y/anchor-is-valid */
import React ,{useState} from 'react'
import {KTSVG} from '../../../../_metronic/helpers'
import { colors, listData, parentKeys, fieldTypes, listOneFields, listTwoFields, listThreeFields, listFourFields, listFiveTypeOneFields, listFiveTypeNintyNineFields } from './../data'
type Props = {
  className: string,
  reportData: any[]
}

const ReportTable: React.FC<Props> = ({className,reportData}) => {
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
              <TableHeadView className="min-w-150px" text="טופס לחודש" />
              <TableHeadView className="min-w-150px" text="אישור רכזת" />
              <TableHeadView className="min-w-150px" text="אישור מנהל" />
                <TableHeadView className="min-w-150px" text="הערות" />
                {/* <TableHeadView className="min-w-150px" text="Notes" /> */}
                
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
            {reportData.map((item, index) => {
                                const { reportMonth, notes, managerApproval, coordinatorApproval } = item;
                                return <tr  key={index}>
                                    <TableDataView flexValue={1} text={reportMonth} type={fieldTypes.text} />
                                    <TableDataView flexValue={1} text={coordinatorApproval} type={fieldTypes.checkbox} />
                                    <TableDataView flexValue={1} text={managerApproval} type={fieldTypes.checkbox} />
                                    <TableDataView flexValue={3} text={notes} type={fieldTypes.editText} />
                                </tr>
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
  const { flexValue, text, type,className } = props;
  const [note, setNote] = useState(text);

  const renderFields = () => {
      switch (type) {
          case fieldTypes.editText:
              return (<td className={`${className}`}>
                  <input
                      style={{minHeight: '30px', textAlign: 'right' }}
                      className='form-control'
                      value={note}
                      disabled={true}
                      onChange={setNote}
                  />
              </td>)
          case fieldTypes.checkbox:
              return (<td className={`${className} text-center`}>
                  <input
                      type='checkbox'
                      className='form-control-sm align-center'
                      checked={text}
                      disabled
                  />
              </td>)
          case fieldTypes.text:
              return (<td className={`${className}`}>
                  {text}
              </td>)
      }
  }

  return (
      <>
          {
              renderFields()
          }
      </>


  )
}
const TableHeadView = (props: any) => {
  const {  text,className } = props;
  return (
      <th className={`${className}`}>{text}</th>
  )
}