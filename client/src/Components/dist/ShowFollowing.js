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
require("../Styles/AccountPage.css");
var API_BASE_1 = require("../Util/API_BASE");
require("react-confirm-alert/src/react-confirm-alert.css");
var Dark_1 = require("../Util/Dark");
var react_router_dom_1 = require("react-router-dom");
var HandleError_1 = require("../Util/HandleError");
require("../Styles/Followers.css");
var EditFavicon_1 = require("../Util/EditFavicon");
var ShowFollowing = function () {
    var _a = react_1.useState(''), name = _a[0], changeName = _a[1];
    var _b = react_1.useState([]), following = _b[0], setFollowing = _b[1];
    var _c = react_1.useState(0), followingCount = _c[0], setFollowingCount = _c[1];
    EditFavicon_1["default"]('/favicon.ico');
    document.title = "User's Following | Instagram Clone";
    if (localStorage.getItem('jwt_token') === null ||
        localStorage.getItem('refresh_token') === null)
        window.location.href = '../login';
    react_1.useEffect(function () {
        Dark_1["default"]();
        function getUserFollowing() {
            return __awaiter(this, void 0, void 0, function () {
                var fetchUserFollowing, userInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(API_BASE_1["default"] + "/get-user-following/" + window.location.pathname.split('/')[2])];
                        case 1:
                            fetchUserFollowing = _a.sent();
                            return [4 /*yield*/, fetchUserFollowing.json()];
                        case 2:
                            userInfo = _a.sent();
                            if (!userInfo.success) {
                                HandleError_1["default"](userInfo.message);
                            }
                            if (!userInfo.exists) {
                                document.title = 'User Not Found | Instagram Clone';
                                HandleError_1["default"]('The user does not exist', 'Not Found', false, function () { return (window.location.href = '../..'); });
                                return [2 /*return*/];
                            }
                            if (userInfo.needs_new_jwt === true)
                                localStorage.setItem('jwt_token', userInfo.jwt_token);
                            changeName(window.location.pathname.split('/')[2]);
                            setFollowing(userInfo.following);
                            setFollowingCount(userInfo.count);
                            return [2 /*return*/];
                    }
                });
            });
        }
        getUserFollowing();
    }, []);
    document.title = name + " is following " + (followingCount !== 1 ? followingCount + " people" : '1 person') + "| Instagram Clone";
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: "/user/" + name },
                "View ",
                name,
                "'s Profile"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
        followingCount === 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("br", null),
            react_1["default"].createElement("h3", null,
                name,
                " doesn't appear to follow anyone yet :(."))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("h1", null,
                name,
                " is following",
                ' ',
                followingCount !== 1 ? followingCount + " people" : '1 person',
                ":"),
            react_1["default"].createElement("br", null))),
        following.map(function (following) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: 'followingInfo' },
                react_1["default"].createElement(react_router_dom_1.Link, { to: "/user/" + following['username'] },
                    react_1["default"].createElement("img", { className: 'pfp', src: following['pfp'], alt: following['username'] })),
                react_1["default"].createElement("span", { className: 'followingName' },
                    "\u00A0",
                    react_1["default"].createElement(react_router_dom_1.Link, { to: "/user/" + following['username'] }, following['username']))),
            react_1["default"].createElement("hr", null))); })));
};
exports["default"] = ShowFollowing;
