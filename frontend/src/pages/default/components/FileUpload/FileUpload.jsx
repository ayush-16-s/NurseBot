// import React, { useEffect, useState, useRef } from "react";
// import { Button, Table, Pagination } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import ApiService from "../../../../services/Api.service";
// import { toast } from "react-toastify";
// import { bytesToMB } from "../../../../utils/helper";
// import DeleteConfirmModal from "../../../../components/confirmation.modal";
// import "./FileUpload.scss";

// const PdfManager = () => {
//   const navigate = useNavigate();
//   let [searchParams] = useSearchParams();
//   const [files, setFiles] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFiles, setSelectedFiles] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const filesPerPage = 5;
//   const fileInputRef = useRef(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletetionItem, setdeletetionItem] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   useEffect(() => {
//     fetchAllFiles();
//   }, []);

//   const fetchAllFiles = async () => {
//     let { data, error } = await ApiService.getAllFiles(searchParams.get("id"));

//     if (error) {
//       toast.error(error.response.data.message);
//       return;
//     }

//     if (data) {
//       setFiles(data.result);
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files[0]);
//   };

//   const uploadFile = async () => {
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("chatbot_id", searchParams.get("id"));
//     formData.append("namespace_id", searchParams.get("namespace_id"));
//     formData.append("files", selectedFiles);

//     let { data, error } = await ApiService.uploadFile(formData);
//     setLoading(false);

//     if (error) {
//       toast.error(error.response.data.message);
//       return;
//     }

//     if (data) {
//       fetchAllFiles();
//       resetFileInput();
//     }
//   };

//   const resetFileInput = () => {
//     setSelectedFiles(null);
//     fileInputRef.current.value = "";
//   };

//   const handleDeleteClick = (item) => {
//     setdeletetionItem(item);
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletetionItem) return;
//     setIsDeleting(true);

//     let payload = {
//       id: deletetionItem._id["$oid"],
//       name: deletetionItem.name,
//       namespace_id: deletetionItem.namespace_id,
//     };
//     let { data, error } = await ApiService.deleteFile(payload);

//     if (error) {
//       toast.error(error.response.data.message);
//     }

//     if (data) {
//       setCurrentPage(1);
//       fetchAllFiles();
//     }
//     setIsDeleting(false);
//     setdeletetionItem(null);
//     setShowDeleteModal(false);
//   };

//   // Pagination logic
//   const indexOfLastFile = currentPage * filesPerPage;
//   const indexOfFirstFile = indexOfLastFile - filesPerPage;
//   const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
//   const totalPages = Math.ceil(files.length / filesPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="container-fluid p-4 ">
//       <div className="row justify-content-center ">
//         <div className="col-8">
//           <div className="row align-items-center mb-4">
//             <div className="col">
//               <h3 className="fw-bold text-primary">📄 PDF Upload Manager</h3>
//             </div>
//             <div className="col text-end">
//               <Button
//                 variant="secondary"
//                 onClick={() => navigate(-1)}
//                 className="px-4"
//               >
//                 ← Back
//               </Button>
//             </div>
//           </div>

//           {/* Upload Section */}
//           <div className="card shadow-sm p-4 mb-4">
//             <form>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   Select PDF File
//                 </label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                   ref={fileInputRef}
//                 />
//               </div>

//               <div className="text-end">
//                 <Button
//                   variant="primary"
//                   onClick={uploadFile}
//                   disabled={!selectedFiles || loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                         aria-hidden="true"
//                       ></span>
//                       Uploading...
//                     </>
//                   ) : (
//                     "Upload PDF"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>

//           <div className="card shadow-sm p-3">
//             <h5 className="fw-semibold mb-3 text-secondary">Uploaded PDFs</h5>
//             <div className="table-responsive">
//               <Table responsive bordered hover className="align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>File Name</th>
//                     <th>Size (MB)</th>
//                     <th>Uploaded Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentFiles.map((file, index) => (
//                     <tr key={file._id["$oid"]}>
//                       <td>{indexOfFirstFile + index + 1}</td>
//                       <td>{file?.name}</td>
//                       <td>{bytesToMB(file?.size).toFixed(3)} </td>
//                       <td>{file?.createdAt["$date"]}</td>
//                       <td>
//                         <div className="d-flex gap-2">
//                           <Button
//                             onClick={() => handleDeleteClick(file)}
//                             size="sm"
//                             variant="outline-danger"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>

