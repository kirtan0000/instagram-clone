"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
require("../Styles/NotFound.css");
var Dark_1 = require("../Util/Dark");
var EditFavicon_1 = require("../Util/EditFavicon");
var NotFound = function () {
    var _a = react_1.useState('/'), not_found_path = _a[0], set_path = _a[1];
    react_1.useEffect(function () {
        Dark_1["default"]();
        set_path(window.location.pathname);
        EditFavicon_1["default"]('/favicon.ico');
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
        react_1["default"].createElement("div", { className: 'not_found' },
            react_1["default"].createElement("h1", null, " 404 Not Found "),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("span", null,
                    "The Requested Path ",
                    react_1["default"].createElement("b", null,
                        "'",
                        not_found_path,
                        "'"),
                    " Was Not Found On The Server!"),
                react_1["default"].createElement("br", null),
                react_1["default"].createElement("br", null),
                react_1["default"].createElement(react_router_dom_1.Link, { to: '/' }, "Go Home!")))));
};
exports["default"] = NotFound;
