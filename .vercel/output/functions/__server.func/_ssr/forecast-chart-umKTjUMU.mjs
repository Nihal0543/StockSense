import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as format, t as parseISO } from "../_libs/date-fns.mjs";
import { a as XAxis, c as CartesianGrid, d as ResponsiveContainer, f as Tooltip, i as YAxis, p as Legend, r as LineChart, s as Line } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forecast-chart-umKTjUMU.js
var import_jsx_runtime = require_jsx_runtime();
function ForecastChart({ history, forecast, horizon }) {
	const hist = history.slice(-horizon).map((p) => ({
		date: p.date,
		historical: p.sales,
		predicted: void 0
	}));
	const fut = forecast.slice(0, horizon).map((p) => ({
		date: p.date,
		historical: void 0,
		predicted: p.predictedSales ?? 0
	}));
	const data = [...hist, ...fut];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: -12,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "#E2E8F0",
						strokeDasharray: "3 3",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "date",
						tickFormatter: (v) => format(parseISO(v), "d MMM"),
						tick: {
							fill: "#5B6B7F",
							fontSize: 11
						},
						axisLine: { stroke: "#E2E8F0" },
						tickLine: false,
						minTickGap: 24
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: "#5B6B7F",
							fontSize: 11
						},
						axisLine: false,
						tickLine: false,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						labelFormatter: (v) => format(parseISO(String(v)), "d MMM yyyy"),
						contentStyle: {
							borderRadius: 12,
							border: "1px solid #E2E8F0",
							fontSize: 12
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "historical",
						name: "Historical sales",
						stroke: "#0B1F3A",
						strokeWidth: 2,
						dot: false,
						connectNulls: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "predicted",
						name: "Predicted demand",
						stroke: "#1B5FBF",
						strokeWidth: 2,
						strokeDasharray: "5 4",
						dot: false,
						connectNulls: false
					})
				]
			})
		})
	});
}
//#endregion
export { ForecastChart as t };
