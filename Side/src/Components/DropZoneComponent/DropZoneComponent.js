import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ServiceCall from "../../Service/ServiceCall";
//import { Document, Page } from 'react-pdf';
// import { Document, Page } from "react-pdf";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function DropzoneComponent(props) {
  const [files, setFiles] = useState([]);
  const [viewOP, setViewOP] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, file/pdf",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        <i>{file.name}</i>
      </Typography>
    </div>
  ));

  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

//   const displayOutputFile = (url) => {
//     return (
//       <div>
//         <Document file={{ url: url, mimeType: "application/pdf" }}></Document>
//       </div>
//     );
//   };

  function submitFiles() {
    const formData = new FormData()
    formData.append("file", files[0]);
    ServiceCall.submitFile(formData).then((response)=>{
      alert("Uploaded File!")
      localStorage.setItem('url',response.data)
      setOpen(true)
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);   
      const link = document.createElement('a')
      link.href = url
      setViewOP(true)
    })
  }

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>
          <b>Drag and drop your documents here</b>
        </div>
      </div>
      <br />
      <aside>{thumbs}</aside>
      <br />
      <Button
        variant="contained"
        style={{ backgroundColor: "#ffe600" }}
        onClick={() => submitFiles()}
      >
        Apply
      </Button>
      <br />
      <br />
      {viewOP && (
        <div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#ffe600" }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "http://localhost:5000/returnFile";
            }}
          >
            View Output
          </Button>
        </div>
      )}
    </section>
  );
}

export default DropzoneComponent;
