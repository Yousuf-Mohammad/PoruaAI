
import React from 'react'

function PdfViewer({fileUrl}) {
  return (
    <div>
        <iframe src={fileUrl + "#toolbar=0"} width="100%" height="83vh" className='h-[83vh] w-[100%]'/>
    </div>
  )
}

export default PdfViewer