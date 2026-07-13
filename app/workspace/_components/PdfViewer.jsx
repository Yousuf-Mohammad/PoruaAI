import React from "react";

function PdfViewer({ fileUrl }) {
  if (!fileUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-paper">
        <p className="eyebrow">Opening document…</p>
      </div>
    );
  }

  return (
    <iframe
      src={fileUrl + "#toolbar=0"}
      title="Document"
      className="h-full w-full border-0 bg-paper"
    />
  );
}

export default PdfViewer;
