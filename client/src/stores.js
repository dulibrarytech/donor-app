import { writable } from 'svelte/store'

export const Donors = writable([
  {
    id: 1,
    lastName: "Anonymous",
    firstName: "Donor",
  },
  {
    id: 2,
    lastName: "Johnson",
    firstName: "Bill",
  },
  {
    id: 3,
    lastName: "Wilson",
    firstName: "Mary",
  },
  {
    id: 4,
    lastName: "Smith",
    firstName: "John",
  },
  {
    id: 5,
    lastName: "Thompson",
    firstName: "Jill",
  },
  {
    id: 6,
    lastName: "Some Corporation",
    firstName: "",
  },
  {
    id: 7,
    lastName: "Johnson",
    firstName: "Bill",
  },
  {
    id: 8,
    lastName: "Wilson",
    firstName: "Mary",
  },
  {
    id: 9,
    lastName: "Smith",
    firstName: "John",
  },
  {
    id: 10,
    lastName: "Thompson",
    firstName: "Jill",
  },
  {
    id: 11,
    lastName: "Some Corporation",
    firstName: "",
  }
])

export const Donations = writable([
  
])
