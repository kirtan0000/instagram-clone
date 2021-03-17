"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
require("../Styles/Account.css");
var API_BASE_1 = require("../Util/API_BASE");
var Dark_1 = require("../Util/Dark");
var EditFavicon_1 = require("../Util/EditFavicon");
var Login = function () {
    Dark_1["default"]();
    var _a = react_1.useState(''), email = _a[0], setEmail = _a[1];
    var _b = react_1.useState(''), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(''), errorMessage = _c[0], setError = _c[1];
    var _d = react_1.useState(false), showPass = _d[0], setShowPass = _d[1];
    EditFavicon_1["default"]('/favicon.ico');
    var onEmailChange = function (event) { return setEmail(event.target.value); };
    var onPasswordChange = function (event) { return setPassword(event.target.value); };
    var setChecked = function () {
        if (!showPass)
            setShowPass(true);
        else
            setShowPass(false);
    };
    document.title = 'Login | Instagram Clone';
    if (localStorage.getItem('jwt_token') &&
        localStorage.getItem('refresh_token'))
        window.location.href = '..';
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var urlencoded, loginUser, loginData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    urlencoded = new URLSearchParams();
                    urlencoded.append('email', email);
                    urlencoded.append('password', password);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/login", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: urlencoded,
                            redirect: 'follow'
                        })];
                case 1:
                    loginUser = _a.sent();
                    return [4 /*yield*/, loginUser.json()];
                case 2:
                    loginData = _a.sent();
                    if (!loginData.success) {
                        setError(loginData.message);
                    }
                    else {
                        localStorage.setItem('jwt_token', loginData.data.jwt_token);
                        localStorage.setItem('refresh_token', loginData.data.refresh_token);
                        window.location.href = '..';
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' })),
        react_1["default"].createElement("div", { id: 'form' },
            react_1["default"].createElement("div", { className: 'centeredForm' },
                react_1["default"].createElement("h1", { id: 'heading-acc-manage', className: 'celestial-gradient-text' }, "Login to Instagram Clone"),
                react_1["default"].createElement("div", { className: 'box theme-reverse' },
                    react_1["default"].createElement("div", { className: 'box' },
                        react_1["default"].createElement("div", { className: 'tab', "data-tab": 'formTab' }),
                        react_1["default"].createElement("div", { className: 'tab-contents', id: 'formTab' },
                            react_1["default"].createElement("div", { id: 'login', className: 'tab-content tab-content-active' },
                                react_1["default"].createElement("form", { onSubmit: handleSubmit },
                                    react_1["default"].createElement("div", { className: 'form-group form-animate' },
                                        react_1["default"].createElement("label", { htmlFor: 'login-username', className: 'form-label endless-river-gradient-text' }, "Email"),
                                        react_1["default"].createElement("input", { type: 'email', className: 'input-animate', id: 'login-username', placeholder: 'test@example.com', required: true, onChange: onEmailChange })),
                                    react_1["default"].createElement("div", { className: 'form-group form-animate' },
                                        react_1["default"].createElement("label", { htmlFor: 'login-password', className: 'form-label endless-river-gradient-text' }, "Password"),
                                        react_1["default"].createElement("input", { type: showPass ? 'text' : 'password', className: 'input-animate emerald-gradient-text', id: 'login-password', placeholder: 'SuperSecretPassword', onChange: onPasswordChange, required: true })),
                                    react_1["default"].createElement("h2", { className: 'royal-gradient-text', style: { marginLeft: 20 } }, "Show Password"),
                                    react_1["default"].createElement("input", { type: 'checkbox', name: 'showPassword', checked: showPass, onChange: setChecked, id: 'showPass' }),
                                    react_1["default"].createElement("h3", { style: { marginLeft: 20 } },
                                        "Don't have an account?",
                                        react_1["default"].createElement("a", { href: '../sign-up' },
                                            react_1["default"].createElement("h4", { style: {
                                                    display: 'inline-block',
                                                    marginLeft: 5,
                                                    fontSize: 25
                                                } }, "Create One Here!"))),
                                    react_1["default"].createElement("div", { className: 'form-group' },
                                        react_1["default"].createElement("button", { type: 'submit', className: 'btn form-control theme-adjust' }, "Login"),
                                        react_1["default"].createElement("br", null),
                                        react_1["default"].createElement("span", { id: 'err' }, errorMessage)))),
                            react_1["default"].createElement("div", { id: 'register', className: 'tab-content' },
                                react_1["default"].createElement("div", { id: 'helloWorld', className: 'tab-content tab-content-active' },
                                    react_1["default"].createElement("form", { onSubmit: handleSubmit },
                                        react_1["default"].createElement("div", { className: 'form-group form-animate' },
                                            react_1["default"].createElement("label", { htmlFor: 'reg-username', className: 'form-label' }, "Username"),
                                            react_1["default"].createElement("input", { type: 'text', className: 'input-animate', id: 'reg-username', required: true })))))))),
                react_1["default"].createElement("div", { className: 'mb-5' }))),
        react_1["default"].createElement("p", { id: 'message-fire-ui' },
            react_1["default"].createElement("b", null,
                "Website designed with",
                ' ',
                react_1["default"].createElement("a", { href: 'https://fire-ui.netlify.app/' }, "Fire UI")))));
};
exports["default"] = Login;
