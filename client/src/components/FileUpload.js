import React from "react";
import { Button, Input } from "@mui/material";

const FileUpload = ({ onFileSelect }) => {
    const handleFileChange = (event) => {
       const file = event.target.files[0];
       onFileSelect(file);
    };
 
    return (
        <Input onClick={handleFileChange} type="file" >
        Upload data
      </Input> 
    );
 };

 export default FileUpload;