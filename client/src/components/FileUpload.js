import React from "react";
import { Button } from "@mui/material";

const FileUpload = ({ onFileSelect }) => {
   const handleFileChange = (event) => {
      const file = event.target.files[0];
      onFileSelect(file);
   };

   return (
      <Button component="label">
         Upload File
         <input onChange={handleFileChange}
            accept=".csv, .xlsx, .json, .mat"
            type="file"
            hidden />
      </Button>
   );
};

export default FileUpload;