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
    title: "Mrs",
    lastName: "Wilson",
    firstName: "Mary",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
    organization: null,
    country: "",
    anonymous: 0
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
    lastName: "Friedland",
    firstName: "Archie",
    organization: "Microsoft"
  },
  {
    id: 7,
    lastName: "Johnson",
    firstName: "Bob",
  },
  {
    id: 8,
    lastName: "Wilson",
    firstName: "Jenny",
  },
  {
    id: 9,
    lastName: "Smith",
    firstName: "Frank",
  },
  {
    id: 10,
    lastName: "Thompson",
    firstName: "Rob",
  },
  {
    id: 11,
    lastName: "Some Corporation",
    firstName: "",
  }
])
