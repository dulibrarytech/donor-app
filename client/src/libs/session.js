/*
 * Funcitons for managing session with sessionStorage
 */
 'use strict'

 const sessionName = "donordb";

 export const Session = (() => {
   const create = (jwt, data) => {
     let sessionData = {jwt, data};
     sessionStorage.setItem(sessionName, JSON.stringify(sessionData));
   }

   const destroy = () => {
     sessionStorage.removeItem(sessionName);
   }

   const getToken = () => {
     return JSON.parse(sessionStorage.getItem(sessionName)).jwt ?? null;
   }

   const getData = () => {
     return JSON.parse(sessionStorage.getItem(sessionName)).data || null;
   }

   const getDataItem = (key) => {
     let sessionData = JSON.parse(sessionStorage.getItem(sessionName)).data || {};
     return sessionData[key] || null;
   }

   const isSession = () => {
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
