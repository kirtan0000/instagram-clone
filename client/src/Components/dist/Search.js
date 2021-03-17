"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("../Styles/AccountPage.css");
require("react-confirm-alert/src/react-confirm-alert.css");
var react_router_dom_1 = require("react-router-dom");
var Search = function () {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home")),
        react_1["default"].createElement("h1", null, " fd ")));
};
exports["default"] = Search;
