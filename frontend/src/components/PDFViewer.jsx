/*
PDF.js Integration Component
Add this to your project for reliable PDF viewing
*/

import React, { useEffect, useRef, useState } from 'react';

const PDFViewer = ({ fileUrl, fileName, onClose }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadPDF();
  }, [fileUrl]);

  const loadPDF = async () => {
    try {
      // Load PDF.js library
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        // Load the PDF
        loadPDFDocument();
      };
      document.head.appendChild(script);
    } catch (err) {
      setError('Failed to load PDF viewer');
      setLoading(false);
    }
  };

  const loadPDFDocument = async () => {
    try {
      const loadingTask = window.pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      
      renderPage(pdf, 1);
      setLoading(false);
    } catch (err) {
      setError('Failed to load PDF document');
      setLoading(false);
    }
  };

  const renderPage = async (pdf, pageNum) => {
    try {
      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (err) {
      setError(`Failed to render page ${pageNum}`);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      // Re-render the page
      const loadingTask = window.pdfjsLib.getDocument(fileUrl);
      loadingTask.promise.then(pdf => {
        renderPage(pdf, pageNum);
      });
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

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
          <div>Loading PDF...</div>
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
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <div>
          <strong>{fileName}</strong>
          <span style={{marginLeft: '20px', color: '#666'}}>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            style={{
              backgroundColor: currentPage <= 1 ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ←
          </button>
          
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            style={{
              backgroundColor: currentPage >= totalPages ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            →
          </button>
          
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingTop: '80px'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            maxWidth: '90%',
            maxHeight: '90%'
          }}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
