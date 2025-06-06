import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";

export default function Dropzone() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoading(true);
      Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      }).then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        {...getRootProps()}
        className="w-full max-w-xl h-64 border-4 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer transition hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      {loading && <p className="mt-4 text-blue-500">Processing image...</p>}

      {text && (
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-md"
            value={text}
            readOnly
          />
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
