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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var API_BASE_1 = require("../Util/API_BASE");
require("react-confirm-alert/src/react-confirm-alert.css");
var Dark_1 = require("../Util/Dark");
var react_router_dom_1 = require("react-router-dom");
var HandleError_1 = require("../Util/HandleError");
require("../Styles/Post.css");
var EditFavicon_1 = require("../Util/EditFavicon");
var like_png_1 = require("../Images/like.png");
var filled_like_png_1 = require("../Images/filled-like.png");
var comment_png_1 = require("../Images/comment.png");
require("../Styles/MyFeed.css");
var MyFeed = function () {
    var _a = react_1.useState([]), allPosts = _a[0], setAllPosts = _a[1];
    var jwt_token = localStorage.getItem('jwt_token') || '';
    var refresh_token = localStorage.getItem('refresh_token') || '';
    react_1.useEffect(function () {
        Dark_1["default"]();
        document.title = 'My Feed | Instagram Clone';
        EditFavicon_1["default"]('/favicon.ico');
        function get_all_data() {
            return __awaiter(this, void 0, void 0, function () {
                var feedInfoParams, myFeedUnparsed, myFeed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            feedInfoParams = new URLSearchParams();
                            feedInfoParams.append('jwt_token', jwt_token);
                            feedInfoParams.append('refresh_token', refresh_token);
                            return [4 /*yield*/, fetch(API_BASE_1["default"] + "/get-my-feed", {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: feedInfoParams,
                                    redirect: 'follow'
                                })];
                        case 1:
                            myFeedUnparsed = _a.sent();
                            return [4 /*yield*/, myFeedUnparsed.json()];
                        case 2:
                            myFeed = _a.sent();
                            if (!myFeed.success) {
                                HandleError_1["default"](myFeed.message, 'Error', false);
                            }
                            if (myFeed.needs_new_jwt === true)
                                localStorage.setItem('jwt_token', myFeed.jwt_token);
                            setAllPosts(myFeed.data);
                            return [2 /*return*/];
                    }
                });
            });
        }
        get_all_data();
    }, []);
    var handleLikeClick = function (index, id) { return __awaiter(void 0, void 0, void 0, function () {
        var new_data, i, like_options, unparsed_like, like_parsed, unlike_options, unparsed_unlike, unlike_parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    new_data = allPosts;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < new_data.length)) return [3 /*break*/, 8];
                    if (!(new_data[i]['id'] === id)) return [3 /*break*/, 7];
                    if (!!new_data[i]['hadLiked']) return [3 /*break*/, 4];
                    like_options = new URLSearchParams();
                    like_options.append('jwt_token', jwt_token);
                    like_options.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/like/" + id, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: like_options,
                            redirect: 'follow'
                        })];
                case 2:
                    unparsed_like = _a.sent();
                    return [4 /*yield*/, unparsed_like.json()];
                case 3:
                    like_parsed = _a.sent();
                    if (!like_parsed.success) {
                        HandleError_1["default"](like_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (like_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', like_parsed.jwt_token);
                    new_data[i]['hadLiked'] = true;
                    new_data[i]['like_count']++;
                    return [3 /*break*/, 7];
                case 4:
                    unlike_options = new URLSearchParams();
                    unlike_options.append('jwt_token', jwt_token);
                    unlike_options.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/unlike/" + id, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: unlike_options,
                            redirect: 'follow'
                        })];
                case 5:
                    unparsed_unlike = _a.sent();
                    return [4 /*yield*/, unparsed_unlike.json()];
                case 6:
                    unlike_parsed = _a.sent();
                    if (!unlike_parsed.success) {
                        HandleError_1["default"](unlike_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (unlike_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', unlike_parsed.jwt_token);
                    new_data[i]['hadLiked'] = false;
                    new_data[i]['like_count']--;
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 1];
                case 8:
                    // This works
                    setAllPosts([]);
                    setAllPosts(function (prevPosts) { return __spreadArrays(prevPosts, new_data); }); // idk why it works
                    document.getElementsByClassName('like_type')[index].classList.add('pop_img');
                    setTimeout(function () {
                        try {
                            document
                                .getElementsByClassName('like_type')[index].classList.remove('pop_img');
                        }
                        catch (error) { }
                    }, 600);
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'topnav theme-reverse topnav-shadow' },
            react_1["default"].createElement("span", { className: 'topnav-brand' }, "Instagram Clone"),
            react_1["default"].createElement("span", { className: 'topnav-hamburger-menu', "data-target": 'myTopnav' }, "\u2630"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/' }, "Home"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
        allPosts.map(function (post, index) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: 'container' },
                react_1["default"].createElement("div", { className: 'contents' },
                    react_1["default"].createElement("div", { className: 'row' },
                        react_1["default"].createElement("div", { className: 'col-3' },
                            react_1["default"].createElement("div", { "data-theme": 'dark', className: 'card card_post_page card_all' },
                                react_1["default"].createElement("div", { className: 'author-info' },
                                    react_1["default"].createElement(react_router_dom_1.Link, { to: "../user/" + post.author },
                                        react_1["default"].createElement("img", { src: post.pfp, alt: 'Author Pfp Not Found', id: 'authorPostPfp', style: { float: 'left' } }),
                                        react_1["default"].createElement("h3", { style: { marginTop: 20 } }, post.author))),
                                react_1["default"].createElement("h1", { className: 'card-title title-single-post' }, post.title),
                                react_1["default"].createElement("hr", { id: 'sep-img-to-title' }),
                                react_1["default"].createElement("br", null),
                                react_1["default"].createElement("img", { id: 'post_img_single', src: post.image_id, alt: 'Post Image Not Found' }),
                                react_1["default"].createElement("br", null),
                                react_1["default"].createElement("img", { id: 'like_post_img_all', className: 'like_post_in like_type', src: post.hadLiked ? filled_like_png_1["default"] : like_png_1["default"], onClick: function () { return handleLikeClick(index, post.id); }, alt: 'Like', key: index }),
                                react_1["default"].createElement(react_router_dom_1.Link, { to: "/posts/" + post.id },
                                    react_1["default"].createElement("img", { id: 'comment_img_all', src: comment_png_1["default"], alt: 'Comments' })),
                                react_1["default"].createElement("div", { id: 'info_post_single' },
                                    react_1["default"].createElement("h3", { className: 'bold-text inf-all-post' }, post.like_count === 1
                                        ? post.like_count + " like"
                                        : post.like_count + " likes"),
                                    react_1["default"].createElement("h3", { className: 'bold-text inf-all-post' }, post.comment_count === 1
                                        ? post.comment_count + " comment"
                                        : post.comment_count + " comments")),
                                react_1["default"].createElement("br", null),
                                react_1["default"].createElement("span", { className: 'time-info-all' },
                                    "Posted on ",
                                    post.date)),
                            react_1["default"].createElement("br", null))))))); })));
};
exports["default"] = MyFeed;
