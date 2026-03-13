import { MarketStall, MarketNode } from '../types';

export const MOCK_MARKETS: MarketNode[] = [
  { id: 'm1', name: 'Azadpur Mandi', location: 'Delhi', capacity: 50 },
  { id: 'm2', name: 'Vashi Mandi', location: 'Mumbai', capacity: 40 },
  { id: 'm3', name: 'Ghazipur Mandi', location: 'Delhi', capacity: 30 },
  { id: 'm4', name: 'Villupuram Main Mandi', location: 'Tamil Nadu', capacity: 60 }
];

export const MOCK_STALLS: MarketStall[] = [];

// Generate deterministic mock stalls for each market
const stallTypes = ['Standard', 'Cold Storage', 'Premium'];
const stallSizes = ['10x10', '15x15', '20x20'];
const slots = [
  { start: '07:00', end: '10:00' },
  { start: '10:00', end: '13:00' },
  { start: '13:00', end: '16:00' }
];

MOCK_MARKETS.forEach(market => {
  for (let i = 1; i <= market.capacity; i++) {
    MOCK_STALLS.push({
      id: `s-${market.id}-${i}`,
      marketId: market.id,
      number: i.toString().padStart(2, '0'),
      type: stallTypes[i % stallTypes.length],
      size: stallSizes[i % stallSizes.length],
      pricePerDay: 50 + (i % 5) * 30,
      status: Math.random() > 0.3 ? 'available' : 'booked',
      slotTime: slots[i % slots.length]
    });
  }
});
