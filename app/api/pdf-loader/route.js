import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = "https://marvelous-nightingale-164.convex.cloud/api/storage/cb9f0d50-9f6a-42bd-bdd2-97b5a6e30cf8"

export async function GET(req){

    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl);
    const pdfUrl = searchParams.get("pdfUrl");
    
    //1 . load the pdf file 
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);

    const docs = await loader.load();
    let pdfTextContain = "";
    docs.forEach((doc) => {
        pdfTextContain += doc.pageContent
    })

    //2.text splitting 

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
        });
    
        const output = await splitter.createDocuments([pdfTextContain]);
        
        let splitterList =[];

        output.forEach((doc) => {
            splitterList.push(doc.pageContent)
        })

    //3. text embedding models 

    console.log(req);
    return NextResponse.json({result:splitterList})
}