//             {totalPages > 0 && (
//               <Pagination size="sm"  className="justify-content-end mt-3">
//                 <Pagination.First
//                   onClick={() => paginate(1)}
//                   disabled={currentPage === 1}
//                 />
//                 <Pagination.Prev
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 />

//                 {(() => {
//                   const pageNumbers = [];
//                   const maxVisible = 3;
//                   let start = Math.max(
//                     1,
//                     currentPage - Math.floor(maxVisible / 2)
//                   );
//                   let end = start + maxVisible - 1;

//                   if (end > totalPages) {
//                     end = totalPages;
//                     start = Math.max(1, end - maxVisible + 1);
//                   }

//                   for (let i = start; i <= end; i++) {
//                     pageNumbers.push(
//                       <Pagination.Item
//                         key={i}
//                         active={i === currentPage}
//                         onClick={() => paginate(i)}
//                       >
//                         {i}
//                       </Pagination.Item>
//                     );
//                   }

//                   return pageNumbers;
//                 })()}

//                 <Pagination.Next
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 />
//                 <Pagination.Last
//                   onClick={() => paginate(totalPages)}
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             )}
//           </div>

//           <DeleteConfirmModal
//             show={showDeleteModal}
//             onClose={() => setShowDeleteModal(false)}
//             onConfirm={handleConfirmDelete}
//             message={`Are you sure you want to delete "${deletetionItem?.name}"?`}
//             isDeleting={isDeleting}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfManager;
































import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Pagination, Spinner, Alert, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../../../services/Api.service";
import { toast } from "react-toastify";
import { bytesToMB } from "../../../../utils/helper";
import DeleteConfirmModal from "../../../../components/confirmation.modal";
import { FaEye, FaSync, FaFilePdf, FaDownload, FaExpand } from "react-icons/fa";
import { getVariable } from "../../../../utils/localStorage";
import { apiBaseUrl } from "../../../../constants/constant.js";
import "./FileUpload.scss";

