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
require("../Styles/AccountPage.css");
var API_BASE_1 = require("../Util/API_BASE");
var Dark_1 = require("../Util/Dark");
var react_router_dom_1 = require("react-router-dom");
var HandleError_1 = require("../Util/HandleError");
var EditFavicon_1 = require("../Util/EditFavicon");
var Account = function () {
    var _a = react_1.useState(''), name = _a[0], changeName = _a[1];
    var _b = react_1.useState(''), userPfpUrl = _b[0], setPfpUrl = _b[1];
    var _c = react_1.useState(false), isFollowing = _c[0], setIsFollowing = _c[1];
    var _d = react_1.useState(false), isSelf = _d[0], setIsSelf = _d[1];
    var _e = react_1.useState(0), followersCount = _e[0], setFollowerCount = _e[1];
    var _f = react_1.useState(0), followingCount = _f[0], setFollowingCount = _f[1];
    var _g = react_1.useState([]), posts = _g[0], setPosts = _g[1];
    var _h = react_1.useState(false), userExists = _h[0], setUserExists = _h[1];
    var _j = react_1.useState(0), postsCount = _j[0], setPostsCount = _j[1];
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
                var get_user_params, fetchUser, userInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            get_user_params = new URLSearchParams();
                            get_user_params.append('jwt_token', jwt_token);
                            get_user_params.append('refresh_token', refresh_token);
                            return [4 /*yield*/, fetch(API_BASE_1["default"] + "/get-account/" + window.location.pathname.split('/')[2], {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: get_user_params,
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
                            if (!userInfo.exists) {
                                document.title = 'User Not Found | Instagram Clone';
                                setUserExists(false);
                                HandleError_1["default"]('The user does not exist', 'Not Found', false, function () { return (window.location.href = '../..'); });
                                return [2 /*return*/];
                            }
                            if (userInfo.needs_new_jwt === true)
                                localStorage.setItem('jwt_token', userInfo.jwt_token);
                            changeName(userInfo.user_name);
                            setPfpUrl(userInfo.user_pfp);
                            EditFavicon_1["default"](userInfo.user_pfp);
                            setIsFollowing(userInfo.isFollowing);
                            setFollowerCount(userInfo.totalFollowersCount);
                            setFollowingCount(userInfo.totalFollowingCount);
                            setIsSelf(userInfo.isSelf);
                            setPosts(userInfo.user_posts);
                            setPostsCount(userInfo.user_posts_length);
                            setUserExists(true);
                            document.title = userInfo.user_name + " | Instagram Clone";
                            return [2 /*return*/];
                    }
                });
            });
        }
        getUserInfo();
    }, []);
    var follow = function () { return __awaiter(void 0, void 0, void 0, function () {
        var follow_user_params, followUser, userFollowed, unfollow_user_params, unfollowUser, userunFollowed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!isFollowing) return [3 /*break*/, 3];
                    follow_user_params = new URLSearchParams();
                    follow_user_params.append('jwt_token', jwt_token);
                    follow_user_params.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/follow/" + window.location.pathname.split('/')[2], {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: follow_user_params,
                            redirect: 'follow'
                        })];
                case 1:
                    followUser = _a.sent();
                    return [4 /*yield*/, followUser.json()];
                case 2:
                    userFollowed = _a.sent();
                    if (!userFollowed.success) {
                        HandleError_1["default"](userFollowed.message);
                    }
                    if (userFollowed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', userFollowed.jwt_token);
                    setIsFollowing(true);
                    setFollowerCount(function (count) { return count + 1; });
                    return [3 /*break*/, 6];
                case 3:
                    unfollow_user_params = new URLSearchParams();
                    unfollow_user_params.append('jwt_token', jwt_token);
                    unfollow_user_params.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/unfollow/" + window.location.pathname.split('/')[2], {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: unfollow_user_params,
                            redirect: 'follow' // Ironic😉
                        })];
                case 4:
                    unfollowUser = _a.sent();
                    return [4 /*yield*/, unfollowUser.json()];
                case 5:
                    userunFollowed = _a.sent();
                    if (!userunFollowed.success) {
                        HandleError_1["default"](userunFollowed.message);
                        return [2 /*return*/];
                    }
                    if (userunFollowed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', userunFollowed.jwt_token);
                    setIsFollowing(false);
                    setFollowerCount(function (count) { return count - 1; });
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'view-account' },
            react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
                react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
                react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
                react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
                react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home"),
                react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
                react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post"),
                react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
            react_1["default"].createElement("div", { className: 'head_user' },
                react_1["default"].createElement("h2", { id: 'user-name-inf_' },
                    " ",
                    isSelf ? name + "(Me)" : name,
                    " "),
                react_1["default"].createElement(react_bootstrap_1.Image, { id: 'user_pfp_other', onError: function () { return setPfpUrl(API_BASE_1["default"] + "/pfps/default.jpg"); }, src: userPfpUrl }),
                !isSelf ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("button", { onClick: follow, id: 'follow-user' }, isFollowing ? 'Unfollow' : 'Follow'),
                    react_1["default"].createElement("div", { className: 'infoFol' },
                        react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/followers/" + name },
                            react_1["default"].createElement("h3", null,
                                react_1["default"].createElement("b", null, followersCount)),
                            react_1["default"].createElement("h4", null, "Followers "))),
                    react_1["default"].createElement("div", { className: 'infoPosts' },
                        react_1["default"].createElement("h3", null,
                            react_1["default"].createElement("b", null, postsCount)),
                        react_1["default"].createElement("h4", null, "Posts")),
                    react_1["default"].createElement("div", { className: 'infoFolw' },
                        react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/following/" + name },
                            react_1["default"].createElement("h3", null,
                                react_1["default"].createElement("b", { style: { marginLeft: 10, position: 'relative', top: 7 } }, followingCount)),
                            react_1["default"].createElement("h4", null, "Following"))))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: 'infoFol' },
                        react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/followers/" + name },
                            react_1["default"].createElement("h3", { className: 'followers-count-self' },
                                react_1["default"].createElement("b", null, followersCount),
                                react_1["default"].createElement("h4", null, "Followers "))),
                        react_1["default"].createElement("div", { className: 'infoPosts' },
                            react_1["default"].createElement("h3", null,
                                react_1["default"].createElement("b", null, postsCount)),
                            react_1["default"].createElement("h4", null, "Posts"))),
                    react_1["default"].createElement("div", { className: 'infoFolw' },
                        react_1["default"].createElement(react_router_dom_1.Link, { style: { color: 'white' }, to: "/following/" + name },
                            react_1["default"].createElement("h3", null,
                                react_1["default"].createElement("b", { style: { marginLeft: 10, position: 'relative', top: 7 } }, followingCount)),
                            react_1["default"].createElement("h4", null, "Following")))))),
            react_1["default"].createElement("hr", null),
            userExists ? (react_1["default"].createElement(react_1["default"].Fragment, null, postsCount === 0 ? (react_1["default"].createElement("h3", null,
                name,
                " doesn't have any posts yet...")) : (react_1["default"].createElement(react_1["default"].Fragment, null, posts.map(function (post, postKey) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(react_router_dom_1.Link, { to: "/posts/" + post.id },
                    react_1["default"].createElement("img", { className: 'user_post', src: post.image_id, alt: 'Post not found' })))); }))))) : (react_1["default"].createElement("h3", null, "User Not Found :(")))));
};
exports["default"] = Account;
