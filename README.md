1. /config folder, express.js file

2. Database global var OR connect in model

3. Add /server folder, update package.json paths to '../client' path ref




# User Guide to the Donor Database App

The important donation workflow:
1. A standard user creates a new donor
2. A standard user creates a new donation for that donor
3. A standard user marks the donation as 'Important'
4. An external relations user gets an email notification, logs in, checks their inbox
5. An external relations user user creates a handwritten letter, submits it
6. An external relations user marks in the inbox that the donation is conmplete by clicking 'Mark as Complete'

The standard donation workflow:
1. A standard user creates a new donor
2. A standard user creates a new donation for that donor
3. A standard user marks the donation as 'Standard'
4. An admin user gets an email notification, logs in, checks their inbox
5. An admin user generates a letter, prints it and submits it
6. An admin user marks in the inbox that the donation is conmplete by clicking 'Mark as Complete'

### Login

### Inbox
This is where you can see if there are any actions for you to do
- Standard Users will not see the inbox
- Admin users will see in the inbox when donations are created and marked as standard - when the automatic letter is generated, the user is meant to go into their inbox and mark the donation as complete by clicking 'Mark as complete'
- External relations users will see in the inbox when donations are created and marked as important - when the handwritten letter is completed the user can mark in the inbox 'Mark as complete'

### Email notifications
The admins get notifications about standard donations
The external relations gets notified of important donations
Standard user get no notifications

### Letter generation (the automatic + signed letter)
Admin users and can generate a letter
External relations users can not generate a letter
Standard users can not generate a letter 

### Pages
All users can see all donations and make edits and add donors/ donations

#### Donors
here you can add a new donor, view previous donors, or add an anonymous donation. You can also search through previous donors. There is also a shortcut to add donations from a donor here.

#### Previous Donor page 
you can view and edit the information of previous donors. It will also show previous donations if they exist. You can view their donations, and there is also an opton to Add a new donation for this donor, and there is also a shortcut the status of a donation.

#### New donor page
a blank donor page, will create a new donor when you submit the form

#### Donations
here you can search through previous donations, view previous donations, or ad an anonymous donation.

#### Donation page
here you can view and edit a record from a single donation

#### New donation page
a blank donation page, will create a new donation that is anonymous or belonging to a donor based on how you navigated to the page, once you submit the form

#### Living Library
this takes you to the living library app. The functionality is the same as before. Used by Nancy, Lisa

#### Logout
exit the site
