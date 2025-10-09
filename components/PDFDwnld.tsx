"use client";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import GujaratiPDF from "./GujaratiPDF";

const PDFDownload = ({ data, date }: { data: any[]; date: string }) => {
  const handleDownload = async () => {
    const blob = await pdf(<GujaratiPDF data={data} date={date} />).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `દૈનિક_રિપોર્ટ_${date}.pdf`;
    link.click();
  };

  return (
    <>
      <Button variant="outline" className="mb-3" onClick={handleDownload}>
        PDF ડાઉનલોડ કરો
        {/* <PDFDownloadLink
          document={<GujaratiPDF data={data} date={date} />}
          fileName={`દૈનિક_રિપોર્ટ_${date}.pdf`}
        >
          {({ loading }) =>
            loading ? "PDF તૈયાર થઈ રહ્યું છે..." : "PDF ડાઉનલોડ કરો"
          }
        </PDFDownloadLink> */}
      </Button>
    </>
  );
};

export default PDFDownload;
