import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import {ReportTable} from './components'
import { colors, listData, parentKeys, fieldTypes, listOneFields, listTwoFields, listThreeFields, listFourFields, listFiveTypeOneFields, listFiveTypeNintyNineFields } from './data'

const SectionDataView = (props: any) => {
    const { data, hasSecondYear, sectionTitle, parentKey, onFieldClicked } = props;
    return (
        

        <div style={{ flex: 1, margin: '5px' }}>
            <ListHeaderSection headerTitle={`${sectionTitle || ''}`} hasSecondYear={hasSecondYear} />
            {data && data.map((item: any, index: any) => {
                const { yearOneValue, yearTwoValue } = item;
                if (item.parentKey === parentKey) {
                    if ((hasSecondYear && yearOneValue != null) || (yearOneValue != null && yearTwoValue != null)) {
                        console.log('ITem : ',item)
                        return <AttendaneDetailItem
                            key={index}
                            item={item}
                            hasSecondYear={hasSecondYear}
                            onFieldClicked={onFieldClicked} />
                    }
                }
            })
            }
        </div>
       
    )
}

const ListHeaderSection = (props: any) => {
    const { headerTitle, hasSecondYear } = props;
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' , color:"#A1A5B7"}}>
                {hasSecondYear && <p style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{"שנה א"}</p>}
                <p style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{`שנה ב`}</p>
                <p style={{ textAlign: 'center', flex: 3, fontWeight: 'bold' }}>{headerTitle}</p>
            </div>
        </>
    )
}

const AttendaneDetailItem = (props: any) => {
    const { item, hasSecondYear, onFieldClicked } = props
    const { yearTwoValue, yearOneValue, listNo, type, color, label,keyYearOne } = item;
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                {hasSecondYear && <div style={{ flex: 1 }} >
                    <p
                        style={{ padding: '0px 5px', margin: '0px 3px', background: '#ffffff', height: '20px', border: '1px solid #E4E6EF', textAlign: 'center', cursor: `${![listNo, type].includes(0) ? 'pointer' : 'default'}` }}>{`${yearTwoValue != null ? yearTwoValue : ''}`}</p>
                </div>
                }
                <div style={{ flex: 1 }}>
                    <p
                        style={{ padding: '0px 5px', margin: '0px 3px', background: '#ffffff', height: '20px', border: '1px solid #E4E6EF', textAlign: 'center', cursor: `${![listNo, type].includes(0) ? 'pointer' : 'default'}` }}>{`${yearOneValue != null ? yearOneValue : ''}`}</p>
                </div>
                <p
                    style={{ marginLeft: '5px', color: color, flex: 3, textAlign: 'right', fontSize: '15px' }}
                    onClick={() => {
                        console.log('Clicked')
                        onFieldClicked(listNo, type, hasSecondYear ? 2 : 1)
                    }}
                >{`${label}`}</p>
            </div>
        </>
    )
}

