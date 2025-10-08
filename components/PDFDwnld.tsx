"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import GujaratiPDF from "./GujaratiPDF";

const PDFDownload = ({ data, date }: { data: any[]; date: string }) => {
  return (
    <>
      <Button variant="outline">
        <PDFDownloadLink
          document={<GujaratiPDF data={data} date={date} />}
          fileName={`દૈનિક_રિપોર્ટ_${date}.pdf`}
        >
          {({ loading }) =>
            loading ? "PDF તૈયાર થઈ રહ્યું છે..." : "PDF ડાઉનલોડ કરો"
          }
        </PDFDownloadLink>
      </Button>
    </>
  );
};

export default PDFDownload;
