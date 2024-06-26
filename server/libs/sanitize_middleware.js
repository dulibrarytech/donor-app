'use strict'

const sanitizeHtml = require('sanitize-html');

exports.sanitizeData = (req, res, next) => {
  let data = req.body || {};
  for(let key in data) {
    data[key] = sanitizeHtml(data[key]).trim();
  }
  next();
}

exports.sanitizeQuery = (req, res, next) => {
  let data = req.query || {};
  for(let key in data) {
    data[key] = sanitizeHtml(data[key]).trim();
  }
  next();
}

exports.sanitizeParams = (req, res, next) => {
  let data = req.params || {};
  for(let key in data) {
    data[key] = sanitizeHtml(data[key]).trim();
  }
  next();
}
