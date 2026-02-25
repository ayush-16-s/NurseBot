/* 
Add this to your FileUpload.jsx component - Enhanced Base64 Viewer
This converts files to base64 and embeds them directly in the page
*/

import React, { useState } from 'react';

const Base64DocumentViewer = ({ file, onClose }) => {
  const [base64Content, setBase64Content] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDocument = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fileId = file._id["$oid"];
      const token = localStorage.getItem('km_user_token');
      
      const response = await fetch(`${window.location.origin}/api/files/view/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }

      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      
      setBase64Content(base64);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  React.useEffect(() => {
    loadDocument();
  }, []);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '24px', marginBottom: '16px'}}>📄</div>
          <div>Loading document...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{fontSize: '24px', marginBottom: '16px', color: '#e74c3c'}}>❌</div>
          <div style={{marginBottom: '16px'}}>{error}</div>
          <button onClick={onClose} style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 9999
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '20px'
      }} onClick={onClose}>
        ×
      </div>
      
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        {file.name.toLowerCase().endsWith('.pdf') ? (
          <iframe
            src={base64Content}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            title={file.name}
          />
        ) : (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '800px',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <h3>{file.name}</h3>
            <img
              src={base64Content}
              alt={file.name}
              style={{
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Base64DocumentViewer;
