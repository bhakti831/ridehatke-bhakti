import { NextResponse } from 'next/server';

// Geocoding helper using Nominatim API (OpenStreetMap)
async function geocode(address: string) {
  try {
    // Append ", India" to make searches much more accurate for Indian cities
    const searchQuery = address.toLowerCase().includes("india") ? address : `${address}, India`;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
    }
  } catch (error) {
    console.error("Geocoding error", error);
  }
  return null;
}

// Fallback Haversine formula
function getDistance(coord1: [number, number], coord2: [number, number]) {
  const R = 6371; // Radius of the earth in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;  
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { pickup, dropoff } = body;

  const pickupCoords = await geocode(pickup) || [28.6139, 77.2090]; // Default New Delhi
  const dropoffCoords = await geocode(dropoff) || [28.4595, 77.0266]; // Default Gurugram

  let distanceKm = getDistance(pickupCoords as [number, number], dropoffCoords as [number, number]);
  
  // Simulate API pricing models based on actual road distance
  const basePrices = [
    { provider: "Uber", type: "UberGo", base: 50, perKm: 12, multiplier: 1.1 },
    { provider: "Uber", type: "UberXL", base: 80, perKm: 16, multiplier: 1.1 },
    { provider: "Ola", type: "Mini", base: 45, perKm: 11, multiplier: 1.0 },
    { provider: "Ola", type: "Prime", base: 60, perKm: 14, multiplier: 1.0 },
    { provider: "Rapido", type: "Bike", base: 20, perKm: 5, multiplier: 0.9 },
    { provider: "Rapido", type: "Auto", base: 30, perKm: 8, multiplier: 0.95 },
    { provider: "BluSmart", type: "Electric", base: 50, perKm: 13, multiplier: 1.05 }
  ];

  const results = basePrices.map((p, index) => {
    // Add some random surge pricing variance between 0.9 and 1.3
    const surge = 0.9 + (Math.random() * 0.4);
    const price = Math.round((p.base + (distanceKm * p.perKm)) * p.multiplier * surge);
    
    // Simulate ETA based on distance
    const etaMins = Math.max(2, Math.round(distanceKm * 0.5 + (Math.random() * 5)));

    return {
      id: index.toString(),
      provider: p.provider,
      type: p.type,
      price: price,
      eta: `${etaMins} min`
    };
  });

  // Sort by price
  results.sort((a, b) => a.price - b.price);

  return NextResponse.json({ 
    results,
    distanceKm: Math.round(distanceKm * 10) / 10
  });
}
