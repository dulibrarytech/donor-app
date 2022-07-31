/*
 * Wrapper for Javascript fetch api functions
 * Requires Session.svelte
 */
 'use strict'

import {Session} from './session.js';

export const ajaxRequest = (type, url, callback, data=null, options=null, query=null) => {
  let defaultOptions = {
    method: type,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }
  if(data) options['body'] = JSON.stringify(data);

  if (options= null) options = defaultOptions;

  if(query) {
    let value, queryString = "";
    Object.keys(query).forEach((param, index) => {
      value = query[param];
      if(index == 0) queryString += `?${param}=${value}`
      else queryString += `&${param}=${value}`
    });
    url += queryString;
  }

  if(Session.isSession()) {
    options.headers['authorization'] = Session.getToken();
  }

  fetch(url, options)
    .then(response => {
      callback(null, response, response.status);
    })
    .catch(error => {
      callback(error, null);
    });
  //callback(null, JSON.stringify([]))
}
