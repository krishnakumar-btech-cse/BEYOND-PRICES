import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';

export const seedMarketsAndStalls = async () => {
  try {
    // Check if we already have markets
    const marketsRef = collection(db, 'markets');
    const q = query(marketsRef, limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log("Data already exists, skipping seed.");
      return "Data already exists.";
    }

    console.log("Seeding markets...");
    const initialMarkets = [
      { name: "Azadpur Mandi", location: "Delhi", totalStalls: 50 },
      { name: "Vashi Mandi", location: "Mumbai", totalStalls: 40 },
      { name: "Ghazipur Mandi", location: "Delhi", totalStalls: 30 }
    ];

    // Standard slots for demo
    const slots = [
      { start: '07:00', end: '10:00' },
      { start: '10:00', end: '13:00' },
      { start: '13:00', end: '16:00' }
    ];

    const stallTypes = ['Standard', 'Cold Storage', 'Premium'];
    const stallSizes = ['10x10', '15x15', '20x20']; // Added stallSizes

    for (const m of initialMarkets) {
      const marketRef = await addDoc(collection(db, 'markets'), {
        name: m.name,
        location: m.location,
        totalStalls: m.totalStalls
      });
      const marketId = marketRef.id;

      // Seed stalls with slots
      console.log(`Adding stalls for ${m.name}...`);
      for (let i = 1; i <= m.totalStalls; i++) {
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const stall = { // Omit<MarketStall, 'id'> type is not defined here, using plain object
          marketId: marketId,
          number: i.toString().padStart(2, '0'),
          type: stallTypes[Math.floor(Math.random() * stallTypes.length)],
          size: stallSizes[Math.floor(Math.random() * stallSizes.length)],
          pricePerDay: 50 + Math.floor(Math.random() * 150),
          status: Math.random() > 0.4 ? 'available' : 'booked',
          slotTime: slot
        };
        await addDoc(collection(db, 'stalls'), stall);
      }
    }

    return "Seed successful!";
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};
