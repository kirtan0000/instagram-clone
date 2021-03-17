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
require("../Styles/HomePage.css");
var API_BASE_1 = require("../Util/API_BASE");
require("react-confirm-alert/src/react-confirm-alert.css");
var Dark_1 = require("../Util/Dark");
require("../Styles/UploadPost.css");
var react_router_dom_1 = require("react-router-dom");
var HandleError_1 = require("../Util/HandleError");
var EditFavicon_1 = require("../Util/EditFavicon");
var UploadPost = function () {
    var _a = react_1.useState(''), current_title = _a[0], setCurrentTitle = _a[1];
    var setTitle = function (event) { return setCurrentTitle(event.target.value); };
    react_1.useEffect(function () {
        Dark_1["default"]();
        EditFavicon_1["default"]('/favicon.ico');
        document.title = 'Upload Post | Instagram Clone'; // Stupid client side rendering doesn't let me use the <title> tag🙄
    }, []);
    if (localStorage.getItem('jwt_token') === null ||
        localStorage.getItem('refresh_token') === null)
        window.location.href = '../login';
    var jwt_token = localStorage.getItem('jwt_token') || '';
    var refresh_token = localStorage.getItem('refresh_token') || '';
    var submitPost = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var imageFile, imageExtension, upload_post_form, upload_new, upload_parsed, post_image_uri, postparams, new_post, new_post_parsed, new_post_id;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    event.preventDefault();
                    imageFile = event.target.post.files[0];
                    imageExtension = ((_a = imageFile === null || imageFile === void 0 ? void 0 : imageFile.name) === null || _a === void 0 ? void 0 : _a.split('.')) ? (_b = imageFile === null || imageFile === void 0 ? void 0 : imageFile.name) === null || _b === void 0 ? void 0 : _b.split('.')[1] : '';
                    if ((imageExtension === null || imageExtension === void 0 ? void 0 : imageExtension.toLowerCase()) !== 'jpg' &&
                        imageExtension !== 'png' &&
                        imageExtension !== 'jpeg') {
                        HandleError_1["default"]('Only images are allowed', 'Invalid file', false);
                        return [2 /*return*/];
                    }
                    upload_post_form = new FormData();
                    upload_post_form.append('post', imageFile);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/upload-post-image", {
                            method: 'POST',
                            body: upload_post_form,
                            redirect: 'follow'
                        })];
                case 1:
                    upload_new = _c.sent();
                    return [4 /*yield*/, upload_new.json()];
                case 2:
                    upload_parsed = _c.sent();
                    if (!upload_parsed.success) {
                        HandleError_1["default"](upload_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    post_image_uri = upload_parsed.uri;
                    postparams = new URLSearchParams();
                    postparams.append('jwt_token', jwt_token);
                    postparams.append('refresh_token', refresh_token);
                    postparams.append('img_url', post_image_uri);
                    postparams.append('title', current_title);
                    return [4 /*yield*/, fetch(API_BASE_1["default"] + "/upload-post", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: postparams,
                            redirect: 'follow'
                        })];
                case 3:
                    new_post = _c.sent();
                    return [4 /*yield*/, new_post.json()];
                case 4:
                    new_post_parsed = _c.sent();
                    if (!new_post_parsed.success) {
                        HandleError_1["default"](new_post_parsed.message, 'Error', false);
                        return [2 /*return*/];
                    }
                    if (new_post_parsed.needs_new_jwt === true)
                        localStorage.setItem('jwt_token', new_post_parsed.jwt_token);
                    new_post_id = new_post_parsed.id;
                    window.location.href = "../posts/" + new_post_id;
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
            react_1["default"].createElement(react_router_dom_1.Link, { className: 'topnav-item', to: '/search/users' }, "Search For Users")),
        react_1["default"].createElement("div", { className: 'box box-shadow full-center' },
            react_1["default"].createElement("h1", { id: 'upload-head', className: 'box-title' }, "Upload Post"),
            react_1["default"].createElement("form", { onSubmit: submitPost },
                react_1["default"].createElement("div", { className: 'form-group' },
                    react_1["default"].createElement("label", { htmlFor: 'ttlPost' }, "Enter Title Name:"),
                    react_1["default"].createElement("input", { className: 'form-control form-animate', type: 'text', name: 'ttlPost', placeholder: 'Title Name Here...', required: true, autoComplete: 'off', onChange: setTitle })),
                react_1["default"].createElement("div", { className: 'form-group' },
                    react_1["default"].createElement("label", { className: 'form-label', htmlFor: 'post' }, "Upload Image:"),
                    react_1["default"].createElement("input", { className: 'form-control form-animate', type: 'file', name: 'post', id: 'post-file', accept: '.png,.jpeg,.jpg', required: true })),
                react_1["default"].createElement("input", { type: 'submit', className: 'btn btn-success form-control form-animate', value: 'Post!', id: 'post-btn' })))));
};
exports["default"] = UploadPost;
