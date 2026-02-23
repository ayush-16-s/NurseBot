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
import { Button, Table, Pagination, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../../../services/Api.service";
import { toast } from "react-toastify";
import { bytesToMB } from "../../../../utils/helper";
import DeleteConfirmModal from "../../../../components/confirmation.modal";
import { FaEye, FaSync, FaFilePdf } from "react-icons/fa";
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

  // Check if analyze parameter is present
  const isAnalyzeMode = searchParams.get("analyze") === "true";

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    let { data, error } = await ApiService.getAllFiles(searchParams.get("id"));

    if (error) {
      toast.error(error.response.data.message);
      return;
    }

    if (data) {
      setFiles(data.result);
    }
  };

  /* 📄 Select File */
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files[0]);
  };

  /* 🔁 Upload / Replace */
  const uploadFile = async () => {
    if (!selectedFiles) return;

    setLoading(true);

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
    formData.append("chatbot_id", searchParams.get("id"));
    formData.append("namespace_id", searchParams.get("namespace_id"));
    formData.append("files", selectedFiles);

    let { data, error } = await ApiService.uploadFile(formData);
    setLoading(false);

    if (error) {
      toast.error(error.response.data.message);
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
          navigate(`/default/chat?id=${searchParams.get("id")}&namespace_id=${searchParams.get("namespace_id")}&analyze=true`);
        }, 1500);
      }
    }
  };

  const resetFileInput = () => {
    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* 👁️ View PDF */
  const handleViewFile = (file) => {
    // Try multiple possible URL patterns for file viewing
    const possibleUrls = [
      `/api/files/view/${file.name}?namespace_id=${searchParams.get("namespace_id")}`,
      `/api/files/download/${file.name}?namespace_id=${searchParams.get("namespace_id")}`,
      `${window.location.origin}/api/files/view/${file.name}?namespace_id=${searchParams.get("namespace_id")}`,
    ];
    
    // Try the first URL, fallback to others if needed
    window.open(possibleUrls[0], "_blank");
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
              <h3 className="fw-bold text-primary">📄 PDF Upload Manager</h3>
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
                      {/* 👁️ VIEW */}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewFile(file)}
                        title="View PDF"
                      >
                        <FaEye />
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
//       setVectorizing(false);
//     }
//   };

//   /* 👁️ View PDF */
//   const handleViewFile = (file) => {
//     // Corrected URL - assuming your backend serves files at /api/files/view/:filename
//     const viewUrl = `/api/files/view/${file.name}?namespace=${namespaceId}`;
//     window.open(viewUrl, "_blank");
//   };

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