/*
 * Wrapper for Javascript fetch api functions
 */

export const ajaxRequest = (type, url, callback, data=null) => {
  let options = {
    method: type,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }
  if(data) options['body'] = JSON.stringify(data);

  fetch(url, options)
    .then(response => {
      callback(null, response, response.status);
    })
    .catch(error => {
      callback(error, null);
    });
}
