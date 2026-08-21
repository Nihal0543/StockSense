import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useCurrentUserState } from "./use-current-user-susDe7cr.mjs";
import { t as LoginForm } from "./login-form-CzGS-ZFT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CI41TWNM.js
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user } = useCurrentUserState();
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {});
}
//#endregion
export { LoginPage as component };
