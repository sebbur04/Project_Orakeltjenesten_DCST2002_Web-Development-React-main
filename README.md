> [!NOTE]  
> This is a fork of the original project, made public for Github
> This project requires that the end user can connect their own database to the project.
> Example SQL code is attached in the repository.
> If you have any questions feel free to create a PR or send an email. 

# NTNU Orakeltjenesten - Web Development - Project 

> [!WARNING]  
> This project is not affiliated with NTNU Orakeltjenesten!

## Table of contents

- [DCST2002 - Web Development - Project - Group 12](#dcst2002---web-development---project---group-12)
   * [Group Members](#group-members)
- [Project - NTNU Orakeltjenesten Wiki](#project---ntnu-orakeltjenesten-wiki)
   * [About the project](#about-the-project)
      + [List of webpage functionality](#list-of-webpage-functionality)
- [Dependencies / Enviroment Set-Up](#dependencies--enviroment-set-up)
   * [Setup database connections](#setup-database-connections)
   * [Start folder and server with NPM install and start](#start-folder-and-server-with-npm-install-and-start)
      + [STEP 1 - Install dependencies and start server:](#step-1---install-dependencies-and-start-server)
      + [STEP 2 -  Run server tests:](#step-2----run-server-tests)
      + [STEP 3 - Bundle client files to be served through server](#step-3---bundle-client-files-to-be-served-through-server)
      + [STEP 4 - Website available at Localhost 3000:](#step-4---website-available-at-localhost-3000)
- [How to use our website](#how-to-use-our-website---orakeltjenesten)
- [Reference list / Kilder](#reference-list--kilder)

## Group Members
* [Mateo Souto](https://github.com/mateos03)
* [Sebastian Ellefsen Burmo](https://github.com/sebbur04)
* [Sondre Søndergaard](https://github.com/sonson-arch)
* [Felix Krogvold](https://github.com/felkro124)
* [Akshit Dutta](https://github.com/akshitd)


# Project - NTNU Orakeltjenesten Wiki
## About the project

Objective:  Create a wiki page for Orakeltjenesten. 

> [!NOTE]  
> The wiki page follow the same guidlines as listed in the original project assignment listed on Blackboard.
>
>  Only the visual design of the website is adapted to Orakeltjenesten

> [!NOTE]  
> The webpage use the template from Client - server example from mandatory assignment 6 as main framework


### List of webpage functionality

* Create, edit and delete pages
* Version logging for each page
* Changelog for each version: username and timestamp
* Links between pages 
* Search bar to easily look up pages
* Multiple tags can be applied to each page
* Sidebar navigation 
* Statistics for each website: number of views and version history
* Comments on each page
* Comments can be edited and deleted

**Features**

* Static type checking with TypeScript on client and server
* Use of Continous Integration
* Reusable components and use of *service* objects on the client
* Database storage, *service* and *route* objects on the server
* Robust, structured code with comments  
* Comprehensive readme guide


**Additional features (Tilleggsfunksjonalitet)**

* RESTful Client and Server tests with high test coverage
* Integrated Markdown support for easy formatting.
* User Authentication with Passport.js https://www.passportjs.org/
* Users can change their profile and bio, and view other users' profiles and bios
* User Administration: an administrator monitors user-specific permissions.
* Responsive layout for mobile phones
* Uniform design with CSS and Bootstrap styles
* Focus on Universal Design with Sitemap


# Dependencies / Enviroment Set-Up

> [!CAUTION]
> To ensure the proper functionality of the Orakeltjenesten Wiki, please ensure the following:
>	1.	Network Connection:
>	•	Connect to the EDUROAM network.
>	•	Alternatively, use Cisco AnyConnect to establish a VPN connection to NTNU.
>	2.	Database Server Access:
>	•	The database server is hosted at NTNU and requires an active connection via the VPN or NTNU’s internal network.

> [!CAUTION]
> This application requires Node.js and npm (Node Package Manager) to run. If you haven’t already installed them, follow these steps:
>	1.	Install Node.js:
>Download and install Node.js, which includes npm, from the official Node.js website [https://nodejs.org/en/download/prebuilt-installer].
>	2.	Set Up Your IDE/Code Editor:
>Ensure that Node.js is properly set up in your development environment (IDE or code editor).
>	3.	Troubleshooting npm Issues:
>If you encounter issues with npm, reinstall Node.js using the link above to ensure you have the latest version.


## Setup database connections

> [!NOTE]  
> You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

> [!TIP]
> Please ensure that config.ts is in server/config.ts and server/test/test.ts
Where the one in server contain dev and the one in test contain test. This setup is necessary for connecting to the appropriate SQL server and applies to both macOS and Windows environments.


Photo of correct enviroment setup, arrow corespond to the file path

![Screenshot 2024-09-25 160206](https://github.com/user-attachments/assets/cac50db4-3937-4722-a1b3-9ed2c9609344)

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'URL FOR DATABASE HOST';
process.env.MYSQL_USER = 'USERNAME HERE';
process.env.MYSQL_PASSWORD = 'PASSWORD HERE';
process.env.MYSQL_DATABASE = 'DATABASE NAME (DEV)';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'URL FOR DATABASE HOST';
process.env.MYSQL_USER = 'USERNAME HERE';
process.env.MYSQL_PASSWORD = 'PASSWORD HERE';
process.env.MYSQL_DATABASE = 'DATABASE NAME (TEST)';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start folder and server with NPM install and start

### STEP 1 -  Install dependencies and run server tests:

```sh
cd server
npm install
npm test
```

### STEP 2 - Start server:

```sh
npm start
```


### STEP 3 - Bundle client files to be served through server

Open a new terminal window and enter the following commands!
Install dependencies and bundle client files, run test, and start:

```sh
cd client
npm install
npm test -- -u
npm start
```

### STEP 4 - Website available at Localhost 3000:
Open a webbrowser and enter following url
```
http://localhost:3000/
```

# How to use our website - Orakeltjenesten

> [!NOTE]  
> We have defined a superuser / administrator user for our page which have full access right for creating tags, pages and modify user permissions.
>
> ```
>  Username: admin
>  Password: admin
>```

## User permissions on our wiki 

### What can you do if you are logged out

- See all content, this includes all tags, pages, comments, user profiles, page-versionlogs, and even specific versions of a page.
- You cannot do any changes on the site without logging in, this includes commenting.

### What can you do if you are logged in

- See all content, this includes all tags, pages, comments, user profiles, page-versionlogs, and even specific versions of a page.
- Comment, edit and delete you own comments. Can also create and edit pages.
- We have implemented permissions, meaning that even if you are logged in you still do not have access to do specific things.
- To create a new user, you can click "Logg inn" then "Oprett bruker", then create a user. This user will by default only have a "alterpages" permission.

### Explanation of the permissions

- Alterpages: Gives you access to create new pages, and edit all pages, thus creating a new version of that page.
- Deletepages: Gives you access to delete a page. Different from deleting a version of a page, as deleting the page deletes all versions associated with it.
- Versions: Gives you access to delete specific versions of pages, and to restore a earlier version of the page.
- AllComments: Gives you access to edit and delete the comments of others.
- Tags: Gives you access to create, edit, and delete tags.
- Users: Gives you access to see, and change the permissions of other users, can also delete other users.

### Admin user

- We have a admin user which always has all permissions. This user cannot be deleted by anyone but the admin. Permissions of this user can also not be changed.
- The admin user can give specific users additional permissions like:
<img width="1586" alt="Screenshot 2024-11-18 at 20 32 30" src="https://github.com/user-attachments/assets/a7d604d1-bb13-46c8-9275-499c2c2b25c0">


# Reference list / Kilder

In this project, sources from websites and books are listed below.

> [!NOTE]  
> Some of the comments may be autogenerated by Github Copilot but is verified and checked by the developers. This is to save time and also ensure that we have short and simple comments throughout the project

> [!NOTE]  
> Use of AI / Chatbots etc are sitated with in line code where it is used!

### Source list and where it is used

| Source  | What is it used for |
| ------------- | ------------- |
| https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime  | Formatting dates, and getting todays date  |
| https://momentjs.com/guides/  | To format from utc to what we want  |
| https://stackoverflow.com/questions/69340833/react-router-how-to-make-page-refresh-on-url-change  | Explained in (2,3)  |
| https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text  | Whitespace checks  |
| https://gitlab.com/ntnu-dcst2002/todo-client-tests  | Base config for the whole project, Oblig 6 in DCST2002 Web Development  |
| https://www.passportjs.org/tutorials/password/ | Passport JS for authentication, used in most of /server/src/router/auth-router.ts  |
| https://i.ntnu.no/wiki  | Content for pages in our database |
| https://react.dev/reference/react/useEffect#specifying-reactive-dependencies | Dependancy array | 
| https://www.freecodecamp.org/news/how-to-use-localstorage-with-react-hooks-to-set-and-get-items/ | How to use localStorage  | 

# Comments affecting much code
Use numbers in the commented code, example (1, 1).

## Affecting many Components (1)

### Why we have authUser, users, user, and permissions on every component in the login folder (1)
Due to having authentication, updating the user can cause many problems. This is because when you log in, you get, and store the state of the user at that moment. Updating the Users table in the database does not change the stored authenticated data. Therefore, in order to not show old data on all pages, we need four of these "initializers", authUser, users, user, and permissions. authUser is only used to track who is logged in, but all information about this user is pulled from the database. Another way was to logout and log back in again after updating information about the user, but that seemed like a bad way of doing things. 

### Why we have permission-check at the start of several components (2)
Permission check at the start of components is used in case someone tries to, for example access "/pages/1/edit" through the url, instead of getting there by clicking.

## Use of Sources (2)

### Only render part of component if true (1)
```ts
{boolean && (<Column>Hello There</Column>)}
```
This code we got from one of the student assistants. It only shows the Columns if the boolean value is true. We use this several places in order to have a more clean design when you do not want to edit something. 

### Use of moment (2)
Needed a way to format the date so that it matches the DATETIME format of mysql. Moment is perfect for this, as it get the date aswell. Code for this was found on stackoverflow (https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime). When getting the date from the database again, it returns the date in UTC format, here moment had to be used again, this time we got help from the moment website (https://momentjs.com/guides/)

### Update site on url change without change of route (3)
If you update the url, and there is no change of route, for example from "/pages/1" to "/pages/2", and it happens from something else than a NavLink component, then the page content won't change. This is due to the code not seeing a change of route, and will therefore not reload the component. Here we found a solution on stackoverflow (https://stackoverflow.com/questions/69340833/react-router-how-to-make-page-refresh-on-url-change). 
```ts
  componentDidUpdate(prevProps: { match: { params: { id: number } } }) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      window.location.reload();
    }
  }
```
It reloads the window when the url doesnt match anymore, which causes the component to reload.

### Update component from other component (4)
Had some trouble because we have a side and topbar that is shown at all times. Because these are their own components, making a change on another component would not affect these directly. Got this code from teaching assistant:
```ts
{ComponentToBeUpdated}.instance()?.mounted();
```
Which causes the imported component to rerun its mounted method, thus updating its contents. This was especially important when making changes to tags.

## Comments for tests

### Comments for server tests:
For the page-versionlog-router.test.ts it will run as intended when running on the end user. While on github the worklow will fail 4 tests due to issues with momentjs, as the date you get from the database varies based on timezone, and the github runner is in another timezone compared to us.

### Comments for client tests:
The reason for there being a big discrepancy with the /test/login test-coverage compared to the other client-tests is due to the fact that the curriculum we went through in the course does not support the functionality we implemented. For /test/logout and /test/same where there are static pages and isn't as much functionality and complexity we have better test coverage. 
