
export const colors = {
    red: '#ff0000',
    green: '#00FF00',
    plain: '#000000'
}

export const parentKeys = {
    settingsData: `settingsData`,
    vacationData: `vacationData`,
    sickDaysData: `sickDaysData`,
    timeData: `timeData`,
    supplementData: `supplementData`,
    summaryData: `summaryData`
}

export const fieldTypes = {
    editText: 'editText',
    checkbox: 'checkbox',
    text: 'text'
}

export const listData = [
    // === Settings Data === //
    {
        keyYearOne: 'volunteerStatus',
        keyYearTwo: 'volunteerStatus',
        parentKey: parentKeys.settingsData,
        label: 'סטטוס מתנדב',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'startSettingDate1',
        keyYearTwo: 'startSettingDate2',
        parentKey: parentKeys.settingsData,
        label: 'תאריך תחילת שירות',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'settingDays1',
        keyYearTwo: 'settingDays2',
        parentKey: parentKeys.settingsData,
        label: 'ימי שיבוץ',
        color: colors.plain,
        isEditable: false,
        listNo: 3,
        type: 4,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'settingInOtherNPO1',
        keyYearTwo: 'settingInOtherNPO2',
        parentKey: parentKeys.settingsData,
        label: 'שיבוץ בעמותה אחרת',
        color: colors.plain,
        isEditable: false,
        listNo: 3,
        type: 5,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'settedDays1',
        keyYearTwo: 'settedDays2',
        parentKey: parentKeys.settingsData,
        label: 'סה”כ ימי שיבוץ',
        color: colors.plain,
        isEditable: false,
        listNo: 3,
        type: 6,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'missingDays1',
        keyYearTwo: 'missingDays2',
        parentKey: parentKeys.settingsData,
        label: 'מחסור בימי שיבוץ',
        color: colors.plain,
        isEditable: false,
        listNo: 3,
        type: 4,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'continuityHoleDays1',
        keyYearTwo: 'continuityHoleDays2',
        parentKey: parentKeys.settingsData,
        label: 'בעיית רציפות',
        color: colors.plain,
        isEditable: false,
        listNo: 3,
        type: 8,
        yearOneValue: null,
        yearTwoValue: null
    },

    // === Vacation Data === //
    {
        keyYearOne: 'allowedVacDays1',
        keyYearTwo: 'allowedVacDays2',
        parentKey: parentKeys.vacationData,
        label: 'ימי חופשה ע”פ חוזה',
        color: colors.green,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'onVolVacationDays1',
        keyYearTwo: 'onVolVacationDays2',
        parentKey: parentKeys.vacationData,
        label: 'ימי חופשה מנוצלים ע”ח הבת',
        color: colors.red,
        isEditable: false,
        listNo: 5,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'missingDaysForCorona1',
        keyYearTwo: 'missingDaysForCorona2',
        parentKey: parentKeys.vacationData,
        label: 'ניצול ימי חופש עקב קורונה',
        color: colors.red,
        isEditable: false,
        listNo: 9,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'onSysVacationDays1',
        keyYearTwo: 'onSysVacationDays2',
        parentKey: parentKeys.vacationData,
        label: 'ימי חופשה ע”ח מערכת',
        color: colors.plain,
        isEditable: false,
        listNo: 1,
        type: 4,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'extraVacationDays1',
        keyYearTwo: 'extraVacationDays2',
        parentKey: parentKeys.vacationData,
        label: 'ימי חופשה ע”ח ימי הכשרות',
        color: colors.green,
        isEditable: false,
        listNo: 4,
        type: 3,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'additionalDays1',
        keyYearTwo: 'additionalDays2',
        parentKey: parentKeys.vacationData,
        label: 'ימי נוספים',
        color: colors.green,
        isEditable: false,
        listNo: 4,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'leftVacationDays1',
        keyYearTwo: 'leftVacationDays2',
        parentKey: parentKeys.vacationData,
        label: 'סה”כ חופשות שנותרו לניצול',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
   
    // === Sick Days Data === //
    {
        keyYearOne: 'allowedSickDays1',
        keyYearTwo: 'allowedSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה ע”פ חוזה',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },

    {
        keyYearOne: 'allSickDays1',
        keyYearTwo: 'allSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה כללי',
        color: colors.plain,
        isEditable: false,
        listNo: 2,
        type: 5,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'notAppSickDays1',
        keyYearTwo: 'notAppSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה לא מאושרים',
        color: colors.red,
        isEditable: false,
        listNo: 2,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'appSickDays1',
        keyYearTwo: 'appSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה מאושרים',
        color: colors.plain,
        isEditable: false,
        listNo: 1,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'appQuarantineSickDays1',
        keyYearTwo: 'appQuarantineSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה מאושרים בידוד',
        color: colors.plain,
        isEditable: false,
        listNo: 2,
        type: 4,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'aboveSickDays1',
        keyYearTwo: 'aboveSickDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימי מחלה מעבר למכסה',
        color: colors.red,
        isEditable: false,
        listNo: 1,
        type: 2,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'medicalDays1',
        keyYearTwo: 'medicalDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ועדה רפואית',
        color: colors.plain,
        isEditable: false,
        listNo: 6,
        type: 1,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'leftMedicalDays1',
        keyYearTwo: 'leftMedicalDays2',
        parentKey: parentKeys.sickDaysData,
        label: 'ימים מאושרים מועדה',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },

    // === Time Data === //
    {
        keyYearOne: 'hoursMissing1',
        keyYearTwo: 'hoursMissing2',
        parentKey: parentKeys.timeData,
        label: 'מחסור בשעות',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'systemExtraDaysForHours1',
        keyYearTwo: 'systemExtraDaysForHours2',
        parentKey: parentKeys.timeData,
        label: 'חוסר ימים ע”ח שעות',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },

    // === Supplementary Data === //
    {
        keyYearOne: 'completionPotentialDays1',
        keyYearTwo: 'completionPotentialDays2',
        parentKey: parentKeys.supplementData,
        label: 'ימי השלמה פוטנציאלים',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'completionNotAppSickDays1',
        keyYearTwo: 'completionNotAppSickDays2',
        parentKey: parentKeys.supplementData,
        label: 'ימי מחלה בהשלמה לא מאושרים',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'completionTotalDays1',
        keyYearTwo: 'completionTotalDays2',
        parentKey: parentKeys.supplementData,
        label: 'ימי עבודה בהשלמה',
        color: colors.green,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },

    // === Summary Data === //
    {
        keyYearOne: 'totalAddionalDays1',
        keyYearTwo: 'totalAddionalDays2',
        parentKey: parentKeys.summaryData,
        label: 'סה”כ זכות',
        color: colors.green,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'totalBrutoDebt1',
        keyYearTwo: 'totalBrutoDebt2',
        parentKey: parentKeys.summaryData,
        label: 'סה”כ חובות',
        color: colors.red,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'total2DoDays1',
        keyYearTwo: 'total2DoDays2',
        parentKey: parentKeys.summaryData,
        label: 'סה”כ נותר',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'totalDaysLeft',
        keyYearTwo: 'totalDaysLeft',
        parentKey: parentKeys.summaryData,
        label: 'סיכום שירות',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
    {
        keyYearOne: 'missingReports1',
        keyYearTwo: 'missingReports2',
        parentKey: parentKeys.summaryData,
        label: 'מחסור בטפסים',
        color: colors.plain,
        isEditable: false,
        listNo: 0,
        type: 0,
        yearOneValue: null,
        yearTwoValue: null
    },
]

export const listOneFields = [
    {
        key: 'date',
        name: 'תאריך',
        type: fieldTypes.text
    },
    {
        key: 'day',
        name: 'יום',
        type: fieldTypes.text
    },
    {
        key: 'type',
        name: 'סוג',
        type: fieldTypes.text
    },
    {
        key: 'isHalfDay',
        name: 'האם חצי יום?',
        type: fieldTypes.checkbox
    },
    {
        key: 'approved',
        name: 'מאושר?',
        type: fieldTypes.checkbox
    },
    {
        key: 'note',
        name: 'הערות',
        type: fieldTypes.text
    }
]

export const listTwoFields = [
    {
        key: 'date',
        name: 'תאריך',
        type: fieldTypes.text
    },
    {
        key: 'day',
        name: 'יום',
        type: fieldTypes.text
    },
    {
        key: 'type',
        name: 'סוג',
        type: fieldTypes.text
    },
    {
        key: 'isHalfDay',
        name: 'האם חצי יום?',
        type: fieldTypes.checkbox
    },
    {
        key: 'approved',
        name: 'מאושר?',
        type: fieldTypes.checkbox
    },
    {
        key: 'isQuarantine',
        name: 'האם בידוד?',
        type: fieldTypes.checkbox
    },
    {
        key: 'note',
        name: 'הערות',
        type: fieldTypes.text
    }
]

export const listThreeFields = [
    {
        key: 'fromDate',
        name: 'מתאריך',
        type: fieldTypes.text
    },
    {
        key: 'tillDate',
        name: 'עד תאריך',
        type: fieldTypes.text
    },
    {
        key: 'dayNumber',
        name: 'מספר ימים',
        type: fieldTypes.text
    },
    {
        key: 'status',
        name: 'סטטוס',
        type: fieldTypes.text
    }
]

export const listFourFields = [
    {
        key: 'fromDate',
        name: 'מתאריך',
        type: fieldTypes.text
    },
    {
        key: 'tillDate',
        name: 'עד תאריך',
        type: fieldTypes.text
    },
    {
        key: 'dayNumber',
        name: 'מספר ימים',
        type: fieldTypes.text
    },
    {
        key: 'extraType',
        name: 'סוג',
        type: fieldTypes.text
    },
    {
        key: 'description',
        name: 'תיאור',
        type: fieldTypes.text
    },
    {
        key: 'notes',
        name: 'הערות',
        type: fieldTypes.text
    }
]

export const listFiveTypeOneFields = [
    {
        key: 'name',
        name: 'סוג',
        type: fieldTypes.text
    },
    {
        key: 'days',
        name: 'ימים',
        type: fieldTypes.text
    },
    {
        key: 'approvedDays',
        name: 'מאושרים',
        type: fieldTypes.text
    },
    {
        key: 'onSystemDays',
        name: 'ע”ח מערכת',
        type: fieldTypes.text
    },
    {
        key: 'onVolunteerDays',
        name: 'ע”ח מתנדב',
        type: fieldTypes.text
    }
]

export const listFiveTypeNintyNineFields = [
    {
        key: 'day',
        name: 'תאריך',
        type: fieldTypes.text
    },
    {
        key: 'dayInWeek',
        name: 'יום',
        type: fieldTypes.text
    },
    {
        key: 'absenceType',
        name: 'סוג',
        type: fieldTypes.text
    },
    {
        key: 'dayType',
        name: 'סוג יום',
        type: fieldTypes.text
    },
    {
        key: 'isHalfDay',
        name: 'האם חצי יום?',
        type: fieldTypes.checkbox
    },
    {
        key: 'approved',
        name: 'מאושר?',
        type: fieldTypes.checkbox
    },
    {
        key: 'notes',
        name: 'הערות',
        type: fieldTypes.text
    },
]

export const listSixFields = [
    {
        key: 'code',
        name: 'קוד',
        type: fieldTypes.text
    },
    {
        key: 'fromDate',
        name: 'מתאריך',
        type: fieldTypes.text
    },
    {
        key: 'tillDate',
        name: 'עד תאריך',
        type: fieldTypes.text
    },
    {
        key: 'dayNumber',
        name: 'מספר ימים',
        type: fieldTypes.text
    },
    {
        key: 'commSubmitDate',
        name: 'תאריך הגשה',
        type: fieldTypes.text
    },
    {
        key: 'commApprovalDate',
        name: 'תאריך קבלת אישור',
        type: fieldTypes.text
    },
    {
        key: 'notes',
        name: 'הערות',
        type: fieldTypes.text
    },
    {
        key: 'created',
        name: 'הוסף ב-',
        type: fieldTypes.text
    },
    {
        key: 'updated',
        name: 'עודכן לאחרונה ב-',
        type: fieldTypes.text
    }
]

export const listNineFields = [
    {
        key: 'fromDate',
        name: 'מתאריך',
        type: fieldTypes.text
    },
    {
        key: 'tillDate',
        name: 'עד תאריך',
        type: fieldTypes.text
    },
    {
        key: 'absenceDayNumber',
        name: 'כמות ימים בטפסים',
        type: fieldTypes.text
    },
    {
        key: 'vacationDayNumber',
        name: 'ניכוי ימי חופשה שנתית',
        type: fieldTypes.text
    },
    {
        key: 'notes',
        name: 'הערות',
        type: fieldTypes.text
    }
]