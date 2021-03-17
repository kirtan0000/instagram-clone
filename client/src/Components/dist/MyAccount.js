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
var react_bootstrap_1 = require("react-bootstrap");
require("../Styles/HomePage.css");
var API_BASE_1 = require("../Util/API_BASE");
var react_confirm_alert_1 = require("react-confirm-alert");
var Dark_1 = require("../Util/Dark");
var HandleError_1 = require("../Util/HandleError");
var react_router_dom_1 = require("react-router-dom");
var EditFavicon_1 = require("../Util/EditFavicon");
var MyAccount = function () {
    var _a = react_1.useState(''), name = _a[0], changeName = _a[1];
    var _b = react_1.useState(''), userPfpUrl = _b[0], setPfpUrl = _b[1];
    var _c = react_1.useState([]), posts = _c[0], setPosts = _c[1];
    var _d = react_1.useState(0), postsCount = _d[0], setPostsCount = _d[1];
    var _e = react_1.useState(0), followersCount = _e[0], setFollowerCount = _e[1];
    var _f = react_1.useState(0), followingCount = _f[0], setFollowingCount = _f[1];
    document.title = 'My Account | Instagram Clone';
    if (localStorage.getItem('jwt_token') === null ||
        localStorage.getItem('refresh_token') === null)
        window.location.href = '../login';
    var jwt_token = localStorage.getItem('jwt_token') || '';
    var refresh_token = localStorage.getItem('refresh_token') || '';
    // Run only once
    react_1.useEffect(function () {
        Dark_1["default"]();
        function getUserInfo() {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoParams, fetchUser, userInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userInfoParams = new URLSearchParams();
                            userInfoParams.append('jwt_token', jwt_token);
                            userInfoParams.append('refresh_token', refresh_token);
                            return [4 /*yield*/, fetch(API_BASE_1["default"] + "/get-my-info", {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: userInfoParams,
                                    redirect: 'follow'
                                })];
                        case 1:
                            fetchUser = _a.sent();
                            return [4 /*yield*/, fetchUser.json()];
                        case 2:
                            userInfo = _a.sent();
                            if (!userInfo.success) {
                                HandleError_1["default"](userInfo.message);
                            }
                            if (userInfo.needs_new_jwt === true)
                                localStorage.setItem('jwt_token', userInfo.jwt_token);
                            changeName(userInfo.user_name);
                            setPfpUrl(userInfo.user_pfp);
                            EditFavicon_1["default"](userInfo.user_pfp);
                            setPosts(userInfo.user_posts);
                            setPostsCount(userInfo.user_posts_length);
                            setFollowerCount(userInfo.totalFollowersCount);
                            setFollowingCount(userInfo.totalFollowingCount);
                            return [2 /*return*/];
                    }
                });
            });
        }
        getUserInfo();
    }, []);
    var changePfpButton = function () {
        var realPfpUpload = document.querySelector('#upload_new_pfp');
        if (realPfpUpload !== null)
            realPfpUpload.click(); // TypeScript forces you to check for null HTMLElements...
    };
    var newPfpUpload = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var pfpFile, extPfp, pfpFormdata, upload_pfp, done_upload, pfp_id, change_pfp_params, change_pfp, change_pfp_data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    pfpFile = event.target.files[0];
                    extPfp = ((_a = pfpFile === null || pfpFile === void 0 ? void 0 : pfpFile.name) === null || _a === void 0 ? void 0 : _a.split('.')) ? (_b = pfpFile === null || pfpFile === void 0 ? void 0 : pfpFile.name) === null || _b === void 0 ? void 0 : _b.split('.')[1] : '';
                    if ((extPfp === null || extPfp === void 0 ? void 0 : extPfp.toLowerCase()) !== 'jpg' &&
                        extPfp !== 'png' &&
                        extPfp !== 'jpeg') {
                        HandleError_1["default"]('Only images are allowed', 'Invalid file', false);
                        return [2 /*return*/];
                    }
                    pfpFormdata = new FormData();
                    pfpFormdata.append('pfp', pfpFile);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/upload-pfp", {
                            method: 'POST',
                            body: pfpFormdata,
                            redirect: 'follow'
                        })];
                case 1:
                    upload_pfp = _c.sent();
                    return [4 /*yield*/, upload_pfp.json()];
                case 2:
                    done_upload = _c.sent();
                    if (!done_upload.success) {
                        HandleError_1["default"](done_upload.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    pfp_id = done_upload.id;
                    change_pfp_params = new URLSearchParams();
                    change_pfp_params.append('id', pfp_id);
                    change_pfp_params.append('jwt_token', jwt_token);
                    change_pfp_params.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/change-pfp", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: change_pfp_params,
                            redirect: 'follow'
                        })];
                case 3:
                    change_pfp = _c.sent();
                    return [4 /*yield*/, change_pfp.json()];
                case 4:
                    change_pfp_data = _c.sent();
                    if (!change_pfp_data.success) {
                        HandleError_1["default"](change_pfp_data.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (change_pfp_data.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', change_pfp_data.jwt_token);
                    setPfpUrl(change_pfp_data.url);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        react_confirm_alert_1.confirmAlert({
            title: 'Are you sure?',
            message: 'Are you sure that you want to logout?',
            buttons: [
                {
                    label: 'No',
                    onClick: function () { }
                },
                {
                    label: 'Yes',
                    onClick: function () {
                        localStorage.removeItem('jwt_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = "../login";
                    }
                }
            ],
            childrenElement: function () { return react_1["default"].createElement("div", null); },
            closeOnEscape: false,
            closeOnClickOutside: false,
            willUnmount: function () { },
            onClickOutside: function () { },
            onKeypressEscape: function () { },
            overlayClassName: 'overlay-custom-class-name'
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '#', onClick: handleLogout }, "Logout")),
        react_1["default"].createElement("div", { className: 'head' },
            react_1["default"].createElement("h2", { id: 'user-head-name-me' },
                " ",
                name,
                " "),
            react_1["default"].createElement(react_bootstrap_1.Image, { id: 'user_pfp', onError: function () { return setPfpUrl(API_BASE_1["default"] + "/pfps/default.jpg"); }, src: userPfpUrl })),
        react_1["default"].createElement("button", { id: 'showPfpModal', onClick: changePfpButton }, "Change Profile Picture"),
        react_1["default"].createElement("div", { className: 'infoFolMe' },
            react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/followers/" + name },
                react_1["default"].createElement("h3", { className: 'followers-count-self' },
                    react_1["default"].createElement("b", { style: { marginLeft: 50 } }, followersCount),
                    react_1["default"].createElement("h4", null, "Followers")))),
        react_1["default"].createElement("div", { className: 'infoPostsMe' },
            react_1["default"].createElement("h3", null,
                react_1["default"].createElement("b", { style: { marginLeft: 20, position: 'relative', top: 7 } }, postsCount)),
            react_1["default"].createElement("h4", null, "Posts")),
        react_1["default"].createElement("div", { className: 'infoFolwMe' },
            react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/following/" + name },
                react_1["default"].createElement("h3", null,
                    react_1["default"].createElement("b", { style: { marginLeft: 46, position: 'relative', top: 7 } }, followingCount)),
                react_1["default"].createElement("h4", null, "Following"))),
        react_1["default"].createElement("input", { style: { display: 'none' }, type: 'file', name: 'pfp', id: 'upload_new_pfp', accept: '.png,.jpeg,.jpg', onChange: newPfpUpload }),
        react_1["default"].createElement("hr", null),
        postsCount === 0 ? (react_1["default"].createElement("h3", null,
            "You don't have any posts yet...",
            react_1["default"].createElement("br", null),
            react_1["default"].createElement(react_router_dom_1.Link, { to: '/upload-post' }, "Create One Now!"))) : (react_1["default"].createElement(react_1["default"].Fragment, null, posts.map(function (post, postKey) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(react_router_dom_1.Link, { to: "/posts/" + post.id },
                react_1["default"].createElement("img", { className: 'user_post_p', src: post.image_id, alt: 'Image not found' })))); })))));
};
exports["default"] = MyAccount;
