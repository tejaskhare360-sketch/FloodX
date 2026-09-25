import { CircleMarker, MapContainer, Popup, TileLayer, ZoomControl } from "react-leaflet";
import type { Report, Zone } from "@workspace/api-client-react";
import "leaflet/dist/leaflet.css";

function colorForRisk(level: Zone["riskLevel"]) {
  if (level === "CRITICAL") return "#ef6f66";
  if (level === "HIGH") return "#f5be4b";
  if (level === "MODERATE") return "#23bab0";
  return "#78c6a3";
}

export function LeafletRiskMap({
  zones,
  reports,
  selectedId,
  onSelect,
}: {
  zones: Zone[];
  reports: Report[];
  selectedId: string;
  onSelect: (zoneId: string) => void;
}) {
  return (
    <div className="relative h-[560px] overflow-hidden rounded-xl border border-sidebar-border bg-sidebar shadow-[var(--shadow-md)]">
      <MapContainer
        center={[22.7186, 75.8577]}
        zoom={12}
        zoomControl={false}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        {zones.map((zone) => {
          const color = colorForRisk(zone.riskLevel);
          return (
            <CircleMarker
              key={zone.id}
              center={[zone.latitude, zone.longitude]}
              radius={zone.id === selectedId ? 13 : 9}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.82,
                weight: zone.id === selectedId ? 4 : 2,
              }}
              eventHandlers={{ click: () => onSelect(zone.id) }}
            >
              <Popup>
                <div className="min-w-[170px] font-sans">
                  <strong>{zone.name}</strong>
                  <div className="mt-1 text-xs">
                    {zone.riskLevel} · {zone.riskScore}/100
                  </div>
                  <div className="mt-1 text-xs">
                    Rain {zone.rainfall} mm/hr · Drainage {zone.drainageCapacity}%
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        {reports.map((report) => {
          const zone = zones.find((item) => item.id === report.zoneId);
          if (!zone) return null;
          return (
            <CircleMarker
              key={report.id}
              center={[zone.latitude + 0.0012, zone.longitude + 0.0012]}
              radius={6}
              pathOptions={{
                color: "#1f2937",
                fillColor: "#111827",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[165px] font-sans">
                  <strong>Waterlogging report</strong>
                  <div className="mt-1 text-xs">
                    {report.zoneName} · {report.waterLevel} water
                  </div>
                  <div className="mt-1 text-xs text-slate-600">{report.status}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-lg border border-white/20 bg-slate-950/85 p-3 text-white shadow-lg">
        <div className="mono mb-2 text-[9px] uppercase tracking-widest text-teal-300">
          Indore / OpenStreetMap
        </div>
        <div className="space-y-1 text-[10px]">
          <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#78c6a3]" />Low</div>
          <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#23bab0]" />Moderate</div>
          <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#f5be4b]" />High</div>
          <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#ef6f66]" />Critical</div>
          <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-slate-900" />Citizen report</div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-[10px] text-white/75 shadow-lg">
        Demo coordinates · approximate zones, not official boundaries
      </div>
    </div>
  );
}