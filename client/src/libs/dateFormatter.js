/*
 * Javascript date library module
 */

export const getNormalDateString = (dateObject) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
}
