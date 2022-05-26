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

export const Donations = writable([
  {
    id: 1,
    lastName: "Smith",
    firstName: "John",
    dateOfGift: "2022-05-01",
    CDate: "2022-05-10",
    numberOfGifts: 25,
    type: "Standard",
    status: "Complete"
  },
  {
    id: 2,
    lastName: "Thompson",
    firstName: "Jill",
    dateOfGift: "2022-04-01",
    CDate: "2022-04-10",
    numberOfGifts: 2,
    type: "Important",
    status: "Pending"
  },
  {
    id: 3,
    lastName: "Wilson",
    firstName: "Mary",
    dateOfGift: "2022-03-01",
    CDate: "2022-03-10",
    numberOfGifts: 12,
    type: "Standard",
    status: "Pending"
  }
])
