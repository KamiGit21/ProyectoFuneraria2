import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#CED2D4', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#3A4A58', margin: '10px 0' }}>
                Contact us at: <a href="mailto:example@example.com" style={{ color: '#3A4A58', textDecoration: 'none' }}>example@example.com</a>
            </p>
            <div style={{ color: '#3A4A58', margin: '10px 0' }}>
                Follow us on:
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3A4A58', margin: '0 10px', textDecoration: 'none' }}>Facebook</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3A4A58', margin: '0 10px', textDecoration: 'none' }}>Twitter</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3A4A58', margin: '0 10px', textDecoration: 'none' }}>Instagram</a>
            </div>
        </footer>
    );
};

export default Footer;