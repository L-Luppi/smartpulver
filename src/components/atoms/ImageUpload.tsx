import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";

interface ImageUploadAtomProps {
  onChange: (files: File[]) => void;
  value?: File[];
  multiple?: boolean;
}

export default function ImageUploadAtom({
  onChange,
  value = [],
  multiple = true,
}: ImageUploadAtomProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        onChange([...(value || []), ...acceptedFiles]);
      } else {
        onChange(acceptedFiles.slice(0, 1));
      }
    },
    [onChange, value, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 7,
        marginTop: 2,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "#f5f5f5" : "transparent",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography>Solte as imagens aqui...</Typography>
      ) : (
        <Typography>
          Arraste e solte suas imagens aqui, ou clique para selecionar
        </Typography>
      )}

      {/* Preview */}
      {value && value.length > 0 && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
          {value.map((file, idx) => (
            <Box
              key={idx}
              sx={{
                width: 100,
                height: 100,
                border: "1px solid #ddd",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
