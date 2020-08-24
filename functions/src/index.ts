'use strict'

import admin = require("firebase-admin");

admin.initializeApp();

const entries = require("./newEntry");
exports.newEntry = entries.newEntry;

const stat = require("./stat");
exports.stat = stat.stat;

/*const likes = require("./newLike");
exports.newLike = likes.newLike;

const reports = require("./newReport");
exports.newReport = reports.newReport;*/

