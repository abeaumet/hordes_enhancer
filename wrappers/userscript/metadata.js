// ==UserScript==
//
// @name <%= full_name %>
// @version <%= version %>
// @description <%= description %>
// @author <%= author.name %> <<%= author.email %>>
// @license <%= licenses[0].type %> <%= licenses[0].url %>
// @icon <%= userscript.icon %>
// @downloadURL <%= userscript.download_url %>
// @updateURL <%= userscript.download_url %>
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
//
<% for (var i = 0, max = matching_urls.length; i < max; i += 1) {
%>// @match http://<%- matching_urls[i] %>/*
<% } %>//
// @grant GM_xmlhttpRequest
<% for (var i = 0, max = cross_origin_xhr_permissions.length; i < max; i += 1) {
%>// @match http://<%- cross_origin_xhr_permissions[i] %>/*
// @exclude http://<%- cross_origin_xhr_permissions[i] %>/*
// @connect http://<%- cross_origin_xhr_permissions[i] %>/*
// @connect <%- cross_origin_xhr_permissions[i] %>
<% } %>//
// ==/UserScript==
