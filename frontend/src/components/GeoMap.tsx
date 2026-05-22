"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// MARCADOR EM PURE HTML COM VALORES NUMÉRICOS PREENCHIDOS E CORRIGIDOS
const redRadarIcon = L.divIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
      <!-- Efeito de pulso de radar vermelho ampliado -->
      <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background-color: #ef4444; opacity: 0.6; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <!-- Ponto central vermelho maior com borda branca -->
      <span style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background-color: #ef4444; border: 2px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);"></span>
    </div>
  `,
  className: "custom-marker-reset", // Remove estilos nativos quebrados do Leaflet
  iconSize: [20, 20],               // Tamanho da área do ícone principal
  iconAnchor: [10, 10],             // Centralização perfeita do marcador na coordenada [metade de 20]
});

interface IncidentPin {
  id: number;
  title: string;
  lat: number;
  lng: number;
  status: string;
}

export default function GeoMap({ incidents }: { incidents: IncidentPin[] }) {
  return (
    <MapContainer 
      center={[-5.0000, -60.0000]}  // Ajustado para enquadrar a Amazônia e o Centro-Oeste de forma centralizada
      zoom={5}                      // Nível de aproximação ideal para ver o relevo dos rios e reservas
      style={{ height: "100%", width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {incidents.map((inc) => (
        <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={redRadarIcon}>
          <Popup>
            <div className="text-stone-900 font-sans p-1">
              <h4 className="font-bold text-red-600">{inc.title}</h4>
              <p className="text-xs text-stone-600 mt-1">Status: <strong>{inc.status}</strong></p>
              <p className="text-[10px] text-stone-400 mt-0.5">ID Contrato: #{inc.id}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
