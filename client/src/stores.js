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
    address1: "1234 Oak St",
    address2: "Unit 400",
    city: "Denver",
    state: "CO",
    postalCode: "80808",
    phone: "303-123-4567",
    email: "mw@gmail.com",
    organization: null,
    country: "USA",
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
    organization: "",
    dateOfGift: "2022-05-01T12:15:10",
    dateOfRecord: "2022-05-10T12:15:10",
    numberOfGifts: 25,
    type: "standard",
    status: "complete",
    giftDescription: "Box of books",
    giftDetails: "10 Books"
  },
  {
    id: 2,
    donorId: 5,
    lastName: "Thompson",
    firstName: "Jill",
    organization: "",
    dateOfGift: "2022-04-01T12:15:10",
    dateOfRecord: "2022-04-10T12:15:10",
    numberOfGifts: 2,
    type: "important",
    status: "pending",
    giftDescription: "Box of cassettes",
    giftDetails: "20 items pasture",
    important: 1
  },
  {
    id: 3,
    donorId: 3,
    lastName: "Wilson",
    firstName: "Mary",
    organization: "",
    dateOfGift: "2022-03-01T12:15:10",
    dateOfRecord: "2022-12-10T12:15:10",
    numberOfGifts: 12,
    type: "standard",
    status: "pending",
    giftDescription: "Photographs pasture",
    giftDetails: "Black and white photographs book from 1918"
  },
  {
    id: 4,
    donorId: 1,
    lastName: "Anonymous",
    organization: "",
    dateOfGift: "2022-05-01T12:15:10",
    dateOfRecord: "2022-06-10T12:15:10",
    numberOfGifts: 25,
    type: "standard",
    status: "complete",
    giftDescription: "Box of books",
    giftDetails: "10 Books pasture"
  },
  {
    id: 5,
    donorId: 1,
    lastName: "Anonymous",
    organization: "",
    dateOfGift: "2022-03-01T12:15:10",
    dateOfRecord: "2022-06-10T12:15:10",
    numberOfGifts: 250,
    type: "standard",
    status: "complete",
    giftDescription: "Box of stamps",
    giftDetails: "1930-1955"
  }
])
