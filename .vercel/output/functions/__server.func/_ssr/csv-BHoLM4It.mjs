//#region node_modules/.nitro/vite/services/ssr/assets/csv-BHoLM4It.js
var FIELD_ALIASES = {
	product: [
		"product",
		"product name",
		"item",
		"item name",
		"name"
	],
	date: [
		"date",
		"transaction date",
		"sale date",
		"day"
	],
	quantitySold: [
		"quantity sold",
		"qty sold",
		"sales quantity",
		"qty",
		"quantity",
		"sold"
	],
	currentStock: [
		"current stock",
		"stock",
		"stock level",
		"qty on hand",
		"on hand"
	],
	sku: [
		"sku",
		"code",
		"product code",
		"item code"
	],
	category: [
		"category",
		"dept",
		"department",
		"type"
	]
};
function parseCsv(text) {
	const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	const parsed = [];
	for (const line of lines) {
		if (!line.trim()) continue;
		parsed.push(splitCsvLine(line));
	}
	if (!parsed.length) return {
		headers: [],
		rows: []
	};
	return {
		headers: parsed[0].map((h) => h.trim()),
		rows: parsed.slice(1).filter((r) => r.some((c) => c.trim()))
	};
}
function splitCsvLine(line) {
	const out = [];
	let cur = "";
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (inQuotes) {
			if (ch === "\"" && line[i + 1] === "\"") {
				cur += "\"";
				i++;
			} else if (ch === "\"") inQuotes = false;
			else cur += ch;
		} else if (ch === "\"") inQuotes = true;
		else if (ch === ",") {
			out.push(cur.trim());
			cur = "";
		} else cur += ch;
	}
	out.push(cur.trim());
	return out;
}
function autoMapColumns(headers) {
	const map = {};
	const normalized = headers.map((h) => ({
		raw: h,
		key: h.toLowerCase().trim()
	}));
	Object.keys(FIELD_ALIASES).forEach((field) => {
		const aliases = FIELD_ALIASES[field];
		const hit = normalized.find((h) => aliases.includes(h.key));
		if (hit) map[field] = hit.raw;
	});
	return map;
}
function mapAndValidate(table, mapping) {
	const idx = (field) => table.headers.indexOf(mapping[field] ?? "");
	const productI = idx("product");
	const dateI = idx("date");
	const qtyI = idx("quantitySold");
	const stockI = idx("currentStock");
	const skuI = idx("sku");
	const catI = idx("category");
	const issues = [];
	if (productI < 0) issues.push({
		row: 0,
		message: "Map a column to Product — it is required."
	});
	if (dateI < 0) issues.push({
		row: 0,
		message: "Map a column to Transaction Date — it is required."
	});
	if (qtyI < 0) issues.push({
		row: 0,
		message: "Map a column to Sales Quantity — it is required."
	});
	if (stockI < 0) issues.push({
		row: 0,
		message: "Map a column to Stock Level — it is required."
	});
	if (issues.length) return {
		rows: [],
		issues
	};
	const rows = [];
	const seen = /* @__PURE__ */ new Set();
	table.rows.forEach((cols, i) => {
		const rowNum = i + 2;
		const product = (cols[productI] ?? "").trim();
		const date = (cols[dateI] ?? "").trim();
		const qtyRaw = (cols[qtyI] ?? "").trim();
		const stockRaw = (cols[stockI] ?? "").trim();
		if (!product) {
			issues.push({
				row: rowNum,
				message: "Missing product name."
			});
			return;
		}
		if (!date || Number.isNaN(Date.parse(date))) {
			issues.push({
				row: rowNum,
				message: `Missing or invalid date (${date || "empty"}).`
			});
			return;
		}
		const quantitySold = Number(qtyRaw);
		const currentStock = Number(stockRaw);
		if (!Number.isFinite(quantitySold) || quantitySold < 0) {
			issues.push({
				row: rowNum,
				message: `Invalid sales quantity (${qtyRaw || "empty"}).`
			});
			return;
		}
		if (!Number.isFinite(currentStock) || currentStock < 0) {
			issues.push({
				row: rowNum,
				message: `Invalid stock level (${stockRaw || "empty"}).`
			});
			return;
		}
		const key = `${product.toLowerCase()}|${date}`;
		if (seen.has(key)) {
			issues.push({
				row: rowNum,
				message: `Duplicate record for ${product} on ${date}.`
			});
			return;
		}
		seen.add(key);
		rows.push({
			product,
			date: new Date(date).toISOString().slice(0, 10),
			quantitySold,
			currentStock,
			sku: skuI >= 0 ? cols[skuI] : void 0,
			category: catI >= 0 ? cols[catI] : void 0
		});
	});
	return {
		rows,
		issues
	};
}
function toCsv(headers, rows) {
	const esc = (v) => {
		const s = String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}
function downloadCsv(filename, content) {
	const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { toCsv as a, parseCsv as i, downloadCsv as n, mapAndValidate as r, autoMapColumns as t };