const TableDataView = (props: any) => {
    const { flexValue, text, type } = props;
    const [note, setNote] = useState(text);

    const renderFields = () => {
        switch (type) {
            case fieldTypes.editText:
                return (<td style={{ display: 'flex', flex: flexValue || 1, border: '1px solid black', padding: '10px 5px' }}>
                    <input
                        style={{ width: '100%', minHeight: '30px', textAlign: 'right' }}
                        value={note}
                        onChange={setNote}
                    />
                </td>)
            case fieldTypes.checkbox:
                return (<td style={{ display: 'flex', flex: flexValue || 1, border: '1px solid black', padding: '10px 5px', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                        type='checkbox'
                        checked={text}
                        disabled
                    />
                </td>)
            case fieldTypes.text:
                return (<td style={{ display: 'flex', flex: flexValue || 1, border: '1px solid black', padding: '10px 5px', justifyContent: 'center', alignItems: 'center' }}>
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
    const { flexValue, text } = props;
    return (
        <th style={{ display: 'flex', flex: flexValue || 1, border: '1px solid black', padding: '10px 5px', justifyContent: 'center', alignItems: 'center' }}>{text}</th>
    )
}

const MainAttendance = () => {
    const [data, setData] = useState(listData);
    const [reportData, setReportData] = useState([]);
    const [hasSecondYear, setHasSecondYear] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alertList, setAlertList] = useState([])
    const [selectedList, setSelectedList] = useState(0);
    const [selectedType, setSelectedType] = useState(0);

    const logged_user_detail: any = localStorage.getItem('logged_user_detail');
    const loggedInUserDetails = JSON.parse(logged_user_detail);

    const baseUrl = process.env.REACT_APP_API_URL;
    const getAttendanceSummaryEndpoint = `${baseUrl}/api/Inner/GetAttendanceSummary`;
    const getAttendanceShowListEndpoint = `${baseUrl}/api/Inner/AttendanceShowList`;
    const getReportListEndpoint = `${baseUrl}/api/Inner/GetReportList`;
    const authHeader = {
        headers: {
            Authorization: `bearer ${loggedInUserDetails.access_token}`
        }
    }

    useEffect(() => {
        getAttendanceSummary()
        renderReportList();
    }, [])

    const getAttendanceSummary = async () => {
        const response = await axios.post(getAttendanceSummaryEndpoint, {},
            authHeader)
        if (response && response.data.result) {
            const { data } = response;
            const { result, message, isHasSecondYear } = data;
            setHasSecondYear(isHasSecondYear);
            renderDataWithFields(data);
        }
    }

    const getAttendanceShowList = async (list: any, type: any, year: any) => {
        setSelectedList(list);
        setSelectedType(type);
        setShowModal(true);
        const response = await axios.post(getAttendanceShowListEndpoint, {
            list,
            type,
            year,
            sortBy: 'code',
            sortOrder: 'asc',
            page: 1,
            rows: 15
        }, authHeader)
        if (response && response.data.result) {
            const { data } = response;
            const { result, message, rows } = data;
            console.log('Data : ',data);
            if (result) {
                setAlertList(rows);
            }
        }
    }

    const renderReportList = async () => {
        const response = await axios.post(getReportListEndpoint, {},
            authHeader)

        if (response && response.data.result) {
            setReportData(response.data.rows);
        }
    }

    const renderDataWithFields = (data: any) => {
        Object.keys(data).forEach((item) => {
            if (!['result', 'message'].includes(item)) {
                listData.forEach((temp, index) => {
                    if (temp.keyYearOne === item) {
                        //console.log('YearOne : ',temp.keyYearOne, data[`${item}`]);
                        listData[index].yearOneValue = data[`${item}`]
                    }
                    if (temp.keyYearTwo === item) {
                        //console.log('YearTwo : ',temp.keyYearTwo, data[`${item}`]);
                        listData[index].yearTwoValue = data[`${item}`]
                    }
                })
            }
        })
        setData(listData);
    }

    const renderDynamicTable = () => {
        console.log('Selected List : ',selectedList);
        console.log('Selected Type : ',selectedType);
        console.log('hihihihihihihihhih',selectedList,selectedType,alertList)
        console.log('AlertList : ',alertList);
        if (selectedList === 1) {
            // === If list one is selected then this section will render === //
            return <div>


                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={() => { }}
                    pageRangeDisplayed={5}
                    pageCount={1}
                    previousLabel="< previous"
                />
                <table style={{ width: '100%' }} >
                    <thead>
                        <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5', justifyContent: 'center' }}>
                            {
                                listOneFields.map((item, index) => {
                                    return <p key={index} style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                alertList.map((item, index) => {
                                    return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listOneFields[index].key}`]}</p>
                                })
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        } else if (selectedList === 2) {
            // === If list two is selected then this section will render === //
            return <table style={{ width: '100%' }} >
                <thead>
                    <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                        {
                            listTwoFields.map((item) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            alertList.map((item, index) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listTwoFields[index].key}`]}</p>
                            })
                        }
                    </tr>
                </tbody>
            </table>
        } else if (selectedList === 3) {
            // === If list three is selected then this section will render === //
            console.log('List 3 : ', listThreeFields)
            return <table style={{ width: '100%' }} >
                <thead>
                    <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                        {
                            listThreeFields.map((item) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            alertList.map((item, index) => {
                                console.log('ITem : ',item);
                                console.log('EE : ',item[`${listThreeFields[index].key}`]);
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listThreeFields[index].key}`]}</p>
                            })
                        }
                    </tr>
                </tbody>
            </table>
        } else if (selectedList === 4) {
            // === If list three is selected then this section will render === //
            return <table style={{ width: '100%' }} >
                <thead>
                    <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                        {
                            listFourFields.map((item) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            alertList.map((item, index) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listThreeFields[index].key}`]}</p>
                            })
                        }
                    </tr>
                </tbody>
            </table>
        } else if (selectedList === 4 && selectedType === 1) {
            // === If list three is selected then this section will render === //
            return <table style={{ width: '100%' }} >
                <thead>
                    <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                        {
                            listFiveTypeOneFields.map((item) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            alertList.map((item, index) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listThreeFields[index].key}`]}</p>
                            })
                        }
                    </tr>
                </tbody>
            </table>
        } else if (selectedList === 4 && selectedType === 9) {
            // === If list three is selected then this section will render === //
            return <table style={{ width: '100%' }} >
                <thead>
                    <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                        {
                            listFiveTypeNintyNineFields.map((item) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            alertList.map((item, index) => {
                                return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item[`${listThreeFields[index].key}`]}</p>
                            })
                        }
                    </tr>
                </tbody>
            </table>
        }

        else if (selectedList ===5) {
            // alert('yes i am in')
            // === If list three is selected then this section will render === //
            return <table style={{ width: '100%',textAlign:'center' }} >
                <thead>
                    <tr style={{  background: '#28b6e5',height:'50px',lineHeight:'50px' }}>
                        {
                            listFiveTypeOneFields.map((item) => {
                                console.log({item})
                                return (
                                    // < p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }}>{item.key}</p>
                                    <th>{item.key}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    
                        {
                            alertList.map((item:any,index)=>{
                                return (

                                    <tr style={{height:'50px',lineHeight:'50px'}} key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.days}</td>
                                    <td>{item.approvedDays}</td>
                                    <td>{item.approvedDays}</td>
                                    <td>{item.onVolunteerDays}</td>
                                    
                                    
                                </tr>
                                )
                            })
                            
                        }
                </tbody>
            </table>
        }
    }

    return (
        <>
            <div style={{border:'1px solid #EFF2F5',background:"#fff",padding:"10px",boxShadow: "0 0px 10px rgb(0 0 0 / 20%)"}}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",background:'#fff' }}>
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.settingsData}
                        sectionTitle={`נתוני שיבוץ`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.vacationData}
                        sectionTitle={`נתוני חופשה`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.sickDaysData}
                        sectionTitle={`נתוני ימי מחלה`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.timeData}
                        sectionTitle={`נתוני שעות`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.supplementData}
                        sectionTitle={`נתוני השלמות`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                    <SectionDataView
                        data={data}
                        parentKey={parentKeys.summaryData}
                        sectionTitle={`סיכום`}
                        onFieldClicked={getAttendanceShowList}
                        hasSecondYear={hasSecondYear}
                    />
                </div>

                <Modal
                    show={showModal}
                    onHide={() => {
                        setShowModal(false)
                    }}
                    // style={{    minWidth: "700px"}}
                    size="lg"
                    backdrop="static"
                // keyboard={false}
                >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body   >
                        <>
                        {
                            selectedList === 5 ?
                            renderDynamicTable() :
                        <table style={{ width: '100%',direction:'rtl' }} >
                            <thead>
                                <tr style={{ display: 'flex', flexDirection: 'row', width: '100%', background: '#28b6e5' }}>
                                    {
                                        listOneFields.map((item, index) => {
                                            return <p style={{ flex: 1, textAlign: 'center', color: '#ffffff', height: '100%', justifyContent: 'center' }} key={index}>{item.key}</p>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        renderDynamicTable()
                                    }
                                </tr>
                            </tbody>
                        </table>

                        }
                          
                        </>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
            <div style={{ width: '100%' }}>
                    {
                        reportData.length && <ReportTable className='mb-5 mb-xl-8' reportData={reportData} />
                    }
                    
                </div>
        </>
    )
}

export default MainAttendance;