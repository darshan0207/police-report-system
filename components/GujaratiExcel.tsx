"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

export default function GujaratiExcel({
  data,
  date,
}: {
  data: any[];
  date: string;
}) {
  const totalDayCount =
    data.length > 0
      ? data.reduce(
          (
            sum: number,
            item: {
              dutyType: {
                code: string;
              };
            }
          ) => {
            return item.dutyType?.code === "day" ? sum + 1 : sum;
          },
          0
        )
      : "";

  const totalNightCount =
    data.length > 0
      ? data.reduce(
          (
            sum: number,
            item: {
              dutyType: {
                code: string;
              };
            }
          ) => {
            return item.dutyType?.code === "night" ? sum + 1 : sum;
          },
          0
        )
      : "";

  const totalDayFoot =
    data.length > 0
      ? data.reduce(
          (
            sum: number,
            item: {
              dutyType: {
                code: string;
              };
              images: any[];
            }
          ) => {
            return item.dutyType?.code === "day"
              ? sum + item?.images?.length
              : sum;
          },
          0
        )
      : "";

  const totalNightFoot =
    data.length > 0
      ? data.reduce(
          (
            sum: number,
            item: {
              dutyType: {
                code: string;
              };
              images: any[];
            }
          ) => {
            return item.dutyType?.code === "night"
              ? sum + item?.images?.length
              : sum;
          },
          0
        )
      : "";

  const totalCount =
    data.length > 0
      ? data.reduce(
          (
            sum: number,
            item: {
              dutyCount: number;
            }
          ) => sum + item.dutyCount,
          0
        )
      : "";

  const formattedData = data.map((item, index) => ({
    ક્રમ: index + 1,
    "ડિવિ / યુનિટ": item?.unit?.name || "",
    "પોલીસ સ્ટેશન":
      `${item?.policeStation?.name} ${
        item.arrangement?.name ? " / " + item.arrangement?.name : ""
      }` || "",
    "દિવસ ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા":
      item.dutyType?.code === "day" ? 1 : "",
    "રાત્રી ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા":
      item.dutyType?.code === "night" ? 1 : "",
    "દિવસ ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા":
      item.dutyType?.code === "day" ? item.images?.length : "",
    "રાત્રી ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા":
      item.dutyType?.code === "night" ? item.images?.length : "",
    "ખરાઈ કરનાર અધિકારીનું નામ": item.verifyingOfficer?.name || "",
    "પોલીસ સ્ટેશનની હાજરી મુજબ ફોટોગ્રાફ ન મળેલ હોય તો કરેલ કાયર્વાહીની વિગત":
      item?.remarks || "",
    "રિમાક ફરજ ઉપર હાજર કુલ સંખ્યા": item?.dutyCount || "",
  }));

  formattedData.push({
    ક્રમ: "",
    "ડિવિ / યુનિટ": "",
    "પોલીસ સ્ટેશન": "કુલ",
    "દિવસ ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા": totalDayCount,
    "રાત્રી ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા": totalNightCount,
    "દિવસ ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા": totalDayFoot,
    "રાત્રી ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા": totalNightFoot,
    "ખરાઈ કરનાર અધિકારીનું નામ": "",
    "પોલીસ સ્ટેશનની હાજરી મુજબ ફોટોગ્રાફ ન મળેલ હોય તો કરેલ કાયર્વાહીની વિગત":
      "",
    "રિમાક ફરજ ઉપર હાજર કુલ સંખ્યા": totalCount,
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "દૈનિક રિપોર્ટ");

    // Create Excel file (UTF-8 safe)
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `દૈનિક_રિપોર્ટ_${date}.xlsx`);
  };

  return (
    <Button variant="outline" className="mb-3" onClick={exportToExcel}>
      Excel ડાઉનલોડ કરો
    </Button>
  );
}
