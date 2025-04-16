import React from 'react';

interface button {
  label: string;
  onClick?: () => void;
}

const button: React.FC<button> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#6C4F4B',
        color: '#F2EFEA',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '9999px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export default button;