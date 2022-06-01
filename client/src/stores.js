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
    lastName: "",
    firstName: "",
    organization: "Apple Corp."
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
    donorId: 4,
    lastName: "Smith",
    firstName: "John",
    dateOfGift: "2022-05-01T12:15:10",
    CDate: "2022-05-10",
    numberOfGifts: 25,
    type: "Standard",
    status: "Complete",
    giftDescription: "Box of books",
    giftDetails: "10 Books"
  },
  {
    id: 2,
    donorId: 5,
    lastName: "Thompson",
    firstName: "Jill",
    dateOfGift: "2022-04-01T12:15:10",
    CDate: "2022-04-10",
    numberOfGifts: 2,
    type: "Important",
    status: "Pending",
    giftDescription: "Box of cassettes",
    giftDetails: "20 items",
    important: 1
  },
  {
    id: 3,
    donorId: 3,
    lastName: "Wilson",
    firstName: "Mary",
    dateOfGift: "2022-03-01T12:15:10",
    CDate: "2022-03-10",
    numberOfGifts: 12,
    type: "Standard",
    status: "Pending",
    giftDescription: "Photographs",
    giftDetails: "Black and white photographs from 1918"
  },
  {
    id: 4,
    donorId: 1,
    lastName: "Anonymous",
    dateOfGift: "2022-05-01T12:15:10",
    CDate: "2022-05-10",
    numberOfGifts: 25,
    type: "Standard",
    status: "Complete",
    giftDescription: "Box of books",
    giftDetails: "10 Books"
  },
])
