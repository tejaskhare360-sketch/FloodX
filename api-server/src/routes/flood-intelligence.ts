import { Router, type IRouter } from "express";
import {
  CreateReportBody,
  GetZoneParams,
  PredictRiskBody,
  RunSimulationBody,
  type Alert,
  type Prediction,
  type Report,
  type SimulationResult,
  type Statistics,
  type Zone,
} from "@workspace/api-zod";

type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

type ZoneSeed = Omit<
  Zone,
  "rainfall" | "riskScore" | "riskLevel" | "factors" | "affectedRoads"
>;

const zoneSeeds: ZoneSeed[] = [
  { id: "ward-01", name: "Ward 01 · Rajwada", latitude: 22.7186, longitude: 75.8577, elevation: 553, slope: 2.8, drainageCapacity: 62, imperviousSurface: 71, historicalFloods: 3 },
  { id: "ward-02", name: "Ward 02 · Palasia", latitude: 22.7271, longitude: 75.8841, elevation: 558, slope: 3.6, drainageCapacity: 72, imperviousSurface: 68, historicalFloods: 2 },
  { id: "ward-03", name: "Ward 03 · Vijay Nagar", latitude: 22.7533, longitude: 75.8937, elevation: 565, slope: 4.5, drainageCapacity: 78, imperviousSurface: 59, historicalFloods: 1 },
  { id: "ward-04", name: "Ward 04 · Bhawarkua", latitude: 22.6881, longitude: 75.8497, elevation: 546, slope: 2.1, drainageCapacity: 49, imperviousSurface: 78, historicalFloods: 4 },
  { id: "ward-05", name: "Ward 05 · Annapurna", latitude: 22.6889, longitude: 75.8207, elevation: 552, slope: 3.2, drainageCapacity: 66, imperviousSurface: 66, historicalFloods: 2 },
  { id: "ward-06", name: "Ward 06 · Rau", latitude: 22.6256, longitude: 75.8071, elevation: 548, slope: 5.2, drainageCapacity: 75, imperviousSurface: 48, historicalFloods: 1 },
  { id: "ward-07", name: "Ward 07 · Airport", latitude: 22.7215, longitude: 75.8011, elevation: 559, slope: 4.8, drainageCapacity: 71, imperviousSurface: 55, historicalFloods: 2 },
  { id: "ward-08", name: "Ward 08 · Bapat Square", latitude: 22.7392, longitude: 75.9105, elevation: 550, slope: 1.4, drainageCapacity: 38, imperviousSurface: 84, historicalFloods: 6 },
  { id: "ward-09", name: "Ward 09 · Sudama Nagar", latitude: 22.6974, longitude: 75.8172, elevation: 557, slope: 3.8, drainageCapacity: 68, imperviousSurface: 64, historicalFloods: 2 },
  { id: "ward-10", name: "Ward 10 · Sapna Sangeeta", latitude: 22.7052, longitude: 75.8706, elevation: 560, slope: 3.9, drainageCapacity: 74, imperviousSurface: 73, historicalFloods: 2 },
  { id: "ward-11", name: "Ward 11 · Tilak Nagar", latitude: 22.6997, longitude: 75.8974, elevation: 555, slope: 2.6, drainageCapacity: 57, imperviousSurface: 76, historicalFloods: 3 },
  { id: "ward-12", name: "Ward 12 · Bengali Square", latitude: 22.7248, longitude: 75.9129, elevation: 548, slope: 1.2, drainageCapacity: 30, imperviousSurface: 82, historicalFloods: 7 },
  { id: "ward-13", name: "Ward 13 · Scheme 54", latitude: 22.7418, longitude: 75.8998, elevation: 568, slope: 5.8, drainageCapacity: 81, imperviousSurface: 52, historicalFloods: 1 },
  { id: "ward-14", name: "Ward 14 · LIG Colony", latitude: 22.7272, longitude: 75.8672, elevation: 551, slope: 2.9, drainageCapacity: 61, imperviousSurface: 79, historicalFloods: 4 },
  { id: "ward-15", name: "Ward 15 · Geeta Bhawan", latitude: 22.7165, longitude: 75.8762, elevation: 561, slope: 4.2, drainageCapacity: 69, imperviousSurface: 69, historicalFloods: 2 },
  { id: "ward-16", name: "Ward 16 · Choithram", latitude: 22.6847, longitude: 75.8154, elevation: 543, slope: 2.3, drainageCapacity: 55, imperviousSurface: 75, historicalFloods: 4 },
  { id: "ward-17", name: "Ward 17 · Silicon City", latitude: 22.6537, longitude: 75.7821, elevation: 575, slope: 6.4, drainageCapacity: 86, imperviousSurface: 42, historicalFloods: 0 },
  { id: "ward-18", name: "Ward 18 · Kanadia", latitude: 22.6708, longitude: 75.9102, elevation: 545, slope: 2.8, drainageCapacity: 51, imperviousSurface: 72, historicalFloods: 3 },
  { id: "ward-19", name: "Ward 19 · Khajrana", latitude: 22.7161, longitude: 75.9157, elevation: 549, slope: 2.0, drainageCapacity: 45, imperviousSurface: 81, historicalFloods: 5 },
  { id: "ward-20", name: "Ward 20 · Musakhedi", latitude: 22.6716, longitude: 75.8426, elevation: 547, slope: 2.5, drainageCapacity: 58, imperviousSurface: 77, historicalFloods: 4 },
  { id: "ward-21", name: "Ward 21 · Ring Road East", latitude: 22.7446, longitude: 75.9255, elevation: 552, slope: 1.8, drainageCapacity: 43, imperviousSurface: 80, historicalFloods: 5 },
  { id: "ward-22", name: "Ward 22 · Mhow Naka", latitude: 22.6558, longitude: 75.8238, elevation: 544, slope: 3.1, drainageCapacity: 63, imperviousSurface: 63, historicalFloods: 3 },
  { id: "ward-23", name: "Ward 23 · MR-10", latitude: 22.7681, longitude: 75.9387, elevation: 560, slope: 4.2, drainageCapacity: 70, imperviousSurface: 58, historicalFloods: 1 },
  { id: "ward-24", name: "Ward 24 · Pithampur Road", latitude: 22.6499, longitude: 75.7468, elevation: 568, slope: 5.7, drainageCapacity: 79, imperviousSurface: 47, historicalFloods: 1 },
];