const PdfManager = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const filesPerPage = 5;
  const fileInputRef = useRef(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletetionItem, setdeletetionItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [viewerLoading, setViewerLoading] = useState(false);

  // Check if analyze parameter is present
  const isAnalyzeMode = searchParams.get("analyze") === "true";

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      let { data, error } = await ApiService.getAllFiles(searchParams.get("id"));

      if (error) {
        toast.error(error.response?.data?.message || "Failed to fetch files");
        return;
      }

      if (data && data.result) {
        setFiles(data.result);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      toast.error("Failed to load files");
      setFiles([]);
    }
  };

  /* 📄 Select File */
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        e.target.value = "";
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        e.target.value = "";
        return;
      }
      setSelectedFiles(file);
    } else {
      setSelectedFiles(null);
    }
  };

  /* 🔁 Upload / Replace */
  const uploadFile = async () => {
    if (!selectedFiles) {
      toast.error("Please select a file first");
      return;
    }

    const chatbotId = searchParams.get("id");
    const namespaceId = searchParams.get("namespace_id");
    
    if (!chatbotId) {
      toast.error("Missing chatbot ID");
      return;
    }
    
    if (!namespaceId) {
      toast.error("Missing namespace ID. Please go back and select a bot again.");
      return;
    }

    setLoading(true);

    try {
      // Replace existing file
      if (files.length === 1) {
        const existingFile = files[0];
        await ApiService.deleteFile({
          id: existingFile._id["$oid"],
          name: existingFile.name,
          namespace_id: existingFile.namespace_id,
        });
      }

      const formData = new FormData();
      formData.append("chatbot_id", chatbotId);
      formData.append("namespace_id", namespaceId);
      formData.append("files", selectedFiles);

      let { data, error } = await ApiService.uploadFile(formData);
      setLoading(false);

      if (error) {
        toast.error(error.response?.data?.message || "Upload failed");
        return;
      }

      if (data) {
        toast.success(
          files.length === 1
            ? "File replaced successfully"
            : "File uploaded successfully"
        );
        fetchAllFiles();
        resetFileInput();
        
        // If in analyze mode, redirect to chat after successful upload
        if (isAnalyzeMode) {
          setTimeout(() => {
            navigate(`/default/chat?id=${chatbotId}&namespace_id=${namespaceId}&analyze=true`);
          }, 1500);
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error("Upload failed: " + err.message);
    }
  };

  const resetFileInput = () => {
    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* 👁️ View PDF in Modal */
  const handleViewInModal = async (file) => {
    try {
      console.log('Debug: File object:', file);
      const fileId = file._id && file._id["$oid"] ? file._id["$oid"] : file._id;
      console.log('Debug: Extracted file ID:', fileId);
      
      const token = getVariable('km_user_token');
      console.log('Debug: Token exists:', !!token);
      
      if (!token) {
        toast.error("Authentication required to view files");
        return;
      }

      if (!fileId) {
        toast.error("Invalid file ID format");
        return;
      }

      setViewingFile(file);
      setShowViewerModal(true);
      setViewerLoading(true);
      setFileContent('');
      
      // Use the correct API endpoint with authentication
      const viewUrl = `${apiBaseUrl}files/view/${fileId}`;
      console.log('Debug: View URL:', viewUrl);
      
      const response = await fetch(viewUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Debug: View response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Debug: View error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Check if we got HTML instead of the expected file
      if (blob.type === 'text/html' || blob.size < 1000) {
        throw new Error("Backend returned HTML instead of file");
      }
      
      // Convert blob to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      setFileContent(base64);
      setViewerLoading(false);
      toast.success("Document loaded successfully");
      
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error("Failed to load document. Please try downloading instead.");
      setViewerLoading(false);
      // Don't close modal on error so user can try download
    }
  };

  const closeViewerModal = () => {
    setShowViewerModal(false);
    setViewingFile(null);
    setFileContent('');
  };

  /* 📥 Download File */
  const handleDownloadFile = async (file) => {
    try {
      console.log('Debug: Download file object:', file);
      const fileId = file._id && file._id["$oid"] ? file._id["$oid"] : file._id;
      console.log('Debug: Download file ID:', fileId);
      
      const token = getVariable('km_user_token');
      console.log('Debug: Download token exists:', !!token);
      
      if (!token) {
        toast.error("Authentication required to download files");
        return;
      }

      if (!fileId) {
        toast.error("Invalid file ID format");
        return;
      }
      
      // Use authenticated fetch to get the file
      const fileDownloadUrl = `${apiBaseUrl}files/view/${fileId}`;
      console.log('Debug: Download URL:', fileDownloadUrl);
      
      const response = await fetch(fileDownloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Debug: Download response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Debug: Download error response:', errorText);
        toast.error(`Failed to download file: ${response.statusText}`);
        return;
      }

      // Get the file as blob
      const blob = await response.blob();
      
      // Create download link
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
      
      toast.success("File downloaded successfully");
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };


  const handleDeleteClick = (item) => {
    setdeletetionItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletetionItem) return;

    setIsDeleting(true);

    let { data, error } = await ApiService.deleteFile({
      id: deletetionItem._id["$oid"],
      name: deletetionItem.name,
      namespace_id: deletetionItem.namespace_id,
    });

    if (error) toast.error(error.response.data.message);

    if (data) {
      setCurrentPage(1);
      fetchAllFiles();
    }

    setIsDeleting(false);
    setdeletetionItem(null);
    setShowDeleteModal(false);
  };

  /* Pagination */
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(files.length / filesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h3 className="fw-bold text-primary">📄 Report Upload Manager</h3>
            </div>
            <div className="col text-end">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </div>
          </div>

          {/* Upload */}
          <div className="card shadow-sm p-4 mb-4">
            <div className="mb-3">
              <label className="form-label fw-semibold">
                {files.length === 1 ? "Replace PDF File" : "Select PDF File"}
              </label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            <div className="text-end">
              <Button
                variant={files.length === 1 ? "warning" : "primary"}
                onClick={uploadFile}
                disabled={!selectedFiles || loading}
              >
                {loading ? "Processing..." : files.length === 1 ? "Replace PDF" : "Upload PDF"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold mb-3 text-secondary">Uploaded PDFs</h5>
            <Table responsive bordered hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Size (MB)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file, index) => (
                  <tr key={file._id["$oid"]}>
                    <td>{indexOfFirstFile + index + 1}</td>
                    <td>{file.name}</td>
                    <td>{bytesToMB(file.size).toFixed(3)}</td>
                    <td>{file.createdAt["$date"]}</td>
                    <td className="d-flex gap-2">
                      {/* 👁️ VIEW IN MODAL */}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewInModal(file)}
                        title="View Document"
                      >
                        <FaExpand />
                      </Button>

                      {/* 📥 DOWNLOAD */}
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleDownloadFile(file)}
                        title="Download PDF"
                      >
                        <FaDownload />
                      </Button>

                      {/* 🗑️ DELETE */}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteClick(file)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <Pagination className="justify-content-end">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                />
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                />
              </Pagination>
            )}
          </div>

          <DeleteConfirmModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            message={`Delete "${deletetionItem?.name}" ?`}
            isDeleting={isDeleting}
          />

          {/* Document Viewer Modal */}
          <Modal
            show={showViewerModal}
            onHide={closeViewerModal}
            size="xl"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <FaFilePdf className="me-2" />
                {viewingFile?.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0, height: '70vh' }}>
              {viewerLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column'
                }}>
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-3">Loading document...</div>
                  <div className="text-muted small">File: {viewingFile?.name}</div>
                  <div className="text-muted small">ID: {viewingFile?._id && viewingFile._id.$oid ? viewingFile._id.$oid : 'N/A'}</div>
                </div>
              ) : (
                <div>
                  <div style={{padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6'}}>
                    <strong>Debug Info:</strong>
                    <br />File Content Length: {fileContent.length}
                    <br />File Name: {viewingFile?.name}
                    <br />Is PDF: {viewingFile?.name?.toLowerCase().endsWith('.pdf') ? 'Yes' : 'No'}
                    <br />Content Type: {fileContent.startsWith('data:text/html') ? 'HTML (Error)' : fileContent.startsWith('data:application/pdf') ? 'PDF' : 'Unknown'}
                  </div>
                  {fileContent ? (
                    fileContent.startsWith('data:text/html') ? (
                      <div style={{
                        padding: '20px',
                        height: 'calc(70vh - 60px)',
                        overflow: 'auto',
                        backgroundColor: '#fff8dc',
                        border: '2px solid #dc3545'
                      }}>
                        <div style={{color: '#dc3545', fontWeight: 'bold', marginBottom: '10px'}}>
                          ⚠️ Backend returned HTML instead of file content
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          This usually means the backend server is not running correctly or there's an authentication issue.
                        </div>
                        <iframe
                          src={fileContent}
                          style={{
                            width: '100%',
                            height: 'calc(100% - 60px)',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }}
                          title="Backend Response"
                        />
                      </div>
                    ) : viewingFile?.name?.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={fileContent}
                        style={{
                          width: '100%',
                          height: 'calc(70vh - 60px)',
                          border: 'none',
                          borderRadius: '4px'
                        }}
                        title={viewingFile?.name}
                      />
                    ) : (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'calc(70vh - 60px)'
                      }}>
                        <img
                          src={fileContent}
                          alt={viewingFile?.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: 'calc(70vh - 60px)',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 'calc(70vh - 60px)',
                      flexDirection: 'column',
                      color: '#e74c3c'
                    }}>
                      <div style={{fontSize: '48px', marginBottom: '16px'}}>❌</div>
                      <div>No file content loaded</div>
                      <div className="text-muted small">File: {viewingFile?.name}</div>
                      <div className="text-muted small">ID: {viewingFile?._id && viewingFile._id.$oid ? viewingFile._id.$oid : 'N/A'}</div>
                    </div>
                  )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeViewerModal}>
                Close
              </Button>
              {fileContent && (
                <Button
                  variant="primary"
                  href={fileContent}
                  download={viewingFile?.name}
                  target="_blank"
                >
                  Download
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PdfManager;




















// import React, { useEffect, useState, useRef } from "react";
// import { Button, Table, Pagination, Spinner, Alert } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import ApiService from "../../../../services/Api.service";
// import { toast } from "react-toastify";
// import { bytesToMB } from "../../../../utils/helper";
// import DeleteConfirmModal from "../../../../components/confirmation.modal";
// import { FaEye, FaUpload, FaSync, FaFilePdf } from "react-icons/fa";
// import "./FileUpload.scss";

// const PdfManager = () => {
//   const navigate = useNavigate();
//   let [searchParams] = useSearchParams();

//   const [files, setFiles] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFiles, setSelectedFiles] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [vectorizing, setVectorizing] = useState(false);
//   const [vectorStatus, setVectorStatus] = useState({});
  
//   const filesPerPage = 5;
//   const fileInputRef = useRef(null);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletetionItem, setdeletetionItem] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const chatbotId = searchParams.get("id");
//   const namespaceId = searchParams.get("namespace_id");

//   useEffect(() => {
//     fetchAllFiles();
//     if (namespaceId) {
//       checkVectorizationStatus();
//     }
//   }, [chatbotId, namespaceId]);

//   const fetchAllFiles = async () => {
//     try {
//       let { data, error } = await ApiService.getAllFiles(chatbotId);

//       if (error) {
//         toast.error(error.response?.data?.message || "Failed to fetch files");
//         return;
//       }

//       if (data) {
//         setFiles(data.result || []);
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//       toast.error("Failed to load files");
//     }
//   };

//   const checkVectorizationStatus = async () => {
//     try {
//       if (!namespaceId) return;
      
//       const { data, error } = await ApiService.getVectorizationStatus(namespaceId);
      
//       if (!error && data) {
//         setVectorStatus(data);
//       }
//     } catch (error) {
//       console.error("Error checking vectorization:", error);
//     }
//   };

//   /* 📄 Select File */
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (file.type !== "application/pdf") {
//         toast.error("Please upload only PDF files");
//         e.target.value = "";
//         return;
//       }
      
//       // Validate file size (e.g., 10MB limit)
//       if (file.size > 10 * 1024 * 1024) {
//         toast.error("File size should be less than 10MB");
//         e.target.value = "";
//         return;
//       }
      
//       setSelectedFiles(file);
//     }
//   };

//   /* 🔁 Upload & Vectorize */
//   const uploadFile = async () => {
//     if (!selectedFiles) {
//       toast.warning("Please select a file first");
//       return;
//     }

//     if (!namespaceId) {
//       toast.error("Missing namespace ID");
//       return;
//     }

//     setLoading(true);

//     try {
//       // If there's already a file, delete it first
//       if (files.length >= 1) {
//         const existingFile = files[0];
//         await ApiService.deleteFile({
//           id: existingFile._id?.["$oid"] || existingFile._id,
//           name: existingFile.name,
//           namespace_id: existingFile.namespace_id,
//         });
//       }

//       // Upload new file
//       const formData = new FormData();
//       formData.append("chatbot_id", chatbotId);
//       formData.append("namespace_id", namespaceId);
//       formData.append("files", selectedFiles);

//       const { data: uploadData, error: uploadError } = await ApiService.uploadFile(formData);

//       if (uploadError) {
//         toast.error(uploadError.response?.data?.message || "Upload failed");
//         return;
//       }

//       toast.success(files.length === 1 ? "File replaced successfully" : "File uploaded successfully");
      
//       // Refresh file list
//       await fetchAllFiles();
      
//       // Start vectorization
//       await vectorizeDocuments();
      
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const vectorizeDocuments = async () => {
//     if (!namespaceId) {
//       toast.error("Missing namespace ID");
//       return;
//     }

//     setVectorizing(true);
    
//     try {
//       const { data, error } = await ApiService.vectorizeDocuments({
//         namespace_id: namespaceId
//       });

//       if (error) {
//         toast.error(error.response?.data?.message || "Vectorization failed");
//         return;
//       }

//       if (data) {
//         toast.success("Report analysis completed! You can now ask questions about your glucose report.");
//         setVectorStatus({ 
//           status: "completed", 
//           message: "Report analyzed successfully",
//           count: data.count || 1 
//         });
//       }
//     } catch (error) {
//       console.error("Vectorization error:", error);
//       toast.error("Failed to analyze report");
//     } finally {

//   /* 👁️ View PDF */
  const handleViewFile = async (file) => {
    try {
      const fileId = file._id["$oid"];
      const token = getVariable('km_user_token');
      
      if (!token) {
        toast.error("Authentication required to view files");
        return;
      }
      
      // Use authenticated fetch to get the file
      const response = await fetch(`${window.location.origin}/api/files/view/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Failed to view file: ${response.statusText}`);
        return;
      }

      // Get the file as blob
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
      
    } catch (error) {
      toast.error("Failed to view file");
    }
  };

//   const handleDeleteClick = (item) => {
//     setdeletetionItem(item);
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletetionItem) return;

//     setIsDeleting(true);

//     try {
//       const { data, error } = await ApiService.deleteFile({
//         id: deletetionItem._id?.["$oid"] || deletetionItem._id,
//         name: deletetionItem.name,
//         namespace_id: deletetionItem.namespace_id || namespaceId,
//       });

//       if (error) {
//         toast.error(error.response?.data?.message || "Delete failed");
//       } else if (data) {
//         toast.success("File deleted successfully");
        
//         // Also delete vectorized data
//         if (namespaceId) {
//           await ApiService.deleteVectorizedDocs(namespaceId);
//         }
        
//         setCurrentPage(1);
//         fetchAllFiles();
//         setVectorStatus({});
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Delete failed");
//     } finally {
//       setIsDeleting(false);
//       setdeletetionItem(null);
//       setShowDeleteModal(false);
//     }
//   };

//   const handleAnalyzeClick = async () => {
//     await vectorizeDocuments();
//   };

//   /* Pagination */
//   const indexOfLastFile = currentPage * filesPerPage;
//   const indexOfFirstFile = indexOfLastFile - filesPerPage;
//   const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
//   const totalPages = Math.ceil(files.length / filesPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (e) {
//       return dateString;
//     }
//   };

//   return (
//     <div className="container-fluid p-4">
//       <div className="row justify-content-center">
//         <div className="col-12 col-lg-10 col-xl-8">
//           {/* Header */}
//           <div className="row align-items-center mb-4">
//             <div className="col">
//               <h3 className="fw-bold text-primary">
//                 <FaFilePdf className="me-2" />
//                 Diabetes Report Manager
//               </h3>
//               <p className="text-muted mb-0">
//                 Upload and analyze your glucose reports for personalized diabetes guidance
//               </p>
//             </div>
//             <div className="col-auto">
//               <Button variant="secondary" onClick={() => navigate(-1)}>
//                 ← Back to Chat
//               </Button>
//             </div>
//           </div>

//           {/* Vectorization Status */}
//           {vectorStatus.status && (
//             <Alert variant={vectorStatus.status === "completed" ? "success" : "info"} className="mb-4">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>Report Status:</strong> {vectorStatus.message}
//                   {vectorStatus.count && (
//                     <span className="ms-2 text-muted">
//                       ({vectorStatus.count} pages analyzed)
//                     </span>
//                   )}
//                 </div>
//                 {vectorStatus.status !== "completed" && files.length > 0 && (
//                   <Button 
//                     size="sm" 
//                     variant="outline-primary"
//                     onClick={handleAnalyzeClick}
//                     disabled={vectorizing}
//                   >
//                     {vectorizing ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <FaSync className="me-2" />
//                         Re-analyze
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </Alert>
//           )}

//           {/* Upload Card */}
//           <div className="card shadow-sm p-4 mb-4">
//             <h5 className="fw-semibold mb-3 text-dark">
//               <FaUpload className="me-2" />
//               {files.length === 1 ? "Replace Glucose Report" : "Upload Glucose Report"}
//             </h5>
            
//             <div className="mb-3">
//               <label className="form-label fw-semibold">
//                 Select PDF Report (Max 10MB)
//                 <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="file"
//                 className="form-control"
//                 accept="application/pdf"
//                 onChange={handleFileChange}
//                 ref={fileInputRef}
//                 disabled={loading || vectorizing}
//               />
//               <div className="form-text">
//                 Upload your glucose blood test report in PDF format
//               </div>
//             </div>

//             {selectedFiles && (
//               <div className="alert alert-info mb-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Selected:</strong> {selectedFiles.name}
//                     <br />
//                     <small>Size: {(selectedFiles.size / 1024 / 1024).toFixed(2)} MB</small>
//                   </div>
//                   <Button 
//                     size="sm" 
//                     variant="outline-secondary"
//                     onClick={resetFileInput}
//                     disabled={loading}
//                   >
//                     Change
//                   </Button>
//                 </div>
//               </div>
//             )}

//             <div className="d-flex justify-content-between">
//               <div>
//                 {files.length > 0 && !selectedFiles && (
//                   <Button
//                     variant="outline-primary"
//                     onClick={handleAnalyzeClick}
//                     disabled={vectorizing}
//                   >
//                     {vectorizing ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Analyzing Report...
//                       </>
//                     ) : (
//                       <>
//                         <FaSync className="me-2" />
//                         Analyze Report Again
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>
//               <div className="text-end">
//                 <Button
//                   variant={files.length === 1 ? "warning" : "primary"}
//                   onClick={uploadFile}
//                   disabled={!selectedFiles || loading || vectorizing}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner as="span" animation="border" size="sm" className="me-2" />
//                       {files.length === 1 ? "Replacing..." : "Uploading..."}
//                     </>
//                   ) : vectorizing ? (
//                     <>
//                       <Spinner as="span" animation="border" size="sm" className="me-2" />
//                       Analyzing...
//                     </>
//                   ) : files.length === 1 ? (
//                     "Replace Report"
//                   ) : (
//                     "Upload & Analyze Report"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Files Table */}
//           <div className="card shadow-sm p-3">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="fw-semibold text-secondary mb-0">
//                 Uploaded Reports ({files.length})
//               </h5>
//               {files.length > 0 && (
//                 <small className="text-muted">
//                   Page {currentPage} of {totalPages}
//                 </small>
//               )}
//             </div>
            
//             {files.length === 0 ? (
//               <div className="text-center py-5">
//                 <FaFilePdf size={48} className="text-muted mb-3" />
//                 <h5 className="text-muted">No reports uploaded yet</h5>
//                 <p className="text-muted">
//                   Upload your glucose report to get personalized diabetes analysis
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <Table responsive bordered hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>Report Name</th>
//                       <th>Size</th>
//                       <th>Upload Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentFiles.map((file, index) => (
//                       <tr key={file._id?.["$oid"] || file._id || index}>
//                         <td>{indexOfFirstFile + index + 1}</td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <FaFilePdf className="text-danger me-2" />
//                             <span className="text-truncate" style={{ maxWidth: '200px' }}>
//                               {file.name}
//                             </span>
//                           </div>
//                         </td>
//                         <td>{bytesToMB(file.size).toFixed(2)} MB</td>
//                         <td>
//                           {formatDate(file.createdAt?.["$date"] || file.createdAt || file.uploadedAt)}
//                         </td>
//                         <td className="d-flex gap-2">
//                           {/* 👁️ VIEW */}
//                           <Button
//                             size="sm"
//                             variant="outline-primary"
//                             onClick={() => handleViewFile(file)}
//                             title="View Report"
//                           >
//                             <FaEye />
//                           </Button>

//                           {/* 🗑️ DELETE */}
//                           <Button
//                             size="sm"
//                             variant="outline-danger"
//                             onClick={() => handleDeleteClick(file)}
//                             disabled={isDeleting}
//                           >
//                             {isDeleting && deletetionItem?._id === file._id ? (
//                               <Spinner as="span" animation="border" size="sm" />
//                             ) : (
//                               "Delete"
//                             )}
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="d-flex justify-content-center mt-3">
//                     <Pagination>
//                       <Pagination.Prev
//                         disabled={currentPage === 1}
//                         onClick={() => paginate(currentPage - 1)}
//                       />
//                       {[...Array(totalPages)].map((_, index) => (
//                         <Pagination.Item
//                           key={index + 1}
//                           active={index + 1 === currentPage}
//                           onClick={() => paginate(index + 1)}
//                         >
//                           {index + 1}
//                         </Pagination.Item>
//                       ))}
//                       <Pagination.Next
//                         disabled={currentPage === totalPages}
//                         onClick={() => paginate(currentPage + 1)}
//                       />
//                     </Pagination>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Information Card */}
//           <div className="card shadow-sm p-3 mt-4 border-info">
//             <h6 className="fw-semibold text-info">
//               📋 About Glucose Report Analysis
//             </h6>
//             <ul className="mb-0">
//               <li>Upload your recent glucose blood test report (PDF format)</li>
//               <li>Our AI will analyze fasting, post-meal, and HbA1c values</li>
//               <li>Get personalized diet and lifestyle recommendations</li>
//               <li>All data is processed securely in your private namespace</li>
//               <li>You can ask questions about your report in the chat interface</li>
//             </ul>
//           </div>

//           {/* Delete Confirmation Modal */}
//           <DeleteConfirmModal
//             show={showDeleteModal}
//             onClose={() => setShowDeleteModal(false)}
//             onConfirm={handleConfirmDelete}
//             message={`Are you sure you want to delete "${deletetionItem?.name}"? This will also remove all analyzed data.`}
//             isDeleting={isDeleting}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfManager;