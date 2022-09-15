/*
 * Javascript date library module
 */

export const getNormalDateString = (dateObject) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
}

export const getIsoDateString = (date) => {
  const pad = n => n < 10 ? "0" + n : n;
  return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
}
