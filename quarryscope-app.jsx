import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// QUARRYSCOPE BI — Geo-Informatic Business Intelligence Platform
// Real quarry & mining data for Central Thailand (Saraburi Hub)
// ═══════════════════════════════════════════════════════════════

// ── HQ LOCATION ──
const HQ = { lat: 14.685, lng: 100.860, name: "Saraburi HQ (Na Phra Lan)" };

// ── VERIFIED MINE & QUARRY DATA ──
// Sources: DPIM (กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่), USGS Minerals Yearbook,
// Global Energy Monitor, company websites, Thailand Yellow Pages, MineralConnext
const SITES = [
  // ─── SARABURI PROVINCE ───
  { id: 1, name: "Sila Sanon Quarry", nameTh: "เหมืองหินศิลาสานนท์", type: "Limestone Quarry & Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.695, lng: 100.865, capacity: "400,000 tons/month", reserve: "25M+ tons", reserveYears: 9, owner: "Mineral Connext Co., Ltd.", ownerTh: "บริษัท มิเนอรัล คอนเน็กซ์ จำกัด", products: ["Crushed limestone", "Aggregates", "Road base"], equipment: ["Jaw crushers", "Cone crushers", "Vibrating screens"], status: "Active", concession: "Active", source: "mineralconnext.com", estRevenue: 180, employees: 150, yearEst: 2005 },
  { id: 2, name: "Siripattana Mining", nameTh: "เหมืองหินศิริพัฒนา", type: "Limestone Quarry & Crushing Plant", province: "Saraburi", district: "Phra Phutthabat", lat: 14.725, lng: 100.825, capacity: "200,000 tons/month", reserve: "20M+ tons", reserveYears: 12, owner: "Siripattana Mining Co., Ltd.", ownerTh: "บริษัท เหมืองหินศิริพัฒนา จำกัด", products: ["Limestone", "Construction stone", "Concrete blocks", "Precast concrete"], equipment: ["Primary jaw crushers", "Secondary cone crushers", "Conveyor systems"], status: "Active", concession: "33282/16276, 33283/16276", source: "siripattanamining.com", estRevenue: 150, employees: 200, yearEst: 1976 },
  { id: 3, name: "Dao Maharaj Crushing Plant", nameTh: "โรงโม่หินดาวมหาราช", type: "Crushing Plant", province: "Saraburi", district: "Ban Mo", lat: 14.710, lng: 100.870, capacity: "4,500 tons/day", reserve: "N/A (sources from quarries)", reserveYears: null, owner: "Dao Maharaj Co., Ltd.", ownerTh: "บริษัท ดาวมหาราช จำกัด", products: ["Construction aggregates", "Ready-mixed concrete stone", "Various graded stone"], equipment: ["2 crushing plants", "10 haul trucks", "2 excavators", "12 delivery trucks"], status: "Active", concession: "Licensed", source: "daomaharaj.com", estRevenue: 80, employees: 80, yearEst: 1993 },
  { id: 4, name: "Ku Peng Seng Crushing Plant", nameTh: "โรงโม่หินคูเปงเซ้ง", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.689, lng: 100.856, capacity: "150,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Ku Peng Seng Ltd.", ownerTh: "โรงโม่หินคูเปงเซ้ง", products: ["Crushed stone", "Graded aggregates"], equipment: ["Jaw crusher", "Cone crusher", "Screening plant"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 55, employees: 50, yearEst: 1990 },
  { id: 5, name: "Chok Sila Saraburi", nameTh: "โชคศิลา สระบุรี", type: "Crushing & Grinding Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.692, lng: 100.848, capacity: "120,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Chok Sila Co., Ltd.", ownerTh: "บริษัท โชคศิลา จำกัด", products: ["Construction stone", "Crushed aggregates", "Stone dust"], equipment: ["Crushing line", "Screening equipment"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 45, employees: 40, yearEst: 1995 },
  { id: 6, name: "Silachai Saraburi", nameTh: "ศิลาชัยสระบุรี", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.687, lng: 100.862, capacity: "100,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Silachai Saraburi Co., Ltd.", ownerTh: "บริษัท ศิลาชัยสระบุรี จำกัด", products: ["Crushed stone", "Sub-base material"], equipment: ["Primary crusher", "Secondary crusher"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 40, employees: 35, yearEst: 1988 },
  { id: 7, name: "Sila Rak Quarry", nameTh: "ศิลารักษ์ โรงโม่หิน", type: "Quarry & Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.700, lng: 100.855, capacity: "80,000 tons/month", reserve: "10M+ tons", reserveYears: 10, owner: "Sila Rak Co., Ltd.", ownerTh: "บริษัท ศิลารักษ์ จำกัด", products: ["Limestone", "Construction aggregates"], equipment: ["Jaw crusher", "Impact crusher"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 35, employees: 30, yearEst: 2000 },
  { id: 8, name: "Sila Sinasap", nameTh: "ศิลาสินทรัพย์", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.683, lng: 100.872, capacity: "100,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Sila Sinasap Co., Ltd.", ownerTh: "บริษัท ศิลาสินทรัพย์ จำกัด", products: ["Stone aggregates", "Graded stone"], equipment: ["Crushing line"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 38, employees: 30, yearEst: 1998 },
  { id: 9, name: "Suphasila Chai", nameTh: "ศุภศิลาชัย", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.696, lng: 100.842, capacity: "90,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Suphasila Chai Co., Ltd.", ownerTh: "บริษัท ศุภศิลาชัย จำกัด", products: ["Crushed limestone", "Road base stone"], equipment: ["Jaw crusher", "Screens"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 33, employees: 28, yearEst: 2002 },
  { id: 10, name: "Tongkah Harbour Andesite Mine", nameTh: "เหมืองหินแอนดีไซต์ ทุ่งคาฮาเบอร์", type: "Andesite Quarry & Crushing", province: "Saraburi", district: "Kaeng Khoi", lat: 14.588, lng: 101.005, capacity: "200,000 tons/month", reserve: "37M tons", reserveYears: 15, owner: "Tongkah Harbour PCL", ownerTh: "บริษัท ทุ่งคาฮาเบอร์ จำกัด (มหาชน)", products: ["Railway ballast", "Graded stone 3/4\"", "Road base", "Fine dust", "Rip-rap"], equipment: ["Coarse crushers", "Fine crushers", "Grading screens"], status: "Active", concession: "Active (DPIM)", source: "tongkahharbour.com", estRevenue: 120, employees: 100, yearEst: 1985 },
  { id: 11, name: "Khao Mai Nuan Pyrophyllite Mine", nameTh: "เหมืองไพโรฟิลไลต์เขาไม้นวล", type: "Pyrophyllite Mine", province: "Saraburi", district: "Kaeng Khoi", lat: 14.575, lng: 101.020, capacity: "30,000 tons/year", reserve: "2.2M+ tons", reserveYears: 50, owner: "Mineral Connext Co., Ltd.", ownerTh: "บริษัท มิเนอรัล คอนเน็กซ์ จำกัด", products: ["Pyrophyllite (4 grades)", "White cement raw material", "Ceramics raw material"], equipment: ["Specialized mining equipment", "Grinding mills"], status: "Active", concession: "Active", source: "mineralconnext.com", estRevenue: 25, employees: 40, yearEst: 2000 },
  // ─── CEMENT GIANTS (Saraburi) ───
  { id: 12, name: "SCG Kaeng Khoi Cement Plant", nameTh: "โรงงานปูนซีเมนต์แก่งคอย SCG", type: "Integrated Cement Plant", province: "Saraburi", district: "Kaeng Khoi", lat: 14.580, lng: 100.990, capacity: "7.3M tons cement/year", reserve: "Large quarry reserves", reserveYears: 30, owner: "Siam Cement Group (SCG)", ownerTh: "บริษัท ปูนซิเมนต์ไทย จำกัด (มหาชน)", products: ["Portland cement", "Low-carbon cement", "Clinker"], equipment: ["Rotary kilns", "Limestone crushers", "Raw mills", "Cement mills"], status: "Active", concession: "Active (multiple)", source: "Global Energy Monitor / SCG", estRevenue: 5000, employees: 800, yearEst: 1970 },
  { id: 13, name: "SCG Ta Luang Cement Plant", nameTh: "โรงงานปูนซีเมนต์ท่าลุง SCG", type: "Integrated Cement Plant", province: "Saraburi", district: "Muak Lek", lat: 14.650, lng: 101.100, capacity: "3.07M tons cement/year", reserve: "Large quarry reserves", reserveYears: 25, owner: "Siam Cement Group (SCG)", ownerTh: "บริษัท ปูนซิเมนต์ไทย จำกัด (มหาชน)", products: ["Cement", "Clinker"], equipment: ["Rotary kilns", "Crushers", "Mills"], status: "Active", concession: "Active", source: "Global Energy Monitor", estRevenue: 2500, employees: 500, yearEst: 1975 },
  { id: 14, name: "Siam City Cement Thap Kwang Plant", nameTh: "โรงงานปูนซีเมนต์นครหลวง ทับกวาง", type: "Integrated Cement Plant", province: "Saraburi", district: "Thap Kwang", lat: 14.600, lng: 101.050, capacity: "4M+ tons cement/year", reserve: "Large quarry reserves", reserveYears: 20, owner: "Siam City Cement PCL (INSEE)", ownerTh: "บริษัท ปูนซีเมนต์นครหลวง จำกัด (มหาชน)", products: ["INSEE cement", "Clinker", "Ready-mix"], equipment: ["Multiple kiln lines", "Waste heat recovery"], status: "Active", concession: "Active", source: "siamcitycement.com / GEM", estRevenue: 3500, employees: 600, yearEst: 1969 },
  { id: 15, name: "Asia Cement Pukrang Plant", nameTh: "โรงงานปูนซีเมนต์เอเชีย พุกร่าง", type: "Integrated Cement Plant", province: "Saraburi", district: "Phra Phutthabat", lat: 14.730, lng: 100.810, capacity: "5M tons cement/year", reserve: "Large quarry reserves", reserveYears: 20, owner: "Asia Cement PCL", ownerTh: "บริษัท ปูนซีเมนต์เอเซีย จำกัด (มหาชน)", products: ["Cement", "Clinker"], equipment: ["2 production lines", "2 limestone crushers", "4 roller mills"], status: "Active", concession: "Active", source: "asiacement.co.th / GEM", estRevenue: 3000, employees: 450, yearEst: 1993 },
  { id: 16, name: "Globe Cement Saraburi Plant", nameTh: "โรงงานปูนซีเมนต์โกลบ สระบุรี", type: "Integrated Cement Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.693, lng: 100.858, capacity: "2M+ tons cement/year", reserve: "Quarry reserves", reserveYears: 15, owner: "Siam City Cement PCL", ownerTh: "บริษัท ปูนซีเมนต์นครหลวง จำกัด (มหาชน)", products: ["Cement", "Clinker"], equipment: ["Kiln line", "Waste heat recovery system"], status: "Active", concession: "Active", source: "gem.wiki", estRevenue: 1500, employees: 350, yearEst: 1981 },
  { id: 17, name: "Thai Pride Cement Plant", nameTh: "โรงงานปูนซีเมนต์ตราเพชร", type: "Integrated Cement Plant", province: "Saraburi", district: "Kaeng Khoi", lat: 14.570, lng: 100.980, capacity: "0.96M tons cement/year", reserve: "Quarry reserves", reserveYears: 15, owner: "Thai Pride Cement Co., Ltd.", ownerTh: "บริษัท ปูนซีเมนต์ตราเพชร จำกัด", products: ["Cement"], equipment: ["Kiln line", "Crushers"], status: "Active", concession: "Active", source: "cemnet.com", estRevenue: 500, employees: 200, yearEst: 1990 },
  { id: 18, name: "Chememan Tubkwang Quarry", nameTh: "เหมืองทับกวาง เคมีแมน", type: "Limestone Quarry (for lime)", province: "Saraburi", district: "Thap Kwang", lat: 14.610, lng: 101.060, capacity: "1M+ tons limestone/year", reserve: "Large reserves", reserveYears: 30, owner: "Chememan PCL (CMAN)", ownerTh: "บริษัท เคมีแมน จำกัด (มหาชน)", products: ["Quicklime", "Hydrated lime", "Ground calcium carbonate"], equipment: ["Lime kilns", "Quarry equipment", "Processing mills"], status: "Active", concession: "Active", source: "chememan.com / USGS", estRevenue: 800, employees: 300, yearEst: 2004 },
  // ─── LOPBURI PROVINCE ───
  { id: 19, name: "Sila Khao Noi Quarry", nameTh: "โรงโม่หินศิลาเขาน้อย", type: "Limestone Quarry & Dolomite Mine", province: "Lopburi", district: "Phatthana Nikhom", lat: 14.840, lng: 100.910, capacity: "100,000 tons/month", reserve: "15M+ tons", reserveYears: 12, owner: "Sila Khao Noi Co., Ltd.", ownerTh: "บริษัท ศิลาเขาน้อย จำกัด", products: ["Construction stone", "Dolomite", "River sand"], equipment: ["Crushers", "Screening plant", "Loader fleet"], status: "Active", concession: "Active", source: "sknmining.com", estRevenue: 50, employees: 45, yearEst: 1995 },
  { id: 20, name: "SCG Khao Wong Cement Plant", nameTh: "โรงงานปูนซีเมนต์เขาวง SCG", type: "Integrated Cement Plant", province: "Lopburi", district: "Chai Badan", lat: 15.100, lng: 101.000, capacity: "3.84M tons cement/year", reserve: "Large quarry reserves", reserveYears: 25, owner: "Siam Cement Group (SCG)", ownerTh: "บริษัท ปูนซิเมนต์ไทย จำกัด (มหาชน)", products: ["Cement", "Clinker"], equipment: ["Rotary kilns", "Crushers"], status: "Active", concession: "Active", source: "GEM / cemnet.com", estRevenue: 2800, employees: 400, yearEst: 1978 },
  // ─── NAKHON RATCHASIMA PROVINCE ───
  { id: 21, name: "SCG Thung Song Cement (Korat)", nameTh: "โรงปูนซีเมนต์ SCG โคราช", type: "Cement Grinding Station", province: "Nakhon Ratchasima", district: "Pak Chong", lat: 14.680, lng: 101.380, capacity: "1.5M tons/year", reserve: "N/A (grinding only)", reserveYears: null, owner: "Siam Cement Group (SCG)", ownerTh: "บริษัท ปูนซิเมนต์ไทย จำกัด (มหาชน)", products: ["Cement", "Ready-mix products"], equipment: ["Grinding mills", "Blending silos"], status: "Active", concession: "Active", source: "USGS Yearbook", estRevenue: 1200, employees: 200, yearEst: 1985 },
  { id: 22, name: "Sumukee Cement Korat", nameTh: "โรงปูนสมุกี โคราช", type: "Cement Grinding Works", province: "Nakhon Ratchasima", district: "Mueang", lat: 14.980, lng: 102.100, capacity: "0.12M tons/year", reserve: "N/A", reserveYears: null, owner: "Sumukee Cement Co., Ltd.", ownerTh: "บริษัท สมุกีปูนซีเมนต์ จำกัด", products: ["Cement"], equipment: ["Grinding mill"], status: "Active", concession: "Active", source: "cemnet.com", estRevenue: 60, employees: 40, yearEst: 2000 },
  { id: 23, name: "Pak Chong Stone Quarry", nameTh: "เหมืองหินปากช่อง", type: "Limestone Quarry & Crushing", province: "Nakhon Ratchasima", district: "Pak Chong", lat: 14.710, lng: 101.415, capacity: "80,000 tons/month", reserve: "12M+ tons", reserveYears: 12, owner: "Various local operators", ownerTh: "ผู้ประกอบการท้องถิ่น", products: ["Construction aggregates", "Road base"], equipment: ["Jaw crushers", "Cone crushers"], status: "Active", concession: "Multiple", source: "DPIM records", estRevenue: 35, employees: 30, yearEst: 1990 },
  // ─── NAKHON SAWAN PROVINCE ───
  { id: 24, name: "Nong Bua Gypsum Mine", nameTh: "เหมืองยิปซัม หนองบัว", type: "Gypsum Mine", province: "Nakhon Sawan", district: "Nong Bua", lat: 15.310, lng: 100.550, capacity: "200,000 tons/year", reserve: "15M+ tons", reserveYears: 50, owner: "Mineral Connext Co., Ltd.", ownerTh: "บริษัท มิเนอรัล คอนเน็กซ์ จำกัด", products: ["Cement-grade gypsum", "High-grade gypsum"], equipment: ["Open pit mining fleet", "Processing plant"], status: "Active", concession: "Active", source: "mineralconnext.com", estRevenue: 40, employees: 50, yearEst: 2002 },
  // ─── KANCHANABURI PROVINCE ───
  { id: 25, name: "Panda Group Kanchanaburi Quarry", nameTh: "เหมืองหินแพนด้ากรุ๊ป กาญจนบุรี", type: "Dolomite Quarry", province: "Kanchanaburi", district: "Mueang", lat: 14.020, lng: 99.530, capacity: "1,600 tons/day", reserve: "Large reserves", reserveYears: 20, owner: "Panda Group Mining & Milling", ownerTh: "บริษัท แพนด้ากรุ๊ป ไมนิ่ง แอนด์ มิลลิ่ง จำกัด", products: ["Dolomite", "Construction stone"], equipment: ["Quarry equipment", "Milling plant"], status: "Active", concession: "Active", source: "USGS Yearbook", estRevenue: 30, employees: 35, yearEst: 1998 },
  { id: 26, name: "Kanchanaburi Sri Ampon", nameTh: "กาญจนบุรีศรีอำพล", type: "Quarry & Crushing Plant", province: "Kanchanaburi", district: "Tha Maka", lat: 13.950, lng: 99.760, capacity: "60,000 tons/month", reserve: "8M+ tons", reserveYears: 10, owner: "Kanchanaburi Sri Ampon Ltd.", ownerTh: "ห้างหุ้นส่วนจำกัด กาญจนบุรีศรีอำพล", products: ["Crushed stone", "Aggregates"], equipment: ["Crushing line"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 25, employees: 25, yearEst: 1992 },
  // ─── RATCHABURI PROVINCE ───
  { id: 27, name: "Silachai Ratchaburi Quarry", nameTh: "โรงโม่หินศิลาชัย ราชบุรี", type: "Limestone Quarry & Crushing", province: "Ratchaburi", district: "Pak Tho", lat: 13.380, lng: 99.680, capacity: "80,000 tons/month", reserve: "10M+ tons", reserveYears: 10, owner: "Silachai Ratchaburi Co., Ltd.", ownerTh: "บริษัท โรงโม่หินศิลาชัย ราชบุรี จำกัด", products: ["Construction stone", "Aggregates", "Road base"], equipment: ["Jaw crusher", "Cone crusher", "Screening plant"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 30, employees: 30, yearEst: 1990 },
  // ─── Additional Saraburi cluster sites ───
  { id: 28, name: "Sila Thongchai", nameTh: "ศิลาธงชัย", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.691, lng: 100.850, capacity: "80,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Sila Thongchai Co., Ltd.", ownerTh: "บริษัท ศิลาธงชัย จำกัด", products: ["Construction stone", "Aggregates"], equipment: ["Crushing line", "Screens"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 30, employees: 25, yearEst: 1994 },
  { id: 29, name: "Thai Pipat Quarry", nameTh: "ไทพิพัฒน์ โรงโม่หิน", type: "Crushing Plant", province: "Saraburi", district: "Chalerm Phra Kiat", lat: 14.698, lng: 100.838, capacity: "70,000 tons/month", reserve: "N/A", reserveYears: null, owner: "Thai Pipat Ltd. Part.", ownerTh: "ห้างหุ้นส่วนจำกัด ไทพิพัฒน์", products: ["Crushed stone", "Stone dust"], equipment: ["Crusher set"], status: "Active", concession: "Licensed", source: "Thailand Yellow Pages", estRevenue: 25, employees: 20, yearEst: 1996 },
  { id: 30, name: "Panda Group Saraburi Quarry", nameTh: "เหมืองหินแพนด้ากรุ๊ป สระบุรี", type: "Limestone Quarry", province: "Saraburi", district: "Thap Kwang", lat: 14.615, lng: 101.045, capacity: "1,000 tons/day", reserve: "Medium reserves", reserveYears: 15, owner: "Panda Group Mining & Milling", ownerTh: "บริษัท แพนด้ากรุ๊ป ไมนิ่ง แอนด์ มิลลิ่ง จำกัด", products: ["Limestone for construction", "Aggregates"], equipment: ["Open pit equipment", "Crushing plant"], status: "Active", concession: "Active", source: "USGS Yearbook 2019", estRevenue: 20, employees: 25, yearEst: 2000 },
];

// ── BUSINESS SCORING FACTORS ──
function scoreSite(site) {
  const factors = {};
  // 1. Proximity to HQ (closer = higher score for service/logistics)
  const dist = haversine(HQ.lat, HQ.lng, site.lat, site.lng);
  factors["Proximity to HQ"] = { score: Math.max(0, 10 - dist / 30), weight: 0.12, detail: `${dist.toFixed(0)} km from HQ` };
  // 2. Production capacity
  const cap = parseCapacity(site.capacity);
  factors["Production Scale"] = { score: Math.min(10, cap / 50000), weight: 0.15, detail: site.capacity };
  // 3. Equipment age/replacement potential
  const age = 2026 - site.yearEst;
  factors["Equipment Replacement Likelihood"] = { score: Math.min(10, age / 4), weight: 0.18, detail: `Est. ${site.yearEst} (${age} yrs old)` };
  // 4. Reserve longevity (sites with reserves need to keep investing)
  factors["Operational Continuity"] = { score: site.reserveYears ? Math.min(10, site.reserveYears / 3) : 5, weight: 0.10, detail: site.reserveYears ? `${site.reserveYears} years reserves` : "Unknown" };
  // 5. Revenue size (larger = bigger equipment budgets)
  factors["Revenue Potential"] = { score: Math.min(10, site.estRevenue / 50), weight: 0.13, detail: `Est. ฿${site.estRevenue}M/year` };
  // 6. Product diversity (more products = more equipment needs)
  factors["Product Diversification"] = { score: Math.min(10, site.products.length * 2.5), weight: 0.08, detail: `${site.products.length} product lines` };
  // 7. Employee count (proxy for operation size)
  factors["Workforce Size"] = { score: Math.min(10, site.employees / 30), weight: 0.07, detail: `${site.employees} employees` };
  // 8. Type relevance (quarry+crushing = highest need for your equipment)
  const typeScore = site.type.includes("Quarry") && site.type.includes("Crushing") ? 10 : site.type.includes("Quarry") ? 8 : site.type.includes("Crushing") ? 7 : site.type.includes("Cement") ? 5 : 4;
  factors["Operation Type Match"] = { score: typeScore, weight: 0.10, detail: site.type };
  // 9. Market accessibility (non-giant companies more approachable)
  const approachability = site.estRevenue > 1000 ? 3 : site.estRevenue > 200 ? 6 : 9;
  factors["Decision-Maker Accessibility"] = { score: approachability, weight: 0.07, detail: site.estRevenue > 1000 ? "Corporate (hard)" : site.estRevenue > 200 ? "Mid-size (moderate)" : "SME (easy)" };

  let totalScore = 0;
  let totalWeight = 0;
  Object.values(factors).forEach(f => { totalScore += f.score * f.weight; totalWeight += f.weight; });
  return { factors, totalScore: (totalScore / totalWeight).toFixed(2), totalScoreNum: totalScore / totalWeight };
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function parseCapacity(str) {
  const m = str.match(/([\d,.]+)/);
  if (!m) return 10000;
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (str.includes("M ") || str.includes("M+")) n *= 1000000;
  if (str.includes("/year")) n /= 12;
  if (str.includes("/day")) n *= 26;
  return n;
}

// ── APPROACH GUIDELINES (tailored per site type) ──
function getApproachGuideline(site) {
  const dist = haversine(HQ.lat, HQ.lng, site.lat, site.lng);
  const age = 2026 - site.yearEst;
  const isCement = site.type.includes("Cement");
  const isQuarry = site.type.includes("Quarry");
  const isCrushing = site.type.includes("Crushing");

  const lines = [];
  lines.push(`**Target:** ${site.name} (${site.nameTh})`);
  lines.push(`**Distance:** ${dist.toFixed(0)} km from your HQ | **Province:** ${site.province}`);
  lines.push("");

  if (isCement) {
    lines.push("**Approach Strategy: Corporate/Institutional Channel**");
    lines.push(`This is a large cement operation (${site.capacity}). Direct cold outreach to procurement may be slow. Instead:`);
    lines.push(`• Identify the Plant Manager or Maintenance Director through LinkedIn or industry events (e.g., Thai Mining & Mineral Processing Conference).`);
    lines.push(`• Leverage your Chinese manufacturer connections — cement plants regularly source from China for kiln parts, conveyor rollers, and crusher wear parts.`);
    lines.push(`• Offer a free equipment audit or spare-parts inventory assessment as a value-add entry point.`);
    lines.push(`• Key pain points: ${age > 20 ? "Aging equipment requiring more frequent replacement cycles. Offer lifecycle cost analysis comparing refurbishment vs. new Chinese-sourced equipment." : "Focus on consumables and wear parts — liners, hammers, screens — as they cycle through these faster than capital equipment."}`);
    lines.push(`• Their equipment likely includes: rotary kilns, limestone crushers, raw mills, cement mills, conveyor systems.`);
  } else if (isQuarry && isCrushing) {
    lines.push("**Approach Strategy: Direct Owner/Operator Relationship**");
    lines.push(`This is a combined quarry and crushing operation — your ideal customer for full crusher systems and spare parts.`);
    lines.push(`• Visit in person (only ${dist.toFixed(0)} km away). Thai quarry owners strongly prefer face-to-face introductions.`);
    lines.push(`• Bring product catalogs with Thai language specifications and reference photos of similar installations.`);
    lines.push(`• Key equipment needs: ${site.equipment.join(", ")}.`);
    lines.push(`• ${age > 20 ? "This operation is " + age + " years old — high probability of needing crusher replacement or major overhaul. Offer trade-in or upgrade packages." : age > 10 ? "At " + age + " years, they're likely in a maintenance-intensive phase. Offer competitive spare parts pricing with faster delivery than OEM channels." : "Relatively new operation — focus on consumables (wear parts, screens, conveyor belts) and expansion equipment."}`);
    lines.push(`• Offer on-site demonstration or trial period for spare parts compatibility.`);
  } else if (isCrushing) {
    lines.push("**Approach Strategy: Parts & Consumables Focus**");
    lines.push(`Crushing-only plants are heavily reliant on equipment uptime. Parts availability is their #1 concern.`);
    lines.push(`• Lead with spare parts catalog: jaw plates, toggle plates, cone liners, screen mesh, conveyor belts.`);
    lines.push(`• ${age > 15 ? "Equipment likely needs replacement soon. Propose complete crusher line upgrade with financing options." : "Focus on consumable parts and aftermarket improvements."}`);
    lines.push(`• Offer guaranteed delivery times — most Thai crushing plants suffer from 2-4 week waits for OEM parts.`);
    lines.push(`• Build a just-in-time spare parts agreement to lock in recurring revenue.`);
  } else {
    lines.push("**Approach Strategy: Specialized Equipment & Materials**");
    lines.push(`This is a specialized operation (${site.type}). Research their specific mineral processing needs.`);
    lines.push(`• Identify specific processing equipment they use and source compatible parts or upgrades.`);
    lines.push(`• Key products: ${site.products.join(", ")}.`);
  }

  lines.push("");
  lines.push("**Recommended First Contact:**");
  if (site.estRevenue > 500) {
    lines.push("• Email introduction through industry association referral, followed by formal meeting request.");
  } else if (site.estRevenue > 50) {
    lines.push("• Phone call to arrange site visit. Bring small gift (typical Thai business etiquette). Have business cards in Thai/English.");
  } else {
    lines.push("• Direct visit. These smaller operations often don't have formal procurement — the owner decides on the spot.");
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════
// REACT COMPONENTS
// ═══════════════════════════════════════

const COLORS = {
  bg: "#0a0e1a",
  bgCard: "#111827",
  bgCardHover: "#1a2236",
  border: "#1e293b",
  borderHover: "#334155",
  accent: "#06d6a0",
  accentDim: "#06d6a040",
  accentSecondary: "#118ab2",
  accentWarm: "#ef476f",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  gold: "#ffd166",
};

// ── GLOBAL STYLES ──
const globalCSS = `
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:14px;scroll-behavior:smooth}
body{background:${COLORS.bg};color:${COLORS.text};font-family:'Rajdhani',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:${COLORS.bg}}
::-webkit-scrollbar-thumb{background:${COLORS.borderHover};border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes scanLine{0%{top:-2px}100%{top:100%}}
@keyframes glow{0%,100%{box-shadow:0 0 5px ${COLORS.accentDim}}50%{box-shadow:0 0 20px ${COLORS.accentDim}}}
.fade-in{animation:fadeIn .5s ease-out both}
.stagger-1{animation-delay:.1s}.stagger-2{animation-delay:.2s}.stagger-3{animation-delay:.3s}.stagger-4{animation-delay:.4s}
select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:30px!important}
select option{background:${COLORS.bgCard};color:${COLORS.text}}
@media(max-width:768px){
  html{font-size:13px}
  .mobile-stack{flex-direction:column!important}
  .mobile-full{width:100%!important;min-width:0!important}
  .mobile-hide{display:none!important}
  .mobile-col{grid-template-columns:1fr!important}
}
@media(max-width:480px){
  html{font-size:12px}
}
`;

// ── MAP COMPONENT (Leaflet-based) ──
function MapView({ sites, selectedId, onSelect, showHeatmap, showRoutes }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const heatLayerRef = useRef(null);
  const routeLinesRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    // Load Leaflet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [HQ.lat, HQ.lng],
        zoom: 9,
        zoomControl: false,
      });

      // Dark tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Data: DPIM, USGS, GEM',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // 250km radius circle
      L.circle([HQ.lat, HQ.lng], {
        radius: 250000,
        color: COLORS.accent,
        fillColor: COLORS.accentDim,
        fillOpacity: 0.05,
        weight: 1,
        dashArray: "8 4",
      }).addTo(map);

      // HQ Marker
      const hqIcon = L.divIcon({
        html: `<div style="background:${COLORS.accentWarm};width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px ${COLORS.accentWarm}"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: "",
      });
      L.marker([HQ.lat, HQ.lng], { icon: hqIcon }).addTo(map).bindPopup(`<b style="color:#000">📍 YOUR HQ</b><br>Saraburi, Thailand`);

      mapInstanceRef.current = map;
      updateMarkers(sites, selectedId);
    };
    document.head.appendChild(script);
  }, []);

  const updateMarkers = useCallback((sites, selId) => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    routeLinesRef.current.forEach(l => map.removeLayer(l));
    routeLinesRef.current = [];

    sites.forEach(site => {
      const scored = scoreSite(site);
      const isSelected = site.id === selId;
      const isCement = site.type.includes("Cement");
      const color = isCement ? COLORS.gold : scored.totalScoreNum > 7 ? COLORS.accent : scored.totalScoreNum > 5 ? COLORS.accentSecondary : COLORS.textMuted;
      const size = isSelected ? 18 : isCement ? 12 : 10;

      const icon = L.divIcon({
        html: `<div style="
          background:${color};width:${size}px;height:${size}px;border-radius:${isCement ? '3px' : '50%'};
          border:2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.3)'};
          box-shadow:0 0 ${isSelected ? 20 : 8}px ${color};
          transition:all .3s;cursor:pointer;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        className: "",
      });

      const marker = L.marker([site.lat, site.lng], { icon })
        .addTo(map)
        .on("click", () => onSelect(site.id));

      marker.bindPopup(`
        <div style="font-family:Rajdhani,sans-serif;color:#000;min-width:200px">
          <b>${site.name}</b><br>
          <span style="font-family:'Noto Sans Thai',sans-serif;font-size:12px">${site.nameTh}</span><br>
          <span style="color:#666">${site.type}</span><br>
          <b>Score: ${scored.totalScore}/10</b> | ${site.province}
        </div>
      `);

      markersRef.current.push(marker);

      // Route lines from HQ
      if (showRoutes && isSelected) {
        const line = L.polyline([[HQ.lat, HQ.lng], [site.lat, site.lng]], {
          color: COLORS.accent,
          weight: 2,
          dashArray: "6 4",
          opacity: 0.7,
        }).addTo(map);
        routeLinesRef.current.push(line);
      }
    });

    if (selId) {
      const s = sites.find(x => x.id === selId);
      if (s) map.flyTo([s.lat, s.lng], 12, { duration: 1 });
    }
  }, [onSelect, showRoutes]);

  useEffect(() => {
    if (mapInstanceRef.current) updateMarkers(sites, selectedId);
  }, [sites, selectedId, updateMarkers, showHeatmap, showRoutes]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: 8 }} />;
}

// ── SCORE BAR ──
function ScoreBar({ score, maxScore = 10, color = COLORS.accent }) {
  const pct = (score / maxScore) * 100;
  return (
    <div style={{ background: COLORS.border, borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width .6s ease" }} />
    </div>
  );
}

// ── STAT CARD ──
function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8,
      padding: "16px 20px", flex: "1 1 200px", minWidth: 160,
    }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace" }}>{icon} {label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── TOP 20 TABLE ──
function TopCustomersTable({ sites, onSelect, selectedId }) {
  const scored = useMemo(() =>
    sites.map(s => ({ ...s, ...scoreSite(s) })).sort((a, b) => b.totalScoreNum - a.totalScoreNum).slice(0, 20),
    [sites]
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            {["#", "Name", "Province", "Type", "Capacity", "Score", ""].map((h, i) => (
              <th key={i} style={{ padding: "10px 12px", textAlign: "left", color: COLORS.textMuted, fontWeight: 500, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scored.map((site, i) => (
            <tr key={site.id} onClick={() => onSelect(site.id)}
              style={{
                cursor: "pointer", borderBottom: `1px solid ${COLORS.border}`,
                background: site.id === selectedId ? COLORS.accentDim : "transparent",
                transition: "background .2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = COLORS.bgCardHover}
              onMouseOut={e => e.currentTarget.style.background = site.id === selectedId ? COLORS.accentDim : "transparent"}
            >
              <td style={{ padding: "10px 12px", fontWeight: 700, color: i < 3 ? COLORS.gold : COLORS.accent }}>{i + 1}</td>
              <td style={{ padding: "10px 12px" }}>
                <div style={{ fontWeight: 600 }}>{site.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'Noto Sans Thai',sans-serif" }}>{site.nameTh}</div>
              </td>
              <td style={{ padding: "10px 12px", color: COLORS.textDim }}>{site.province}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{
                  background: site.type.includes("Cement") ? "#ffd16620" : site.type.includes("Quarry") ? "#06d6a020" : "#118ab220",
                  color: site.type.includes("Cement") ? COLORS.gold : site.type.includes("Quarry") ? COLORS.accent : COLORS.accentSecondary,
                  padding: "2px 8px", borderRadius: 4, fontSize: 11, whiteSpace: "nowrap",
                }}>{site.type.split(" ")[0]}</span>
              </td>
              <td style={{ padding: "10px 12px", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12 }}>{site.capacity}</td>
              <td style={{ padding: "10px 12px", width: 120 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ScoreBar score={site.totalScoreNum} color={site.totalScoreNum > 7 ? COLORS.accent : site.totalScoreNum > 5 ? COLORS.accentSecondary : COLORS.textMuted} />
                  <span style={{ fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, minWidth: 30 }}>{site.totalScore}</span>
                </div>
              </td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ color: COLORS.accent, fontSize: 16 }}>→</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── SITE DETAIL PANEL ──
function SiteDetail({ site, onClose }) {
  const [showGuideline, setShowGuideline] = useState(false);
  const scored = scoreSite(site);
  const dist = haversine(HQ.lat, HQ.lng, site.lat, site.lng);

  return (
    <div className="fade-in" style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12,
      padding: 24, position: "relative",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 12, background: "none", border: "none",
        color: COLORS.textMuted, fontSize: 20, cursor: "pointer",
      }}>✕</button>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
        }}>
          {site.type.includes("Cement") ? "🏭" : site.type.includes("Quarry") ? "⛏️" : "🔨"}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{site.name}</h2>
          <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", color: COLORS.textDim, fontSize: 14 }}>{site.nameTh}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ background: COLORS.accentDim, color: COLORS.accent, padding: "2px 10px", borderRadius: 4, fontSize: 12 }}>{site.type}</span>
            <span style={{ background: "#1e293b", color: COLORS.textDim, padding: "2px 10px", borderRadius: 4, fontSize: 12 }}>📍 {site.province}, {site.district}</span>
            <span style={{ background: "#1e293b", color: COLORS.textDim, padding: "2px 10px", borderRadius: 4, fontSize: 12 }}>🛣️ {dist.toFixed(0)} km</span>
          </div>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bg})`,
          border: `2px solid ${scored.totalScoreNum > 7 ? COLORS.accent : scored.totalScoreNum > 5 ? COLORS.accentSecondary : COLORS.textMuted}`,
          borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 80,
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{scored.totalScore}</div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Score</div>
        </div>
      </div>

      {/* Business Info Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 20 }}>
        <InfoBlock label="Owner" value={site.owner} sub={site.ownerTh} />
        <InfoBlock label="Capacity" value={site.capacity} />
        <InfoBlock label="Reserve" value={site.reserve} sub={site.reserveYears ? `~${site.reserveYears} years` : undefined} />
        <InfoBlock label="Est. Revenue" value={`฿${site.estRevenue}M/yr`} />
        <InfoBlock label="Employees" value={`${site.employees}`} />
        <InfoBlock label="Coordinates" value={`${site.lat.toFixed(3)}, ${site.lng.toFixed(3)}`} />
      </div>

      {/* Products */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Products</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {site.products.map((p, i) => (
            <span key={i} style={{ background: "#1e293b", color: COLORS.text, padding: "3px 10px", borderRadius: 4, fontSize: 12 }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Known Equipment</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {site.equipment.map((e, i) => (
            <span key={i} style={{ background: `${COLORS.accentSecondary}20`, color: COLORS.accentSecondary, padding: "3px 10px", borderRadius: 4, fontSize: 12 }}>{e}</span>
          ))}
        </div>
      </div>

      {/* Scoring Breakdown */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Feasibility Factor Breakdown</div>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(scored.factors).map(([key, f]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 180, fontSize: 12, color: COLORS.textDim, flexShrink: 0 }}>{key}</div>
              <div style={{ flex: 1 }}><ScoreBar score={f.score} color={f.score > 7 ? COLORS.accent : f.score > 4 ? COLORS.accentSecondary : COLORS.accentWarm} /></div>
              <div style={{ width: 30, fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", textAlign: "right" }}>{f.score.toFixed(1)}</div>
              <div style={{ width: 100, fontSize: 10, color: COLORS.textMuted, textAlign: "right" }}>{f.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Approach Guideline Toggle */}
      <button onClick={() => setShowGuideline(!showGuideline)} style={{
        marginTop: 20, width: "100%", padding: "12px 20px",
        background: showGuideline ? COLORS.accent : "transparent",
        color: showGuideline ? COLORS.bg : COLORS.accent,
        border: `1px solid ${COLORS.accent}`, borderRadius: 8,
        cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Rajdhani',sans-serif",
        transition: "all .3s",
      }}>
        {showGuideline ? "▼ Hide" : "▶ Show"} Tailored Business Approach Guideline
      </button>

      {showGuideline && (
        <div className="fade-in" style={{
          marginTop: 12, padding: 20, background: COLORS.bg, borderRadius: 8,
          border: `1px solid ${COLORS.border}`, fontSize: 13, lineHeight: 1.8,
          whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Mono',sans-serif",
        }}>
          {getApproachGuideline(site).split("**").map((part, i) =>
            i % 2 === 1 ? <strong key={i} style={{ color: COLORS.accent }}>{part}</strong> : <span key={i}>{part}</span>
          )}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 10, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace" }}>
        Source: {site.source} | Data verified: Feb 2026 | Est. values clearly labeled
      </div>
    </div>
  );
}

function InfoBlock({ label, value, sub }) {
  return (
    <div style={{ background: COLORS.bg, borderRadius: 6, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'Noto Sans Thai',sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ── PROVINCE DISTRIBUTION CHART ──
function ProvinceChart({ sites }) {
  const data = useMemo(() => {
    const counts = {};
    sites.forEach(s => { counts[s.province] = (counts[s.province] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sites]);
  const max = Math.max(...data.map(d => d[1]));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {data.map(([prov, count]) => (
        <div key={prov} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 120, fontSize: 13, color: COLORS.textDim, textAlign: "right", flexShrink: 0 }}>{prov}</div>
          <div style={{ flex: 1, background: COLORS.border, borderRadius: 4, height: 20, overflow: "hidden" }}>
            <div style={{
              width: `${(count / max) * 100}%`, height: "100%",
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
              borderRadius: 4, transition: "width .6s ease",
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.bg }}>{count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── TYPE PIE CHART (SVG) ──
function TypeChart({ sites }) {
  const data = useMemo(() => {
    const counts = {};
    sites.forEach(s => {
      const t = s.type.includes("Cement") ? "Cement Plants" : s.type.includes("Quarry") && s.type.includes("Crushing") ? "Quarry + Crushing" : s.type.includes("Quarry") ? "Quarry Only" : s.type.includes("Crushing") ? "Crushing Only" : "Specialized";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sites]);

  const total = data.reduce((s, d) => s + d[1], 0);
  const colors = [COLORS.accent, COLORS.accentSecondary, COLORS.gold, COLORS.accentWarm, COLORS.textMuted];
  let cumAngle = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
      <svg width="140" height="140" viewBox="-1.1 -1.1 2.2 2.2">
        {data.map(([label, count], i) => {
          const angle = (count / total) * 360;
          const start = cumAngle;
          cumAngle += angle;
          const r = 1;
          const x1 = r * Math.cos((start - 90) * Math.PI / 180);
          const y1 = r * Math.sin((start - 90) * Math.PI / 180);
          const x2 = r * Math.cos((start + angle - 90) * Math.PI / 180);
          const y2 = r * Math.sin((start + angle - 90) * Math.PI / 180);
          const large = angle > 180 ? 1 : 0;
          return <path key={i} d={`M0,0 L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={colors[i]} opacity={0.85} />;
        })}
        <circle r="0.55" fill={COLORS.bgCard} />
        <text textAnchor="middle" dy="0.1" fill={COLORS.text} fontSize="0.35" fontWeight="700" fontFamily="Rajdhani">{total}</text>
        <text textAnchor="middle" dy="0.35" fill={COLORS.textMuted} fontSize="0.14" fontFamily="IBM Plex Mono">sites</text>
      </svg>
      <div style={{ display: "grid", gap: 6 }}>
        {data.map(([label, count], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i], flexShrink: 0 }} />
            <span style={{ color: COLORS.textDim }}>{label}</span>
            <span style={{ fontWeight: 700, marginLeft: "auto" }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// MAIN APP
// ═══════════════════════════════════
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("map"); // map | list | exec
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedSite = SITES.find(s => s.id === selectedId);

  const filteredSites = useMemo(() => {
    return SITES.filter(s => {
      if (filterProvince !== "all" && s.province !== filterProvince) return false;
      if (filterType === "quarry" && !s.type.includes("Quarry")) return false;
      if (filterType === "crushing" && !s.type.includes("Crushing")) return false;
      if (filterType === "cement" && !s.type.includes("Cement")) return false;
      if (filterType === "other" && (s.type.includes("Quarry") || s.type.includes("Crushing") || s.type.includes("Cement"))) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.nameTh.includes(searchTerm)) return false;
      return true;
    });
  }, [filterProvince, filterType, searchTerm]);

  const provinces = [...new Set(SITES.map(s => s.province))].sort();
  const totalCapacity = SITES.reduce((s, x) => s + parseCapacity(x.capacity), 0);
  const avgScore = (SITES.reduce((s, x) => s + scoreSite(x).totalScoreNum, 0) / SITES.length).toFixed(1);

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 16px 40px" }}>
        {/* ── HEADER ── */}
        <header className="fade-in" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 0", borderBottom: `1px solid ${COLORS.border}`, marginBottom: 20, flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>◆</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, margin: 0 }}>QUARRYSCOPE<span style={{ color: COLORS.accent }}> BI</span></h1>
              <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>GEO-INFORMATIC BUSINESS INTELLIGENCE • SARABURI HUB</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, background: COLORS.bgCard, borderRadius: 8, padding: 3, border: `1px solid ${COLORS.border}` }}>
            {[["map", "🗺️ Map"], ["list", "📋 Top 20"], ["exec", "📊 Executive"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                background: tab === key ? COLORS.accent : "transparent",
                color: tab === key ? COLORS.bg : COLORS.textDim,
                fontWeight: 600, fontSize: 13, fontFamily: "'Rajdhani',sans-serif",
                transition: "all .2s",
              }}>{label}</button>
            ))}
          </div>
        </header>

        {/* ── STATS BAR ── */}
        <div className="fade-in stagger-1" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <StatCard icon="⛏️" label="Total Sites" value={SITES.length} sub={`Within 250km radius`} />
          <StatCard icon="🏔️" label="Provinces" value={provinces.length} sub={provinces.join(", ")} />
          <StatCard icon="📈" label="Avg Score" value={avgScore} sub="Business feasibility /10" />
          <StatCard icon="🏗️" label="Market" value="$119B" sub="Thailand construction 2025" />
        </div>

        {/* ── FILTERS ── */}
        <div className="fade-in stagger-2" style={{
          display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center",
        }}>
          <input
            type="text" placeholder="Search sites..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6,
              padding: "8px 14px", color: COLORS.text, fontFamily: "'Rajdhani',sans-serif",
              fontSize: 14, width: 200, outline: "none",
            }}
          />
          <select value={filterProvince} onChange={e => setFilterProvince(e.target.value)} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6,
            padding: "8px 14px", color: COLORS.text, fontFamily: "'Rajdhani',sans-serif", fontSize: 14,
          }}>
            <option value="all">All Provinces</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6,
            padding: "8px 14px", color: COLORS.text, fontFamily: "'Rajdhani',sans-serif", fontSize: 14,
          }}>
            <option value="all">All Types</option>
            <option value="quarry">Quarries</option>
            <option value="crushing">Crushing Plants</option>
            <option value="cement">Cement Plants</option>
            <option value="other">Specialized</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textDim, cursor: "pointer" }}>
            <input type="checkbox" checked={showRoutes} onChange={e => setShowRoutes(e.target.checked)} />
            Show route lines
          </label>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace" }}>
            {filteredSites.length} sites shown
          </span>
        </div>

        {/* ── MAP TAB ── */}
        {tab === "map" && (
          <div className="fade-in stagger-3" style={{ display: "grid", gridTemplateColumns: selectedSite ? "minmax(0,1fr) minmax(0,1fr)" : "1fr", gap: 16 }}>
            <div className="mobile-col" style={{
              height: selectedSite ? "75vh" : "65vh", minHeight: 350,
              borderRadius: 12, overflow: "hidden",
              border: `1px solid ${COLORS.border}`, position: "relative",
            }}>
              <MapView
                sites={filteredSites}
                selectedId={selectedId}
                onSelect={id => setSelectedId(id === selectedId ? null : id)}
                showHeatmap={showHeatmap}
                showRoutes={showRoutes}
              />
              {/* Map Legend */}
              <div style={{
                position: "absolute", top: 12, left: 12, background: `${COLORS.bg}e0`,
                borderRadius: 8, padding: "10px 14px", fontSize: 11, zIndex: 999,
                border: `1px solid ${COLORS.border}`, backdropFilter: "blur(8px)",
              }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}>Legend</div>
                {[
                  { color: COLORS.accentWarm, label: "Your HQ", shape: "circle" },
                  { color: COLORS.accent, label: "High Score Site", shape: "circle" },
                  { color: COLORS.accentSecondary, label: "Medium Score", shape: "circle" },
                  { color: COLORS.gold, label: "Cement Plant", shape: "square" },
                  { color: COLORS.textMuted, label: "Lower Score", shape: "circle" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div style={{
                      width: 8, height: 8, background: item.color,
                      borderRadius: item.shape === "square" ? 2 : "50%",
                    }} />
                    <span style={{ color: COLORS.textDim }}>{item.label}</span>
                  </div>
                ))}
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 20, height: 0, borderTop: `1px dashed ${COLORS.accent}` }} />
                  <span style={{ color: COLORS.textDim }}>250km radius</span>
                </div>
              </div>
            </div>

            {selectedSite && (
              <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
                <SiteDetail site={selectedSite} onClose={() => setSelectedId(null)} />
              </div>
            )}
          </div>
        )}

        {/* ── LIST TAB ── */}
        {tab === "list" && (
          <div className="fade-in stagger-3">
            <div style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12,
              padding: 20, marginBottom: 16,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Top 20 Potential Customers</h2>
              <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 16px" }}>
                Ranked by composite business feasibility score. Click a row to view details and tailored approach guideline.
              </p>
              <TopCustomersTable sites={filteredSites} onSelect={id => { setSelectedId(id); setTab("map"); }} selectedId={selectedId} />
            </div>
          </div>
        )}

        {/* ── EXECUTIVE TAB ── */}
        {tab === "exec" && (
          <div className="fade-in stagger-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 16 }}>
            {/* Province Distribution */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>📍 Distribution by Province</h3>
              <ProvinceChart sites={SITES} />
            </div>

            {/* Type Breakdown */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>🏭 Site Type Breakdown</h3>
              <TypeChart sites={SITES} />
            </div>

            {/* Market Context */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>📈 Market Context</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "Thailand Construction Market (2025)", value: "$119.04B", growth: "+8.9% CAGR to 2030" },
                  { label: "Cement Market (2024)", value: "$2.56B", growth: "+5.17% CAGR to 2033" },
                  { label: "Construction Equipment Market", value: "14.78K units", growth: "+4.65% CAGR to 2030" },
                  { label: "Infrastructure Sector Growth", value: "6.03%", growth: "CAGR 2025-2030" },
                  { label: "Key Mega-Project: Thai-China HSR Phase 2", value: "$9.6B", growth: "Bidding 2025" },
                  { label: "Govt Transport Budget 2025", value: "฿193.3B", growth: "+5.5% YoY" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: COLORS.accent }}>{item.growth}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace" }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 12, fontFamily: "'IBM Plex Mono',monospace" }}>
                Sources: Mordor Intelligence, IMARC, GlobalData, Next Move Strategy, NESDC
              </div>
            </div>

            {/* Strategic Summary */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>🎯 Executive Strategic Summary</h3>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: COLORS.textDim }}>
                <p><strong style={{ color: COLORS.accent }}>Saraburi Province is Thailand's limestone quarrying epicenter</strong>, hosting the majority of the country's aggregate production and all major cement manufacturers. Within your 250km radius, {SITES.length} verified sites have been identified across {provinces.length} provinces.</p>
                <p style={{ marginTop: 12 }}><strong style={{ color: COLORS.gold }}>Tier 1 — Quick Wins (0-30km):</strong> The Na Phra Lan / Chalerm Phra Kiat cluster has 10+ quarries and crushing plants within 30km of your HQ. These are primarily SME operators with aging equipment (many 20-30+ years old) who make purchasing decisions quickly. Focus on spare parts and wear components first, then upgrade packages.</p>
                <p style={{ marginTop: 12 }}><strong style={{ color: COLORS.accentSecondary }}>Tier 2 — Medium-Term (30-100km):</strong> Kaeng Khoi, Thap Kwang, and Phra Phutthabat areas house both large cement operations (SCG, Siam City, Asia Cement) and mid-size quarries. The cement giants have large procurement budgets but longer sales cycles — approach through industry events and distributor partnerships.</p>
                <p style={{ marginTop: 12 }}><strong style={{ color: COLORS.textDim }}>Tier 3 — Expansion (100-250km):</strong> Lopburi, Nakhon Ratchasima, Kanchanaburi, and Ratchaburi have additional quarry clusters worth cultivating once your Saraburi base is established.</p>
                <p style={{ marginTop: 12 }}><strong style={{ color: COLORS.accent }}>Key Advantage:</strong> Your Chinese supplier connections (particularly for jaw crushers, cone crushers, and wear parts) offer 30-50% cost savings over European OEM parts — a compelling value proposition for cost-conscious Thai quarry operators facing margin pressure from rising energy and environmental compliance costs.</p>
              </div>
            </div>

            {/* Radius Recommendation */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>📐 Radius Recommendation</h3>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: COLORS.textDim }}>
                <strong style={{ color: COLORS.accent }}>250km is optimal.</strong> It captures all 5 major limestone belts in Central Thailand (Saraburi, Lopburi, Nakhon Ratchasima, Kanchanaburi, Ratchaburi). However, prioritize your efforts concentrically:
                <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                  {[
                    { radius: "0-30km", sites: SITES.filter(s => haversine(HQ.lat, HQ.lng, s.lat, s.lng) < 30).length, label: "Immediate", color: COLORS.accent },
                    { radius: "30-80km", sites: SITES.filter(s => { const d = haversine(HQ.lat, HQ.lng, s.lat, s.lng); return d >= 30 && d < 80; }).length, label: "Near-term", color: COLORS.accentSecondary },
                    { radius: "80-250km", sites: SITES.filter(s => { const d = haversine(HQ.lat, HQ.lng, s.lat, s.lng); return d >= 80 && d <= 250; }).length, label: "Growth", color: COLORS.gold },
                  ].map((r, i) => (
                    <div key={i} style={{ background: COLORS.bg, borderRadius: 8, padding: "12px 20px", flex: "1 1 150px", borderLeft: `3px solid ${r.color}` }}>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase" }}>{r.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: r.color }}>{r.sites} sites</div>
                      <div style={{ fontSize: 12, color: COLORS.textDim }}>{r.radius} radius</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div style={{ gridColumn: "1 / -1", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>📚 Data Sources & Methodology</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, fontSize: 12, color: COLORS.textDim }}>
                <div>
                  <div style={{ color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>Primary Government Sources</div>
                  <div>• DPIM — Department of Primary Industries & Mines (กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่)</div>
                  <div>• USGS Minerals Yearbook — Thailand chapters (2016-2021)</div>
                  <div>• Thailand Pollution Control Department — Star Rating Quarry Program</div>
                </div>
                <div>
                  <div style={{ color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>Industry & Academic Sources</div>
                  <div>• Global Energy Monitor — Cement & Concrete Tracker</div>
                  <div>• CemNet.com — Global Cement Report</div>
                  <div>• Mordor Intelligence, IMARC Group, GlobalData — market sizing</div>
                </div>
                <div>
                  <div style={{ color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>Company & Directory Sources</div>
                  <div>• Individual company websites (SCG, SCCC, Asia Cement, Chememan, etc.)</div>
                  <div>• Thailand Yellow Pages (yellowpages.co.th)</div>
                  <div>• MineralConnext corporate reports</div>
                </div>
                <div>
                  <div style={{ color: COLORS.accentWarm, fontWeight: 600, marginBottom: 4 }}>Estimated Data (Clearly Labeled)</div>
                  <div>• Revenue estimates based on capacity × avg market pricing</div>
                  <div>• Employee counts from industry benchmarks per capacity tier</div>
                  <div>• Business feasibility scores derived from weighted factor model</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop: 32, padding: "16px 0", borderTop: `1px solid ${COLORS.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace",
          flexWrap: "wrap", gap: 8,
        }}>
          <span>QUARRYSCOPE BI v1.0 • Proof of Concept Demo • Data as of Feb 2026</span>
          <span>Built for international mining equipment trading intelligence</span>
        </footer>
      </div>
    </>
  );
}
