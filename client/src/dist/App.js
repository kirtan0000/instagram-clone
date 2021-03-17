"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
require("bootstrap/dist/css/bootstrap.min.css");
var Login_1 = require("./Components/Login");
var SignUp_1 = require("./Components/SignUp");
var MyAccount_1 = require("./Components/MyAccount");
var NotFound_1 = require("./Components/NotFound");
var Account_1 = require("./Components/Account");
var ShowFollowers_1 = require("./Components/ShowFollowers");
var ShowFollowing_1 = require("./Components/ShowFollowing");
var UploadPost_1 = require("./Components/UploadPost");
var Post_1 = require("./Components/Post");
var Redirect_1 = require("./Util/Redirect");
var SearchUser_1 = require("./Components/SearchUser");
var MyFeed_1 = require("./Components/MyFeed");
var App = function () {
    return (react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
        react_1["default"].createElement(react_router_dom_1.Switch, null,
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/', component: MyAccount_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/feed', component: MyFeed_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/login', component: Login_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/sign-up', component: SignUp_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/upload-post', component: UploadPost_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/user/:name', component: Account_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/posts/:id', component: Post_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/followers/:name', component: ShowFollowers_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/following/:name', component: ShowFollowing_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/search/users/', component: SearchUser_1["default"], exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/u/:name', component: function () { return (react_1["default"].createElement(Redirect_1["default"], { url: "../user/" + window.location.pathname.split('/')[2] })); }, exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/p/:id', component: function () { return (react_1["default"].createElement(Redirect_1["default"], { url: "../posts/" + window.location.pathname.split('/')[2] })); }, exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/f/:id', component: function () { return (react_1["default"].createElement(Redirect_1["default"], { url: "../followers/" + window.location.pathname.split('/')[2] })); }, exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/fi/:id', component: function () { return (react_1["default"].createElement(Redirect_1["default"], { url: "../following/" + window.location.pathname.split('/')[2] })); }, exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: '/su', component: function () { return react_1["default"].createElement(Redirect_1["default"], { url: "../search/users/" }); }, exact: true }),
            react_1["default"].createElement(react_router_dom_1.Route, { component: NotFound_1["default"], exact: true }))));
};
exports["default"] = App;
