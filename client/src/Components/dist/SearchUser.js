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
var Dark_1 = require("../Util/Dark");
var react_router_dom_1 = require("react-router-dom");
require("../Styles/SearchUser.css");
var HandleError_1 = require("../Util/HandleError");
var EditFavicon_1 = require("../Util/EditFavicon");
var SearchUser = function () {
    var _a = react_1.useState(''), searchVal = _a[0], setSearchVal = _a[1];
    var _b = react_1.useState([]), results = _b[0], setResults = _b[1];
    var _c = react_1.useState(''), resultsAmount = _c[0], setResultsAmount = _c[1];
    EditFavicon_1["default"]('/favicon.ico');
    if (localStorage.getItem('jwt_token') === null ||
        localStorage.getItem('refresh_token') === null)
        window.location.href = '../login';
    var search = function () { return __awaiter(void 0, void 0, void 0, function () {
        var resultsUnparsed, resultsParsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (searchVal === '' || !searchVal.replace(/\s/g, '').length) {
                        HandleError_1["default"]('Please enter a valid username.', 'Invalid Username', false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/search-user/" + searchVal)];
                case 1:
                    resultsUnparsed = _a.sent();
                    return [4 /*yield*/, resultsUnparsed.json()];
                case 2:
                    resultsParsed = _a.sent();
                    if (!resultsParsed.success) {
                        HandleError_1["default"](resultsParsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    setResults(resultsParsed.results);
                    setResultsAmount("Total Results: " + resultsParsed.amount);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (event) {
        setSearchVal(event.target.value);
    };
    react_1.useEffect(function () {
        Dark_1["default"]();
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post")),
        react_1["default"].createElement("input", { onChange: handleInputChange, id: 'search_user', placeholder: 'Search For Username...' }),
        react_1["default"].createElement("button", { id: 'search-user-btn', className: 'btn btn-success btn-hover', onClick: search }, "Search Name"),
        parseInt(resultsAmount.split(' ')[2]) === 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("h3", { id: 'results-not-found-search' }, "No users were found with that specific query. Please check your spelling and try again."))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("h2", null, resultsAmount),
            results.map(function (result) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: 'user-search-inf-result' },
                    react_1["default"].createElement(react_router_dom_1.Link, { to: "/user/" + result['username'] },
                        react_1["default"].createElement("img", { className: 'pfp', src: result['pfp'], alt: '' })),
                    react_1["default"].createElement("span", { className: 'user_name_search' },
                        ' ',
                        react_1["default"].createElement(react_router_dom_1.Link, { to: "/user/" + result['username'] }, result['username']))),
                react_1["default"].createElement("hr", null))); })))));
};
exports["default"] = SearchUser;
