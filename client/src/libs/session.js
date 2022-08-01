/*
 * Functions for managing session with sessionStorage
 */
 'use strict'

 export const Session = (() => {
   const create = (sessionName, jwt, data) => {
     let sessionData = {jwt, data};
     sessionStorage.setItem(sessionName, JSON.stringify(sessionData));
   }

   const destroy = (sessionName) => {
     sessionStorage.removeItem(sessionName);
   }

   const getToken = (sessionName) => {
     return JSON.parse(sessionStorage.getItem(sessionName)).jwt ?? null;
   }

   const getData = (sessionName) => {
     return JSON.parse(sessionStorage.getItem(sessionName)).data || null;
   }

   const getDataItem = (sessionName, key) => {
     let sessionData = {};
     if(sessionStorage.getItem(sessionName)) {
       sessionData = JSON.parse(sessionStorage.getItem(sessionName)).data || {}
     }
     return sessionData[key] || null;
   }

   const isSession = (sessionName) => {
     return sessionStorage.getItem(sessionName) ? true : false;
   }

   return {
     create,
     destroy,
     getToken,
     getData,
     getDataItem,
     isSession
   }
 })()
