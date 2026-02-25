# ◆ QuarryScope BI

**Geo-Informatic Business Intelligence Platform for Mining Equipment Trading**

A proof-of-concept web application providing data analytics, geo-spatial mapping, and executive summary dashboards for identifying and approaching quarry mining and mineral processing operations in Central Thailand.

---

## Features

### 🗺️ Interactive Map View
- Dark-themed Leaflet map with all 30 verified mining sites
- Color-coded pins by business feasibility score and operation type
- 250km radius overlay from HQ (Saraburi, Na Phra Lan)
- Click-to-inspect with full detail panels
- Route distance visualization

### 📋 Top 20 Customer Ranking
- Composite business feasibility scoring with 9 weighted factors
- Sortable table with Thai/English business names
- Direct link to detailed site analysis

### 📊 Executive Dashboard
- Province distribution chart
- Site type breakdown (pie chart)
- Thailand construction market data context ($119B market in 2025)
- Strategic 3-tier approach summary
- Radius optimization recommendation
- Full data source methodology

### 🎯 Per-Site Business Approach Guidelines
- Tailored approach strategy for each site based on:
  - Operation type (quarry, crushing, cement)
  - Company size and decision-maker accessibility
  - Equipment age and replacement likelihood
  - Specific product lines and known equipment

---

## Data Sources

| Source | Type | Data Provided |
|--------|------|---------------|
| DPIM (กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่) | Government | Crushing plant registrations, concession data |
| USGS Minerals Yearbook (2016-2021) | Government | Production volumes, company operations |
| Global Energy Monitor | NGO/Research | Cement plant locations, capacity, ownership |
| Company Websites | Primary | Capacity, products, equipment, coordinates |
| Thailand Yellow Pages | Directory | Business listings, addresses |
| MineralConnext Reports | Corporate | Quarry details, reserves, production data |
| Mordor Intelligence / IMARC / GlobalData | Market Research | Market sizing, growth forecasts |

**Note:** Revenue estimates and employee counts are clearly labeled as estimates derived from capacity-based industry benchmarks.

---

## Deployment to GitHub Pages

### Quick Start

1. **Create a GitHub repository** named `quarryscope-bi`

2. **Push this code:**
   ```bash
   cd quarryscope-bi
   git init
   git add .
   git commit -m "Initial commit: QuarryScope BI v1.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/quarryscope-bi.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Under "Build and deployment", select **GitHub Actions**
   - The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy

4. **Access your site** at: `https://YOUR_USERNAME.github.io/quarryscope-bi/`

### Important: Update Base Path

If your repository name is different from `quarryscope-bi`, update the `base` field in `vite.config.js`:

```js
base: '/YOUR-REPO-NAME/',
```

### Local Development

```bash
npm install
npm run dev     # Start dev server at localhost:5173
npm run build   # Build for production
npm run preview # Preview production build
```

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool
- **Leaflet** — Interactive mapping (loaded via CDN)
- **Custom CSS** — Dark space-tech theme, fully responsive

No external UI frameworks or heavy dependencies — lightweight and fast.

---

## Customization

### Adding New Sites

Edit the `SITES` array in `src/App.jsx`. Each site object follows this structure:

```js
{
  id: 31,
  name: "Your New Site",
  nameTh: "ชื่อภาษาไทย",
  type: "Limestone Quarry & Crushing Plant",
  province: "Saraburi",
  district: "District Name",
  lat: 14.700,
  lng: 100.850,
  capacity: "100,000 tons/month",
  reserve: "10M+ tons",
  reserveYears: 10,
  owner: "Company Name Co., Ltd.",
  ownerTh: "บริษัท ชื่อบริษัท จำกัด",
  products: ["Product 1", "Product 2"],
  equipment: ["Jaw crusher", "Cone crusher"],
  status: "Active",
  concession: "Licensed",
  source: "Source URL or name",
  estRevenue: 50,      // Estimated annual revenue in millions THB
  employees: 40,
  yearEst: 2000,
}
```

### Adjusting Scoring Weights

The `scoreSite()` function contains 9 weighted factors. Adjust `weight` values to change prioritization:

- `Proximity to HQ` (0.12) — Closer sites score higher
- `Production Scale` (0.15) — Larger operations = bigger equipment budgets
- `Equipment Replacement Likelihood` (0.18) — Older operations more likely to need equipment
- `Operational Continuity` (0.10) — Sites with long reserve life will keep buying
- `Revenue Potential` (0.13) — Higher revenue = more purchasing power
- And 4 more factors...

---

## License

This is a proof-of-concept demo. Data is sourced from publicly available records. Estimated values are clearly labeled.

Built for international mining equipment trading intelligence.
