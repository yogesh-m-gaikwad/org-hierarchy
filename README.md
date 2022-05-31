# Hierarchy UI - Assignment

## Demo link:

The application is deployed at [GitHub Page](https://yogesh-m-gaikwad.github.io/org-hierarchy/)

## Setup

- download or clone the repository
- run `npm install`

### `npm start`

Runs the app in development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm test`

Runs the application tests.<br>

### `npm build`

Builds the app for production to the `build` folder.<br>

## Assumptions

- Delete action will for team lead will delete all team members. Promote some other team member to delete without this.
- Promoting a member at any level will select a replacement randomly - this can have separate flow
- Filter is available in tree this will show parents that include a matched child entry
- As the db us local storage pagination of tables is not implemented.
- Hash Router is used as the application was to be deployed on GitHub Pages and there are known issues with BrowserRouter on GitHub Pages.

## User Guide

- Click employee/team title to view details page.
- Click edit icon to open edit page.
- Click details icon to view details page.
- List of team members at a given level is available using 'Employees List' option on parent's page
- To add team member or new team visit the parent details page.
- To reset to original state click restore data link on Welcome Page
