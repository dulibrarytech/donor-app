/*
 * Wrapper for Javascript fetch api functions
 * Requires Session.svelte
 */
 'use strict'

import {Session} from './session.js';

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

  fetch(url, options)
    .then(response => {
      callback(null, response, response.status);
    })
    .catch(error => {
      callback(error, null);
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
