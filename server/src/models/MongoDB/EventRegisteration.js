import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Corrected import

const RegisterPage = () => {
    const [userData] = useState({
        userName: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        role: 'participant',
        contact: '9876543210',
    });

    const qrData = JSON.stringify(userData);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Scan this QR Code to Register</h2>
            <QRCodeCanvas value={qrData} size={250} /> {/* Updated Component */}
            <p>Scan this QR Code to auto-register</p>
        </div>
    );
};

export default RegisterPage;
