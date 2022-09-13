/*
 * Wrapper for Javascript fetch api functions
 * Requires Session.svelte
 */
 'use strict'

import {Session} from './session.js';

const TIMEOUT = 12000;

export const ajaxRequest = (type="get", url="", callback, data=null, options=null, query=null) => {
  let defaultOptions = {
    method: type,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }

  if(data) defaultOptions['body'] = JSON.stringify(data);

  if (options == null) options = defaultOptions;

  if(query) {
    let value, queryString = "";
    Object.keys(query).forEach((param, index) => {
      value = query[param];
      if(index == 0 && url.indexOf('?') < 0) queryString += `?${param}=${value}`
      else queryString += `&${param}=${value}`
    });
    url += queryString;
  }

  if(Session.isSession("donor_db")) {
    options.headers['authorization'] = Session.getToken("donor_db");
  }

  let controller = new AbortController();
  fetchTimeout(url, TIMEOUT, controller.signal, controller, options)
    .then(response => {
      callback(null, response, response.status);
    })
    .catch(error => {
      if (error.name === "AbortError") {
          error = `Connection timeout: Server did not respond in ${TIMEOUT/1000} seconds.`;
          callback(error, null);
      } else {
          error = `Network error: ${error}`;
          callback(error, null);
      }
  });
}

export const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    ajaxRequest('GET', url, function(error, response, status) {
      if(error) {
        console.error(error);
        resolve([]);
      }
      else if(status != 200) resolve([]);
      else resolve(response.json());
    });
  });
}

const fetchTimeout = (url, ms, signal, controller, options={}) => {
  const promise = fetch(url, { signal, ...options });
  if (signal) signal.addEventListener("abort", () => controller.abort());
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};
