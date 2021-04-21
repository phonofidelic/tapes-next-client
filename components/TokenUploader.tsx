import React, { ReactElement, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface TokenUploaderProps {
  restoreIdentity(file: any): void;
}

export default function TokenUploader({
  restoreIdentity,
}: TokenUploaderProps): ReactElement {
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles[0]);
    await restoreIdentity(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        width: '100%',
        height: 100,
        border: `4px dashed #ccc`,
        borderRadius: 4,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} type="file" name="identity" />
      {isDragActive ? (
        <p>
          Drop the <b>.token</b> file here ...
        </p>
      ) : (
        <p>
          Drag and drop your <b>.token</b> file here, or click to select files
        </p>
      )}
    </div>
  );
}
