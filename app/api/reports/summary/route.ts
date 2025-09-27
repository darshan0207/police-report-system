import { type NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DeploymentRecord from "@/models/DeploymentRecord";
import Zone from "@/models/Zone";
import Unit from "@/models/Unit";

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get all deployment records for the date
    const deploymentRecords = await DeploymentRecord.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate([
      { path: "zone", model: Zone },
      { path: "unit", model: Unit },
      { path: "policeStation" },
      { path: "verifyingOfficer" },
    ]);

    // Get all zones for structure
    const zones = await Zone.find({}).sort({ name: 1 });
    const units = await Unit.find({}).populate("zone").sort({ name: 1 });

    // Initialize summary structure
    const summary = {
      date: targetDate,
      zoneWiseSummary: {} as any,
      grandTotals: {
        dayDuty: 0,
        nightDuty: 0,
        dayPhotos: 0,
        nightPhotos: 0,
        totalPersonnel: 0,
        vipDuty: 0,
        trafficDuty: 0,
        railwayDuty: 0,
        otherDuty: 0,
        onLeave: 0,
        courtDuty: 0,
        longTermAbsent: 0,
        shortTermAbsent: 0,
      },
      personnelAllocation: {
        staffOfficers: 8,
        malePersonnel: 2180,
        femalePersonnel: 234,
        total: 2422,
      },
    };

    // Group records by zone
    const zoneGroups = deploymentRecords.reduce((acc, record) => {
      const zoneName = record.zone?.name || "Unknown";
      if (!acc[zoneName]) {
        acc[zoneName] = [];
      }
      acc[zoneName].push(record);
      return acc;
    }, {} as any);

    // Calculate zone-wise summaries
    Object.keys(zoneGroups).forEach((zoneName) => {
      const records = zoneGroups[zoneName];
      const zoneSummary = {
        dayDuty: 0,
        nightDuty: 0,
        dayPhotos: 0,
        nightPhotos: 0,
        totalPersonnel: 0,
        units: {} as any,
      };

      records.forEach((record: any) => {
        zoneSummary.dayDuty += record.dayDutyCount || 0;
        zoneSummary.nightDuty += record.nightDutyCount || 0;
        zoneSummary.dayPhotos += record.dayTotalPhotos || 0;
        zoneSummary.nightPhotos += record.nightTotalPhotos || 0;
        zoneSummary.totalPersonnel +=
          (record.dayDutyCount || 0) + (record.nightDutyCount || 0);

        // Group by unit within zone
        const unitName = record.unit?.name || "Unknown";
        if (!zoneSummary.units[unitName]) {
          zoneSummary.units[unitName] = {
            dayDuty: 0,
            nightDuty: 0,
            dayPhotos: 0,
            nightPhotos: 0,
            stations: [],
          };
        }

        zoneSummary.units[unitName].dayDuty += record.dayDutyCount || 0;
        zoneSummary.units[unitName].nightDuty += record.nightDutyCount || 0;
        zoneSummary.units[unitName].dayPhotos += record.dayTotalPhotos || 0;
        zoneSummary.units[unitName].nightPhotos += record.nightTotalPhotos || 0;
        zoneSummary.units[unitName].stations.push({
          name: record.policeStation?.name || "Unknown",
          dayDuty: record.dayDutyCount || 0,
          nightDuty: record.nightDutyCount || 0,
          dayPhotos: record.dayTotalPhotos || 0,
          nightPhotos: record.nightTotalPhotos || 0,
          verifyingOfficer: record.verifyingOfficer?.name || "Unknown",
        });
      });

      summary.zoneWiseSummary[zoneName] = zoneSummary;

      // Add to grand totals
      summary.grandTotals.dayDuty += zoneSummary.dayDuty;
      summary.grandTotals.nightDuty += zoneSummary.nightDuty;
      summary.grandTotals.dayPhotos += zoneSummary.dayPhotos;
      summary.grandTotals.nightPhotos += zoneSummary.nightPhotos;
      summary.grandTotals.totalPersonnel += zoneSummary.totalPersonnel;
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error generating summary report:", error);
    return NextResponse.json(
      { error: "Failed to generate summary report" },
      { status: 500 }
    );
  }
}