let currentRainfall = 20;
let currentDuration = 1;

let reports: Report[] = [
  {
    id: "report-demo-1",
    zoneId: "ward-12",
    zoneName: "Ward 12 · Bengali Square",
    waterLevel: "HIGH",
    description: "Water pooling near the underpass after the last shower.",
    photoName: null,
    status: "UNVERIFIED",
    reportedAt: new Date("2026-09-25T08:30:00.000Z").toISOString(),
  },
  {
    id: "report-demo-2",
    zoneId: "ward-08",
    zoneName: "Ward 08 · Bapat Square",
    waterLevel: "MEDIUM",
    description: "Drain inlet appears blocked at the market entrance.",
    photoName: null,
    status: "REVIEWING",
    reportedAt: new Date("2026-09-25T07:55:00.000Z").toISOString(),
  },
  {
    id: "report-demo-3",
    zoneId: "ward-04",
    zoneName: "Ward 04 · Bhawarkua",
    waterLevel: "LOW",
    description: "Slow-moving water across the service lane.",
    photoName: null,
    status: "UNVERIFIED",
    reportedAt: new Date("2026-09-25T07:20:00.000Z").toISOString(),
  },
];

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

function categoryFor(score: number): RiskLevel {
  if (score <= 25) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 75) return "HIGH";
  return "CRITICAL";
}

function factorSet(input: {
  rainfall: number;
  duration: number;
  elevation: number;
  slope: number;
  drainageCapacity: number;
  imperviousSurface: number;
  historicalFloods: number;
}) {
  return {
    rainfall: Math.round(clamp(Math.pow(input.rainfall / 100, 1.8) * 100)),
    drainage: Math.round(100 - input.drainageCapacity),
    historical: Math.round(clamp(input.historicalFloods * 12)),
    elevation: Math.round(clamp((600 - input.elevation) / 100 * 100)),
    landUse: Math.round(input.imperviousSurface),
    slope: Math.round(clamp((8 - input.slope) / 8 * 100)),
  };
}

function predictFromInput(input: {
  rainfall: number;
  duration: number;
  elevation: number;
  slope: number;
  drainageCapacity: number;
  imperviousSurface: number;
  historicalFloods: number;
}): Prediction {
  const factors = factorSet(input);
  const baseRisk =
    factors.drainage * 0.18 +
    factors.historical * 0.15 +
    factors.elevation * 0.12 +
    factors.landUse * 0.1 +
    factors.slope * 0.05;
  const rainfallPressure = Math.pow(input.rainfall / 100, 1.8) * 103;
  const durationPressure = ((input.duration - 1) / 5) * 5;
  const riskScore = Math.round(clamp(baseRisk * 0.55 + rainfallPressure + durationPressure));

  return {
    riskScore,
    riskLevel: categoryFor(riskScore),
    factors,
    engine: "Demo Prediction Engine",
  };
}

