import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, d as useRouterState, m as Outlet, v as Link, y as Navigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Boxes, E as ChevronRight, O as Check, P as Activity, S as FileChartColumnIncreasing, T as ChevronsUpDown, _ as Menu, a as TrendingUp, b as LayoutDashboard, c as SlidersHorizontal, h as Package, j as Bell, k as BrainCircuit, l as Shield, n as Users, r as Upload, s as Store, t as X, v as LogOut } from "./_libs/lucide-react.mjs";
import { a as Label2, c as Separator2, d as Trigger, i as ItemIndicator2, l as SubContent2, n as Content2, o as Portal2, r as Item2, s as Root2, t as CheckboxItem2, u as SubTrigger2 } from "./_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { c as cn } from "./_ssr/router-BRoFgmkY.mjs";
import { a as useCurrentUserState, i as useCurrentUser, r as signOut } from "./_ssr/use-current-user-susDe7cr.mjs";
import { c as initials, f as useStockStore } from "./_ssr/store-CI4xhis3.mjs";
import { t as Button } from "./_ssr/button-B0j3GnJP.mjs";
import { t as Logo } from "./_ssr/logo-CC2z0bQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BVpLCLti.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-navy/50", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var SheetContent = import_react.forwardRef(({ side = "left", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col bg-navy text-navy-fg shadow-[var(--shadow-raised)]", side === "left" ? "inset-y-0 left-0" : "inset-y-0 right-0", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-md p-1 text-navy-muted hover:bg-navy-800 hover:text-navy-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-muted data-[state=open]:bg-muted", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto h-4 w-4" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-32 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-[var(--shadow-raised)]", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-border", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var ownerNav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/inventory",
		label: "Inventory",
		icon: Package
	},
	{
		to: "/predictions",
		label: "Predictions",
		icon: TrendingUp
	},
	{
		to: "/upload",
		label: "Upload Data",
		icon: Upload
	},
	{
		to: "/products",
		label: "Products",
		icon: Boxes
	},
	{
		to: "/alerts",
		label: "Alerts",
		icon: Bell,
		badge: "alerts"
	},
	{
		to: "/reports",
		label: "Reports",
		icon: FileChartColumnIncreasing
	},
	{
		to: "/settings",
		label: "Settings",
		icon: SlidersHorizontal
	}
];
var adminNav = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users
	},
	{
		to: "/admin/model",
		label: "Model",
		icon: BrainCircuit
	},
	{
		to: "/admin/activity",
		label: "Activity",
		icon: Activity
	}
];
function navFor(role) {
	return role === "admin" ? adminNav : ownerNav;
}
function SidebarNav({ role, alertCount, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = navFor(role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-5 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { inverted: true })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex-1 space-y-0.5 px-3",
			children: items.map((item) => {
				const active = item.to === "/dashboard" ? pathname === "/dashboard" : item.to === "/admin" ? pathname === "/admin" : pathname === item.to || pathname.startsWith(`${item.to}/`);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					onClick: onNavigate,
					className: cn("flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-navy-700 text-white" : "text-navy-muted hover:bg-navy-800 hover:text-navy-fg"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: item.label
						}),
						item.badge === "alerts" && alertCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid min-w-5 place-items-center rounded-full bg-critical px-1.5 text-[10px] font-semibold text-white",
							children: alertCount
						}) : null
					]
				}, item.to);
			})
		})]
	});
}
var TITLES = {
	"/dashboard": "Dashboard",
	"/inventory": "Inventory",
	"/predictions": "Predictions",
	"/upload": "Upload data",
	"/products": "Product catalog",
	"/alerts": "Alerts",
	"/reports": "Reports",
	"/settings": "Reorder thresholds",
	"/admin": "Administrator",
	"/admin/users": "User accounts",
	"/admin/model": "Model management",
	"/admin/activity": "System activity"
};
function titleFor(pathname) {
	if (TITLES[pathname]) return TITLES[pathname];
	if (pathname.startsWith("/inventory/")) return "Product details";
	return "StockSense";
}
function AppShell() {
	const { user, isPending } = useCurrentUserState();
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const finish = () => {
			if (!cancelled) setHydrated(true);
		};
		const unsub = useStockStore.persist.onFinishHydration(finish);
		Promise.resolve(useStockStore.persist.rehydrate()).then(finish, finish);
		if (useStockStore.persist.hasHydrated()) finish();
		const t = window.setTimeout(finish, 300);
		return () => {
			cancelled = true;
			unsub?.();
			window.clearTimeout(t);
		};
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellFrame, {});
}
function LoadingScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm font-medium text-navy",
					children: "Loading StockSense…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Checking your session"
				})
			]
		})
	});
}
function ShellFrame() {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const role = useStockStore((s) => s.role);
	const storeName = useStockStore((s) => s.storeName);
	const openAlerts = useStockStore((s) => s.alerts).filter((a) => a.status === "open").length;
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (role === "admin" && !pathname.startsWith("/admin")) navigate({ to: "/admin" });
		if (role === "owner" && pathname.startsWith("/admin")) navigate({ to: "/dashboard" });
	}, [
		role,
		pathname,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-navy lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
					role,
					alertCount: openAlerts
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreCard, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: mobileOpen,
				onOpenChange: setMobileOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
						role,
						alertCount: openAlerts,
						onNavigate: () => setMobileOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreCard, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur-sm sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setMobileOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden min-w-0 flex-1 lg:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold text-navy",
								children: titleFor(pathname)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: storeName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1 sm:gap-2",
							children: [role === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/alerts",
								className: "relative grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
								"aria-label": "Alerts",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), openAlerts > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 size-2 rounded-full bg-critical" }) : null]
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-5 sm:px-6 sm:py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})
		]
	});
}
function StoreCard() {
	const storeName = useStockStore((s) => s.storeName);
	const role = useStockStore((s) => s.role);
	const setRole = useStockStore((s) => s.setRole);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-auto border-t border-white/10 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 text-[10px] font-medium uppercase tracking-wider text-navy-muted",
				children: "Viewing as"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-1 rounded-lg bg-navy-800 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRole("owner"),
					className: cn("flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium", role === "owner" ? "bg-navy-600 text-white" : "text-navy-muted hover:text-navy-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-3.5" }), "Owner"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRole("admin"),
					className: cn("flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium", role === "admin" ? "bg-navy-600 text-white" : "text-navy-muted hover:text-navy-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3.5" }), "Admin"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 truncate px-2 text-xs text-navy-muted",
				children: storeName
			})
		]
	});
}
function AccountMenu() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex h-10 items-center gap-2 rounded-md px-1.5 hover:bg-muted",
			children: [
				user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: user.profileImageUrl,
					alt: "",
					className: "size-8 rounded-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-navy",
					children: initials(label)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden max-w-32 truncate text-left text-sm font-medium sm:block",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "hidden size-3.5 text-muted-foreground sm:block" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate font-medium text-foreground",
				children: label
			}), user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-xs font-normal text-muted-foreground",
				children: user.primaryEmail
			}) : null] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				disabled: signingOut,
				onSelect: () => {
					setSigningOut(true);
					signOut("/login").catch(() => setSigningOut(false));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), signingOut ? "Signing out…" : "Sign out"]
			})
		]
	})] });
}
var SplitComponent = AppShell;
//#endregion
export { SplitComponent as component };
