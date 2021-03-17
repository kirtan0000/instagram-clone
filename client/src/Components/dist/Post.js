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
var Post = function () {
    var _a = react_1.useState(''), title = _a[0], changeTitle = _a[1];
    var _b = react_1.useState(''), imageUrl = _b[0], changeImageUrl = _b[1];
    var _c = react_1.useState(''), authorName = _c[0], setAuthorName = _c[1];
    var _d = react_1.useState(''), authorPfp = _d[0], setAuthorPfp = _d[1];
    var _e = react_1.useState(''), timestamp = _e[0], setTimestamp = _e[1];
    var _f = react_1.useState(0), likeAmount = _f[0], setLikeAmount = _f[1];
    var _g = react_1.useState(false), hasLiked = _g[0], setHasLiked = _g[1];
    var _h = react_1.useState(''), commentInput = _h[0], setCommentInput = _h[1];
    var _j = react_1.useState([]), comments = _j[0], setComments = _j[1];
    var _k = react_1.useState(0), commentAmount = _k[0], setCommentAmount = _k[1];
    var id = window.location.href.split('/')[4];
    var jwt_token = localStorage.getItem('jwt_token') || '';
    var refresh_token = localStorage.getItem('refresh_token') || '';
    var updateCommentInput = function (event) { return setCommentInput(event.target.value); };
    react_1.useEffect(function () {
        document.title = 'Post | Instagram Clone';
        Dark_1["default"]();
        function getPostData() {
            return __awaiter(this, void 0, void 0, function () {
                var get_post_options, post_data_raw, post_data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            get_post_options = new URLSearchParams();
                            get_post_options.append('jwt_token', jwt_token);
                            get_post_options.append('refresh_token', refresh_token);
                            return [4 /*yield*/, fetch(API_BASE_1["default"] + "/get-post/" + id, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: get_post_options,
                                    redirect: 'follow'
                                })];
                        case 1:
                            post_data_raw = _a.sent();
                            return [4 /*yield*/, post_data_raw.json()];
                        case 2:
                            post_data = _a.sent();
                            if (!post_data.exists) {
                                if (post_data.message === 'User Not Found!') {
                                    window.location.href = '/login';
                                    return [2 /*return*/];
                                }
                                HandleError_1["default"](post_data.message, 'Not Found', false, function () {
                                    window.location.href = '/';
                                    return;
                                });
                            }
                            else {
                                if (post_data.needs_new_jwt === true)
                                    localStorage.setItem('jwt_token', post_data.jwt_token);
                                changeTitle(post_data.data.title);
                                changeImageUrl(post_data.data.image_url);
                                EditFavicon_1["default"](post_data.data.image_url);
                                setAuthorName(post_data.data.author);
                                setAuthorPfp(post_data.data.pfp);
                                setTimestamp(post_data.data.timestamp);
                                setLikeAmount(post_data.data.likes);
                                setHasLiked(post_data.hasUserLiked);
                                setComments(post_data.data.comments);
                                setCommentAmount(post_data.data.comment_count);
                                document.title = post_data.data.title + " | Instagram Clone";
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        getPostData();
    }, []);
    var handleLikeClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var unlike_options, unparsed_unlike, unlike_parsed, like_options, unparsed_like, like_parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hasLiked) return [3 /*break*/, 3];
                    unlike_options = new URLSearchParams();
                    unlike_options.append('jwt_token', jwt_token);
                    unlike_options.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/unlike/" + id, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: unlike_options,
                            redirect: 'follow'
                        })];
                case 1:
                    unparsed_unlike = _a.sent();
                    return [4 /*yield*/, unparsed_unlike.json()];
                case 2:
                    unlike_parsed = _a.sent();
                    if (!unlike_parsed.success) {
                        HandleError_1["default"](unlike_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (unlike_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', unlike_parsed.jwt_token);
                    setHasLiked(false);
                    setLikeAmount(function (count) { return count - 1; });
                    return [3 /*break*/, 6];
                case 3:
                    like_options = new URLSearchParams();
                    like_options.append('jwt_token', jwt_token);
                    like_options.append('refresh_token', refresh_token);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/like/" + id, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: like_options,
                            redirect: 'follow'
                        })];
                case 4:
                    unparsed_like = _a.sent();
                    return [4 /*yield*/, unparsed_like.json()];
                case 5:
                    like_parsed = _a.sent();
                    if (!like_parsed.success) {
                        HandleError_1["default"](like_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (like_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', like_parsed.jwt_token);
                    setHasLiked(true);
                    setLikeAmount(function (count) { return count + 1; });
                    _a.label = 6;
                case 6:
                    document
                        .querySelector('#like_post_img')
                        .classList.add('pop_img');
                    setTimeout(function () {
                        try {
                            document
                                .querySelector('#like_post_img')
                                .classList.remove('pop_img');
                        }
                        catch (error) { }
                    }, 600);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCommentClick = function () {
        return document.getElementsByClassName('comments')[0].scrollIntoView();
    };
    var submitNewComment = function () { return __awaiter(void 0, void 0, void 0, function () {
        var comment_options, comment_data_raw, comment_parsed, new_comment_section;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (commentInput === '' ||
                        !commentInput.replace(/\s/g, '').length ||
                        commentInput.length < 4) {
                        HandleError_1["default"]('The comment must have 4 or more characters.', 'Invalid Comment', false);
                        return [2 /*return*/];
                    }
                    if (commentInput.length > 70) {
                        HandleError_1["default"]('The comment must have less than 70 characters.', 'Invalid Comment', false);
                        return [2 /*return*/];
                    }
                    comment_options = new URLSearchParams();
                    comment_options.append('jwt_token', jwt_token);
                    comment_options.append('refresh_token', refresh_token);
                    comment_options.append('content', commentInput);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/comment/" + id, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: comment_options,
                            redirect: 'follow'
                        })];
                case 1:
                    comment_data_raw = _a.sent();
                    return [4 /*yield*/, comment_data_raw.json()];
                case 2:
                    comment_parsed = _a.sent();
                    if (!comment_parsed.success) {
                        HandleError_1["default"](comment_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (comment_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', comment_parsed.jwt_token);
                    new_comment_section = comments;
                    new_comment_section.unshift(comment_parsed.data);
                    setComments(new_comment_section);
                    setCommentAmount(function (count) { return count + 1; });
                    setCommentInput('');
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
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/feed' }, "My Feed"),
            react_1["default"].createElement("div", { className: 'topnav-right', id: 'myTopnav' }),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: "/user/" + authorName },
                "View ",
                authorName,
                "'s profile"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/upload-post' }, "Create Post"),
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
        react_1["default"].createElement("div", { className: 'container' },
            react_1["default"].createElement("div", { className: 'contents' },
                react_1["default"].createElement("div", { className: 'row' },
                    react_1["default"].createElement("div", { className: 'col-3' },
                        react_1["default"].createElement("div", { "data-theme": 'dark', className: 'card card_post_page' },
                            react_1["default"].createElement("div", { className: 'author-info' },
                                react_1["default"].createElement(react_router_dom_1.Link, { to: "../user/" + authorName },
                                    react_1["default"].createElement("img", { src: authorPfp, alt: 'Author Pfp Not Found', id: 'authorPostPfp', style: { float: 'left' } }),
                                    react_1["default"].createElement("h3", { style: { marginTop: 20 } }, authorName))),
                            react_1["default"].createElement("h1", { className: 'card-title title-single-post' }, title),
                            react_1["default"].createElement("hr", { id: 'sep-img-to-title' }),
                            react_1["default"].createElement("br", null),
                            react_1["default"].createElement("img", { id: 'post_img_single', src: imageUrl, alt: 'Post Image Not Found' }),
                            react_1["default"].createElement("br", null),
                            react_1["default"].createElement("img", { id: 'like_post_img', src: hasLiked ? filled_like_png_1["default"] : like_png_1["default"], onClick: handleLikeClick, alt: 'Like' }),
                            react_1["default"].createElement("img", { id: 'comment_img', src: comment_png_1["default"], onClick: handleCommentClick, alt: 'Comments' }),
                            react_1["default"].createElement("div", { id: 'info_post_single' },
                                react_1["default"].createElement("h3", { className: 'bold-text' }, likeAmount === 1
                                    ? likeAmount + " like"
                                    : likeAmount + " likes"),
                                react_1["default"].createElement("h3", { className: 'bold-text' }, commentAmount === 1
                                    ? commentAmount + " comment"
                                    : commentAmount + " comments")),
                            react_1["default"].createElement("br", null),
                            react_1["default"].createElement("span", { className: 'time-info' },
                                "Posted on ",
                                timestamp)))))),
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("textarea", { id: 'comment-inp', placeholder: 'Say Something Nice!', onChange: updateCommentInput, value: commentInput }),
        react_1["default"].createElement("button", { onClick: submitNewComment, id: 'submit-comment-post' }, "Comment"),
        react_1["default"].createElement("div", { className: 'comments' }, commentAmount === 0 ? (react_1["default"].createElement("h2", null, "No Comments Yet...")) : (react_1["default"].createElement(react_1["default"].Fragment, null, comments.map(function (comment) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("br", null),
            react_1["default"].createElement("div", { className: 'comment-full-all' },
                react_1["default"].createElement("div", { className: 'commentAuthor' },
                    react_1["default"].createElement(react_router_dom_1.Link, { to: "/user/" + comment['author'] },
                        react_1["default"].createElement("img", { className: 'pfp', src: comment['pfp'], alt: comment['username'] }),
                        react_1["default"].createElement("h3", { className: 'authorNameComment' }, comment['author'])),
                    react_1["default"].createElement("br", null)),
                react_1["default"].createElement("h4", { className: 'comment-data' }, comment['content']),
                react_1["default"].createElement("span", { className: 'comment-data-info' },
                    "Commented on ",
                    comment['date']),
                react_1["default"].createElement("hr", { className: 'comment-seperator' })))); }))))));
};
exports["default"] = Post;