function roadsFor(level: RiskLevel): string[] {
  if (level === "CRITICAL") return ["Bengali Square underpass", "MR-10 connector", "Ring Road East"];
  if (level === "HIGH") return ["Palasia service road", "Airport Road", "Mhow Naka link"];
  if (level === "MODERATE") return ["Rajwada market lane", "Annapurna main road"];
  return [];
}

function buildZones(): Zone[] {
  return zoneSeeds.map((seed) => {
    const prediction = predictFromInput({
      rainfall: currentRainfall,
      duration: currentDuration,
      elevation: seed.elevation,
      slope: seed.slope,
      drainageCapacity: seed.drainageCapacity,
      imperviousSurface: seed.imperviousSurface,
      historicalFloods: seed.historicalFloods,
    });
    return {
      ...seed,
      rainfall: currentRainfall,
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      factors: prediction.factors,
      affectedRoads: roadsFor(prediction.riskLevel),
    };
  });
}

function buildAlerts(zones: Zone[]): Alert[] {
  return zones
    .filter((zone) => zone.riskLevel === "CRITICAL" || zone.riskLevel === "HIGH")
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((zone) => ({
      id: `alert-${zone.id}`,
      zoneId: zone.id,
      zoneName: zone.name,
      level: zone.riskLevel === "CRITICAL" ? "CRITICAL" : "HIGH",
      riskScore: zone.riskScore,
      message:
        zone.riskLevel === "CRITICAL"
          ? "Heavy rainfall combined with limited drainage may increase localized flood risk."
          : "Monitor low points and drainage outlets as rainfall intensity builds.",
      createdAt: new Date("2026-09-25T08:45:00.000Z").toISOString(),
    }));
}

function buildStatistics(zones: Zone[], alerts: Alert[]): Statistics {
  return {
    rainfall: currentRainfall,
    duration: currentDuration,
    critical: zones.filter((zone) => zone.riskLevel === "CRITICAL").length,
    high: zones.filter((zone) => zone.riskLevel === "HIGH").length,
    moderate: zones.filter((zone) => zone.riskLevel === "MODERATE").length,
    low: zones.filter((zone) => zone.riskLevel === "LOW").length,
    reports: reports.length,
    activeAlerts: alerts.length,
    affectedRoads: new Set(zones.flatMap((zone) => zone.affectedRoads)).size,
  };
}

const router: IRouter = Router();

router.get("/zones", (_req, res) => {
  res.json(buildZones());
});

router.get("/zones/:zoneId", (req, res) => {
  const { zoneId } = GetZoneParams.parse(req.params);
  const zone = buildZones().find((item) => item.id === zoneId);
  if (!zone) {
    res.status(404).json({ error: "Zone not found" });
    return;
  }
  res.json(zone);
});

router.post("/predict", (req, res) => {
  const input = PredictRiskBody.parse(req.body);
  res.json(predictFromInput(input));
});

router.get("/reports", (_req, res) => {
  res.json([...reports].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)));
});

router.post("/reports", (req, res) => {
  const input = CreateReportBody.parse(req.body);
  const zone = buildZones().find((item) => item.id === input.zoneId);
  if (!zone) {
    res.status(400).json({ error: "Select a valid demo location." });
    return;
  }

  const report: Report = {
    id: `report-${Date.now()}`,
    zoneId: zone.id,
    zoneName: zone.name,
    waterLevel: input.waterLevel,
    description: input.description.replace(/[<>]/g, ""),
    photoName: input.photoName ?? null,
    status: "UNVERIFIED",
    reportedAt: new Date().toISOString(),
  };
  reports = [report, ...reports];
  res.status(201).json(report);
});

router.get("/alerts", (_req, res) => {
  res.json(buildAlerts(buildZones()));
});

router.get("/statistics", (_req, res) => {
  const zones = buildZones();
  res.json(buildStatistics(zones, buildAlerts(zones)));
});

router.post("/simulation", (req, res) => {
  const input = RunSimulationBody.parse(req.body);
  currentRainfall = input.rainfall;
  currentDuration = input.duration;
  const zones = buildZones();
  const alerts = buildAlerts(zones);
  const statistics = buildStatistics(zones, alerts);
  const result: SimulationResult = {
    ...statistics,
    zones,
    alerts,
    engine: "Demo Prediction Engine",
  };
  res.json(result);
});

export default router;