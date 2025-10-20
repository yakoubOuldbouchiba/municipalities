// src/pages/Contact.tsx
import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

const Contact: React.FC = () => {
  return (
    <div style={{ maxWidth:700 }}>
      <h2>اتصل بنا</h2>
      <div className="p-fluid">
        <label>الاسم</label>
        <InputText />
        <label>البريد</label>
        <InputText />
        <label>الرسالة</label>
        <textarea className="p-inputtext p-component" rows={5} />
        <div style={{ marginTop:12 }}>
          <Button label="إرسال" />
        </div>
      </div>
    </div>
  )
}

export default Contact
