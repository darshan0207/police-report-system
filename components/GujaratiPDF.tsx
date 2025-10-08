"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ Register local Gujarati font
Font.register({
  family: "NotoSansGujarati",
  src: "/fonts/NotoSansGujarati-Regular.ttf", // make sure this file exists
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "NotoSansGujarati",
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  headerRow: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastbottomCell: {
    borderBottomWidth: 0,
  },

  // ✅ Custom widths
  colIndex: { width: "10%" },
  colName: { width: "16%" },
  colDept: { width: "6%" },
  col100: { width: "100%" },
  col38: { width: "38%" },
  col32: { width: "32%" },
});

const GujaratiPDF = ({ data, date }: { data: any[]; date: string }) => {
  console.log("data in pdf", data);
  if (data.length < 0) {
    return null;
  }
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

  return (
    <>
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <Text style={styles.title}>દૈનિક રિપોર્ટ</Text>

          <View style={styles.table}>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.lastCell, styles.col100]}>
                {date}
              </Text>
            </View>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.colDept]}>ક્રમ</Text>
              <Text style={[styles.cell, styles.colName]}>ડિવિ / યુનિટ</Text>
              <Text style={[styles.cell, styles.colName]}>પોલીસ સ્ટેશન</Text>
              <Text style={[styles.cell, styles.colDept]}>
                દિવસ ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા
              </Text>
              <Text style={[styles.cell, styles.colDept]}>
                રાત્રી ફરજ નાં પોલીસ સ્ટેશનોની કુલ સંખ્યા
              </Text>
              <Text style={[styles.cell, styles.colDept]}>
                દિવસ ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા
              </Text>
              <Text style={[styles.cell, styles.colDept]}>
                રાત્રી ફરજ નાં કુલ ફોટોગ્રાફોની સંખ્યા
              </Text>
              <Text style={[styles.cell, styles.colName]}>
                ખરાઈ કરનાર અધિકારીનું નામ
              </Text>
              <Text style={[styles.cell, styles.colName]}>
                પોલીસ સ્ટેશનની હાજરી મુજબ ફોટોગ્રાફ ન મળેલ હોય તો કરેલ કાર્યવાહી
                ની વિગત
              </Text>
              <Text style={[styles.cell, styles.colDept, styles.lastCell]}>
                રિમાક ફરજ ઉપર હાજર કુલ સંખ્યા
              </Text>
            </View>

            {/* Rows */}
            {data.map((item, index) => (
              <View key={index} style={[styles.row, styles.lastCell]}>
                <Text style={[styles.cell, styles.colDept]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.colName]}>
                  {item?.unit?.name}
                </Text>
                <Text style={[styles.cell, styles.colName]}>
                  {item?.policeStation?.name}
                </Text>
                <Text style={[styles.cell, styles.colDept]}>
                  {item.dutyType?.code === "day" ? 1 : ""}
                </Text>
                <Text style={[styles.cell, styles.colDept]}>
                  {item.dutyType?.code === "night" ? 1 : ""}
                </Text>
                <Text style={[styles.cell, styles.colDept]}>
                  {item.dutyType?.code === "day" ? item.images?.length : ""}
                </Text>
                <Text style={[styles.cell, styles.colDept]}>
                  {item.dutyType?.code === "night" ? item.images?.length : ""}
                </Text>
                <Text style={[styles.cell, styles.colName]}>
                  {item.verifyingOfficer?.name}
                </Text>
                <Text style={[styles.cell, styles.colName]}>
                  {item?.remarks}
                </Text>
                <Text style={[styles.cell, styles.colDept, styles.lastCell]}>
                  {item?.dutyCount}
                </Text>
              </View>
            ))}
            <View style={[styles.row, styles.headerRow, styles.lastbottomCell]}>
              <Text style={[styles.cell, styles.col38]}>કુલ</Text>
              <Text style={[styles.cell, styles.colDept]}>{totalDayCount}</Text>
              <Text style={[styles.cell, styles.colDept]}>
                {totalNightCount}
              </Text>
              <Text style={[styles.cell, styles.colDept]}>{totalDayFoot}</Text>
              <Text style={[styles.cell, styles.colDept]}>
                {totalNightFoot}
              </Text>
              <Text style={[styles.cell, styles.col32]}></Text>
              <Text style={[styles.cell, styles.colDept, styles.lastCell]}>
                {totalCount}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default GujaratiPDF;
