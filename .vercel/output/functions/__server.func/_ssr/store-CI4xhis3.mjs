import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as isValid, i as format, n as subDays, o as addDays, r as formatISO, t as parseISO } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CI4xhis3.js
function formatDate(iso, pattern = "d MMM yyyy") {
	if (!iso) return "—";
	const d = parseISO(iso);
	if (!isValid(d)) return "—";
	return format(d, pattern);
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const d = parseISO(iso);
	if (!isValid(d)) return "—";
	return format(d, "d MMM yyyy, h:mm a");
}
function formatNumber(n, digits = 0) {
	return new Intl.NumberFormat("en-IN", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	}).format(n);
}
function formatPercent(n) {
	return `${Math.round(n * 100)}%`;
}
function riskLabel(risk) {
	switch (risk) {
		case "safe": return "Safe";
		case "watch": return "Watch";
		case "critical": return "Critical";
		case "out_of_stock": return "Out of Stock";
	}
}
function daysLabel(days) {
	if (days === null) return "No run-out in sight";
	if (days <= 0) return "Already out";
	if (days < 1) return "Today";
	if (days === 1) return "Tomorrow";
	return `${Math.round(days)} days`;
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
var TODAY = "2026-08-21";
function riskFromStock(stock, daysUntilStockout, threshold) {
	if (stock <= 0) return "out_of_stock";
	if (daysUntilStockout !== null && daysUntilStockout <= 7) return "critical";
	if (stock <= threshold * .5) return "critical";
	if (daysUntilStockout !== null && daysUntilStockout <= 14) return "watch";
	if (stock <= threshold) return "watch";
	return "safe";
}
function recommendedReorder(stock, velocity, threshold) {
	const cover = Math.max(threshold * 2, Math.ceil(velocity * 14));
	return Math.max(0, cover - stock);
}
function avgDailySales(history, lookback = 14) {
	if (!history.length) return 0;
	const slice = history.slice(-lookback);
	return slice.reduce((s, p) => s + p.sales, 0) / slice.length;
}
function buildInsight(product, history, today = TODAY) {
	const velocity = avgDailySales(history);
	const days = product.currentStock <= 0 ? 0 : velocity <= 0 ? null : product.currentStock / velocity;
	const stockoutDate = days === null ? null : formatISO(addDays(parseISO(today), Math.max(0, Math.round(days))), { representation: "date" });
	const risk = riskFromStock(product.currentStock, days, product.reorderThreshold);
	const qty = recommendedReorder(product.currentStock, velocity, product.reorderThreshold);
	const confidence = confidenceFor(product, history, velocity);
	return {
		productId: product.id,
		avgDailySales: Math.round(velocity * 10) / 10,
		daysUntilStockout: days,
		predictedStockoutDate: stockoutDate,
		risk,
		confidence,
		recommendedReorderQty: qty,
		explanation: explain(product, velocity, days, stockoutDate, risk)
	};
}
function confidenceFor(product, history, velocity) {
	const depth = Math.min(1, history.length / 90);
	const stability = velocity > 0 ? .12 : -.08;
	const perishable = [
		"Produce",
		"Bakery",
		"Dairy"
	].includes(product.category) ? -.06 : 0;
	const score = .72 + depth * .18 + stability + perishable;
	return Math.round(Math.min(.96, Math.max(.58, score)) * 100) / 100;
}
function explain(product, velocity, days, stockoutDate, risk) {
	const pace = velocity < 1 ? "slowly" : `about ${Math.round(velocity * 10) / 10} ${product.unit} a day`;
	if (risk === "out_of_stock") return `${product.name} is already at zero. Customers asking for it will walk out empty-handed until you restock.`;
	if (risk === "critical") return `${product.name} is selling ${pace}. With ${product.currentStock} ${product.unit} left, it is likely to run out around ${formatDate(stockoutDate)} — below your reorder level of ${product.reorderThreshold}.`;
	if (risk === "watch") return `${product.name} still has ${product.currentStock} ${product.unit} on the shelf, but at the current pace it will dip below your reorder level soon. Plan a restock before ${formatDate(stockoutDate)}.`;
	if (days === null) return `${product.name} has healthy stock and little recent movement. No shortage is expected in the next month.`;
	return `${product.name} is in good shape. At the current pace, stock should last well past the next two weeks.`;
}
function predictedDemand(velocity, horizon) {
	return Math.round(velocity * horizon);
}
function mulberry32(seed) {
	let a = seed;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
function iso(d) {
	return formatISO(d, { representation: "date" });
}
var RAW = [
	{
		id: "p-atta",
		name: "Aashirvaad Atta 10 kg",
		sku: "ST-ATTA-10",
		category: "Staples",
		currentStock: 8,
		reorderThreshold: 20,
		unit: "packs",
		supplierName: "ITC Foods Dist.",
		supplierContact: "98240 11021",
		velocity: 4.1
	},
	{
		id: "p-oil",
		name: "Fortune Sunflower Oil 1 L",
		sku: "CK-OIL-1",
		category: "Cooking",
		currentStock: 24,
		reorderThreshold: 18,
		unit: "bottles",
		supplierName: "Adani Wilmar",
		supplierContact: "079 2550 4400",
		velocity: 3
	},
	{
		id: "p-salt",
		name: "Tata Salt 1 kg",
		sku: "ST-SALT-1",
		category: "Staples",
		currentStock: 86,
		reorderThreshold: 15,
		unit: "packs",
		supplierName: "Tata Consumer",
		supplierContact: "1800 266 0808",
		velocity: 2
	},
	{
		id: "p-butter",
		name: "Amul Butter 500 g",
		sku: "DY-BUT-500",
		category: "Dairy",
		currentStock: 6,
		reorderThreshold: 12,
		unit: "packs",
		supplierName: "GCMMF / Amul",
		supplierContact: "98790 22110",
		velocity: 2.2
	},
	{
		id: "p-maggi",
		name: "Maggi Noodles 70 g (carton)",
		sku: "PK-MAG-CTN",
		category: "Packaged",
		currentStock: 0,
		reorderThreshold: 10,
		unit: "cartons",
		supplierName: "Nestlé India",
		supplierContact: "1800 103 1947",
		velocity: 3.4
	},
	{
		id: "p-parle",
		name: "Parle-G 800 g",
		sku: "SN-PG-800",
		category: "Snacks",
		currentStock: 18,
		reorderThreshold: 16,
		unit: "packs",
		supplierName: "Parle Products",
		supplierContact: "022 2493 0470",
		velocity: 2.1
	},
	{
		id: "p-tea",
		name: "Brooke Bond Red Label 500 g",
		sku: "BV-TEA-500",
		category: "Beverages",
		currentStock: 42,
		reorderThreshold: 12,
		unit: "packs",
		supplierName: "HUL Distributor",
		supplierContact: "1800 102 2221",
		velocity: 1.1
	},
	{
		id: "p-rice",
		name: "India Gate Basmati 5 kg",
		sku: "ST-RICE-5",
		category: "Staples",
		currentStock: 5,
		reorderThreshold: 10,
		unit: "bags",
		supplierName: "KRBL Ltd.",
		supplierContact: "0120 394 8585",
		velocity: 2
	},
	{
		id: "p-surf",
		name: "Surf Excel 1 kg",
		sku: "HH-SXF-1",
		category: "Household",
		currentStock: 14,
		reorderThreshold: 10,
		unit: "packs",
		supplierName: "HUL Distributor",
		supplierContact: "1800 102 2221",
		velocity: 1.6
	},
	{
		id: "p-colgate",
		name: "Colgate Strong Teeth 200 g",
		sku: "PC-COL-200",
		category: "Personal Care",
		currentStock: 38,
		reorderThreshold: 12,
		unit: "tubes",
		supplierName: "Colgate Palmolive",
		supplierContact: "1800 180 1234",
		velocity: 1
	},
	{
		id: "p-milkmaid",
		name: "Nestlé Milkmaid 400 g",
		sku: "DY-MM-400",
		category: "Dairy",
		currentStock: 11,
		reorderThreshold: 10,
		unit: "tins",
		supplierName: "Nestlé India",
		supplierContact: "1800 103 1947",
		velocity: 1.3
	},
	{
		id: "p-bread",
		name: "Britannia Bread 400 g",
		sku: "BK-BRD-400",
		category: "Bakery",
		currentStock: 0,
		reorderThreshold: 8,
		unit: "loaves",
		supplierName: "Local bakery route",
		supplierContact: "98765 44321",
		velocity: 6.2
	},
	{
		id: "p-onion",
		name: "Onions (loose)",
		sku: "PR-ONI-KG",
		category: "Produce",
		currentStock: 12,
		reorderThreshold: 25,
		unit: "kg",
		supplierName: "Naroda APMC",
		supplierContact: "98250 66770",
		velocity: 8
	},
	{
		id: "p-potato",
		name: "Potatoes (loose)",
		sku: "PR-POT-KG",
		category: "Produce",
		currentStock: 92,
		reorderThreshold: 20,
		unit: "kg",
		supplierName: "Naroda APMC",
		supplierContact: "98250 66770",
		velocity: 6
	},
	{
		id: "p-coke",
		name: "Coca-Cola 750 ml",
		sku: "BV-COKE-750",
		category: "Beverages",
		currentStock: 16,
		reorderThreshold: 14,
		unit: "bottles",
		supplierName: "HCCB Bottling",
		supplierContact: "1800 102 5333",
		velocity: 2
	},
	{
		id: "p-namkeen",
		name: "Haldiram's Namkeen 200 g",
		sku: "SN-HAL-200",
		category: "Snacks",
		currentStock: 28,
		reorderThreshold: 10,
		unit: "packs",
		supplierName: "Haldiram Foods",
		supplierContact: "011 4724 2222",
		velocity: 1
	},
	{
		id: "p-dal",
		name: "Toor Dal 1 kg",
		sku: "ST-DAL-1",
		category: "Staples",
		currentStock: 7,
		reorderThreshold: 15,
		unit: "packs",
		supplierName: "Local miller — Patel Bros",
		supplierContact: "98241 90880",
		velocity: 3.1
	},
	{
		id: "p-dettol",
		name: "Dettol Soap 125 g",
		sku: "PC-DET-125",
		category: "Personal Care",
		currentStock: 44,
		reorderThreshold: 12,
		unit: "bars",
		supplierName: "Reckitt Distributor",
		supplierContact: "1800 258 8080",
		velocity: 1
	},
	{
		id: "p-milk",
		name: "Amul Taaza 500 ml",
		sku: "DY-MLK-500",
		category: "Dairy",
		currentStock: 22,
		reorderThreshold: 16,
		unit: "packs",
		supplierName: "GCMMF / Amul",
		supplierContact: "98790 22110",
		velocity: 2.6
	},
	{
		id: "p-sugar",
		name: "Madhur Sugar 1 kg",
		sku: "ST-SUG-1",
		category: "Staples",
		currentStock: 55,
		reorderThreshold: 20,
		unit: "packs",
		supplierName: "Shree Renuka Sugars",
		supplierContact: "1800 266 0800",
		velocity: 2
	},
	{
		id: "p-mustard",
		name: "Dhara Mustard Oil 1 L",
		sku: "CK-MUS-1",
		category: "Cooking",
		currentStock: 9,
		reorderThreshold: 12,
		unit: "bottles",
		supplierName: "Mother Dairy Oils",
		supplierContact: "1800 180 1020",
		velocity: 1.5
	},
	{
		id: "p-vim",
		name: "Vim Dishwash 500 ml",
		sku: "HH-VIM-500",
		category: "Household",
		currentStock: 21,
		reorderThreshold: 8,
		unit: "bottles",
		supplierName: "HUL Distributor",
		supplierContact: "1800 102 2221",
		velocity: .9
	},
	{
		id: "p-kurkure",
		name: "Kurkure Masala Munch",
		sku: "SN-KUR-70",
		category: "Snacks",
		currentStock: 4,
		reorderThreshold: 15,
		unit: "packs",
		supplierName: "PepsiCo / Frito-Lay",
		supplierContact: "1800 102 4455",
		velocity: 3.2
	},
	{
		id: "p-lifebuoy",
		name: "Lifebuoy Soap 125 g",
		sku: "PC-LIF-125",
		category: "Personal Care",
		currentStock: 0,
		reorderThreshold: 10,
		unit: "bars",
		supplierName: "HUL Distributor",
		supplierContact: "1800 102 2221",
		velocity: 2
	}
];
var STORE_NAME = "Sharma General Store";
var CATEGORIES = [
	"Staples",
	"Cooking",
	"Dairy",
	"Packaged",
	"Snacks",
	"Beverages",
	"Household",
	"Personal Care",
	"Bakery",
	"Produce"
];
function seedProducts() {
	const today = parseISO(TODAY);
	return RAW.map((p, i) => ({
		id: p.id,
		name: p.name,
		sku: p.sku,
		category: p.category,
		currentStock: p.currentStock,
		reorderThreshold: p.reorderThreshold,
		unit: p.unit,
		supplierName: p.supplierName,
		supplierContact: p.supplierContact,
		lastUpdated: iso(subDays(today, i % 3)),
		createdAt: iso(subDays(today, 80 - i % 20))
	}));
}
function seedHistory() {
	const today = parseISO(TODAY);
	const out = {};
	for (const p of RAW) {
		const rng = mulberry32(hash(p.id));
		const dates = [];
		const sales = [];
		for (let i = 89; i >= 0; i--) {
			const d = subDays(today, i);
			const dow = d.getDay();
			const weekend = dow === 0 || dow === 6 ? 1.25 : 1;
			const festive = d.getMonth() === 9 || d.getMonth() === 10 ? 1.15 : 1;
			const noise = .65 + rng() * .7;
			dates.push(d);
			sales.push(Math.max(0, Math.round(p.velocity * weekend * festive * noise)));
		}
		const stocks = new Array(90);
		stocks[89] = p.currentStock;
		for (let i = 88; i >= 0; i--) {
			const restock = rng() < .05 ? Math.round(p.reorderThreshold * (1.1 + rng())) : 0;
			stocks[i] = Math.max(0, stocks[i + 1] + sales[i + 1] - restock);
		}
		out[p.id] = dates.map((d, i) => ({
			date: iso(d),
			sales: sales[i],
			stock: stocks[i]
		}));
	}
	return out;
}
function seedForecasts() {
	const today = parseISO(TODAY);
	const out = {};
	for (const p of RAW) {
		const rng = mulberry32(hash(p.id) ^ 2748);
		const points = [];
		let stock = p.currentStock;
		for (let i = 1; i <= 30; i++) {
			const d = addDays(today, i);
			const dow = d.getDay();
			const weekend = dow === 0 || dow === 6 ? 1.2 : 1;
			const sales = Math.max(0, Math.round(p.velocity * weekend * (.9 + rng() * .2)));
			stock = Math.max(0, stock - sales);
			points.push({
				date: iso(d),
				sales: 0,
				stock,
				predictedSales: sales
			});
		}
		out[p.id] = points;
	}
	return out;
}
function seedAlerts(products) {
	const today = parseISO(TODAY);
	return products.filter((p) => p.currentStock <= p.reorderThreshold).map((p, i) => {
		const oos = p.currentStock <= 0;
		const critical = !oos && p.currentStock <= Math.max(8, p.reorderThreshold * .5);
		const severity = oos ? "out_of_stock" : critical ? "critical" : "watch";
		const days = oos ? 0 : Math.max(1, Math.round(p.currentStock / Math.max(1, RAW.find((r) => r.id === p.id)?.velocity ?? 2)));
		return {
			id: `al-${p.id}`,
			productId: p.id,
			severity,
			predictedShortageDate: iso(addDays(today, days)),
			recommendedReorderQty: Math.max(p.reorderThreshold * 2 - p.currentStock, Math.ceil((RAW.find((r) => r.id === p.id)?.velocity ?? 2) * 14) - p.currentStock),
			createdAt: subDays(today, i % 5).toISOString(),
			status: i === 3 || i === 7 ? "resolved" : "open"
		};
	});
}
function seedUsers() {
	return [
		{
			id: "u-priya",
			name: "Priya Sharma",
			email: "priya@sharmastore.in",
			role: "owner",
			status: "active",
			lastLogin: "2026-08-21T09:14:00+05:30"
		},
		{
			id: "u-rajesh",
			name: "Rajesh Patel",
			email: "rajesh@sharmastore.in",
			role: "owner",
			status: "active",
			lastLogin: "2026-08-20T18:02:00+05:30"
		},
		{
			id: "u-ankit",
			name: "Ankit Mehta",
			email: "ankit.admin@sharmastore.in",
			role: "admin",
			status: "active",
			lastLogin: "2026-08-21T08:40:00+05:30"
		},
		{
			id: "u-kavita",
			name: "Kavita Shah",
			email: "kavita@sharmastore.in",
			role: "owner",
			status: "disabled",
			lastLogin: "2026-07-12T11:20:00+05:30"
		}
	];
}
function seedModel(productCount) {
	return {
		name: "StockSense Forecaster",
		type: "Prophet",
		fallback: "ARIMA",
		lastTrained: "2026-08-18T21:10:00+05:30",
		trainingProducts: productCount,
		trainingDays: 90,
		status: "ready"
	};
}
function seedUploads() {
	return [
		{
			id: "up-1",
			fileName: "weekly_sales_17aug.csv",
			uploadedAt: "2026-08-17T19:22:00+05:30",
			rows: 168,
			status: "processed"
		},
		{
			id: "up-2",
			fileName: "stock_count_18aug.csv",
			uploadedAt: "2026-08-18T08:05:00+05:30",
			rows: 24,
			status: "processed"
		},
		{
			id: "up-3",
			fileName: "weekly_sales_21aug.csv",
			uploadedAt: "2026-08-21T07:48:00+05:30",
			rows: 152,
			status: "processed"
		}
	];
}
var SAMPLE_CSV = `Product,Date,Quantity Sold,Current Stock,SKU,Category
Aashirvaad Atta 10 kg,2026-08-20,5,8,ST-ATTA-10,Staples
Fortune Sunflower Oil 1 L,2026-08-20,3,24,CK-OIL-1,Cooking
Maggi Noodles 70 g (carton),2026-08-20,4,0,PK-MAG-CTN,Packaged
Onions (loose),2026-08-20,9,12,PR-ONI-KG,Produce
Toor Dal 1 kg,2026-08-20,3,7,ST-DAL-1,Staples
`;
var products0 = seedProducts();
var history0 = seedHistory();
var forecasts0 = seedForecasts();
function newId(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
function bumpAlertsFor(product, history, alerts) {
	const insight = buildInsight(product, history);
	if (insight.risk === "safe") return alerts;
	const severity = insight.risk;
	const existing = alerts.find((a) => a.productId === product.id && a.status === "open");
	if (existing) return alerts.map((a) => a.id === existing.id ? {
		...a,
		severity,
		predictedShortageDate: insight.predictedStockoutDate,
		recommendedReorderQty: insight.recommendedReorderQty
	} : a);
	return [{
		id: newId("al"),
		productId: product.id,
		severity,
		predictedShortageDate: insight.predictedStockoutDate,
		recommendedReorderQty: insight.recommendedReorderQty,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "open"
	}, ...alerts];
}
var useStockStore = create()(persist((set, get) => ({
	storeName: STORE_NAME,
	role: "owner",
	products: products0,
	history: history0,
	forecasts: forecasts0,
	alerts: seedAlerts(products0),
	teamUsers: seedUsers(),
	model: seedModel(products0.length),
	uploads: seedUploads(),
	setRole: (role) => set({ role }),
	addProduct: (input) => {
		const id = newId("p");
		const product = {
			...input,
			id,
			createdAt: TODAY,
			lastUpdated: TODAY
		};
		set((s) => ({ products: [product, ...s.products] }));
		return id;
	},
	updateProduct: (id, patch) => {
		set((s) => {
			const products = s.products.map((p) => p.id === id ? {
				...p,
				...patch,
				lastUpdated: TODAY
			} : p);
			const product = products.find((p) => p.id === id);
			return {
				products,
				alerts: product ? bumpAlertsFor(product, s.history[id] ?? [], s.alerts) : s.alerts
			};
		});
	},
	deleteProduct: (id) => {
		set((s) => {
			const { [id]: _h, ...history } = s.history;
			const { [id]: _f, ...forecasts } = s.forecasts;
			return {
				products: s.products.filter((p) => p.id !== id),
				history,
				forecasts,
				alerts: s.alerts.filter((a) => a.productId !== id)
			};
		});
	},
	updateThreshold: (id, threshold) => {
		get().updateProduct(id, { reorderThreshold: threshold });
	},
	resolveAlert: (id) => {
		set((s) => ({ alerts: s.alerts.map((a) => a.id === id ? {
			...a,
			status: "resolved"
		} : a) }));
	},
	reopenAlert: (id) => {
		set((s) => ({ alerts: s.alerts.map((a) => a.id === id ? {
			...a,
			status: "open"
		} : a) }));
	},
	ingestRows: (rows, fileName) => {
		let added = 0;
		let updated = 0;
		set((s) => {
			const products = [...s.products];
			const history = { ...s.history };
			const forecasts = { ...s.forecasts };
			let alerts = s.alerts;
			const byName = new Map(products.map((p) => [p.name.toLowerCase(), p]));
			for (const row of rows) {
				let product = byName.get(row.product.toLowerCase());
				if (!product) {
					product = {
						id: newId("p"),
						name: row.product,
						sku: row.sku || `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
						category: row.category || "Staples",
						currentStock: row.currentStock,
						reorderThreshold: Math.max(8, Math.round(row.currentStock * .4)),
						unit: "units",
						supplierName: "Unassigned supplier",
						supplierContact: "—",
						lastUpdated: row.date,
						createdAt: row.date
					};
					products.unshift(product);
					byName.set(product.name.toLowerCase(), product);
					added += 1;
				} else {
					product = {
						...product,
						currentStock: row.currentStock,
						lastUpdated: row.date,
						sku: row.sku || product.sku,
						category: row.category || product.category
					};
					const idx = products.findIndex((p) => p.id === product.id);
					products[idx] = product;
					byName.set(product.name.toLowerCase(), product);
					updated += 1;
				}
				const points = [...history[product.id] ?? []];
				const existing = points.findIndex((pt) => pt.date === row.date);
				const point = {
					date: row.date,
					sales: row.quantitySold,
					stock: row.currentStock
				};
				if (existing >= 0) points[existing] = point;
				else points.push(point);
				points.sort((a, b) => a.date.localeCompare(b.date));
				history[product.id] = points;
				alerts = bumpAlertsFor(product, points, alerts);
			}
			return {
				products,
				history,
				forecasts,
				alerts,
				uploads: [{
					id: newId("up"),
					fileName,
					uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
					rows: rows.length,
					status: "processed"
				}, ...s.uploads],
				model: {
					...s.model,
					status: "stale"
				}
			};
		});
		return {
			added,
			updated
		};
	},
	startRetrain: () => set((s) => ({ model: {
		...s.model,
		status: "training"
	} })),
	finishRetrain: () => set((s) => ({ model: {
		...s.model,
		status: "ready",
		lastTrained: (/* @__PURE__ */ new Date()).toISOString(),
		trainingProducts: s.products.length
	} })),
	addUser: (input) => {
		set((s) => ({ teamUsers: [{
			...input,
			id: newId("u"),
			lastLogin: "—"
		}, ...s.teamUsers] }));
	},
	updateUser: (id, patch) => {
		set((s) => ({ teamUsers: s.teamUsers.map((u) => u.id === id ? {
			...u,
			...patch
		} : u) }));
	},
	resetDemo: () => {
		const products = seedProducts();
		set({
			products,
			history: seedHistory(),
			forecasts: seedForecasts(),
			alerts: seedAlerts(products),
			teamUsers: seedUsers(),
			model: seedModel(products.length),
			uploads: seedUploads(),
			role: get().role
		});
	}
}), {
	name: "stocksense-v2",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (s) => ({
		role: s.role,
		products: s.products,
		history: s.history,
		forecasts: s.forecasts,
		alerts: s.alerts,
		teamUsers: s.teamUsers,
		model: s.model,
		uploads: s.uploads,
		storeName: s.storeName
	})
}));
function insightFor(product, history) {
	return buildInsight(product, history);
}
//#endregion
export { formatDateTime as a, initials as c, riskLabel as d, useStockStore as f, formatDate as i, insightFor as l, SAMPLE_CSV as n, formatNumber as o, daysLabel as r, formatPercent as s, CATEGORIES as t, predictedDemand as u };
