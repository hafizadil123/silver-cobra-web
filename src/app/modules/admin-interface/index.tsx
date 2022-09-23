import React from 'react';
import './styles.css'

const adminInterfaceEnums = {
    adminInterfacePartial: `AdminInterfacePartial`,
    adminInterfaceFull: `AdminInterfaceFull`
}

export const AdminInterface = (props: any) => {
    const { lockType = adminInterfaceEnums.adminInterfacePartial } = props;

    return (
        <>
            <div className='container' >
                <p className='simple-text'>{`משתמש/ת יקר/ה,`}</p>
                <p className='spacing-text'>{`חובה למלא טופס בקשת הצטרפות לשירות הלאומי/התנדבות קהילתית. באתר הרשות`}</p>
                <a className='spacing-text' href='https://forms.gov.il/globaldata/getsequence/gethtmlform.aspx?formType=volunteer@pmo.gov.il&Amuta=51'>{`לינק לטופס באתר הרשות`}</a>
                <p className='spacing-text'>{`חובה למלא את הטופס כדי שתוכל/י להתחיל שירות לאומי, אי מילוי הטופס יביא לנעילת הגישה באתר.`}</p>
                <p className='simple-text'>{`לשאלות בנושא יש לפנות למוקד בת עמי *2696`}</p>
                <p className='simple-text'>{`(בין השעות 16:00 - 21:00 | sleumi@bat-ami.org.il)`}</p>
                {lockType === adminInterfaceEnums.adminInterfacePartial && <button
                    className='button-styling'
                    onClick={() => {

                    }}>{`סגור`}</button>}
            </div>
        </>
    )
}