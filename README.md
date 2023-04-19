# Getting Started with Sisense EmbedSDK App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using template [cra-template-typescript](https://www.npmjs.com/package/cra-template-typescript)

## Using the EmbedSDK component in your application

Example shown in `src/App.tsx`

Minimum required is to copy the `SisenseEmbedSDK` folder into your application, and import the component:
```
import SisenseDashboardEmbed from './SisenseEmbedSDK'
```

and pass in the URL for Sisense, and a Dashboard Id
```
<SisenseDashboardEmbed
  sisenseUrl={sisenseUrl}
  dashboardId={dashboardId}
/>
```

Other features can be contolled via the component props:

```
<SisenseDashboardEmbed
  sisenseUrl={sisenseUrl}
  urlParams={urlParams}
  dashboardId={dashboardId}
  showLeftPane={false}
  showRightPane={true}
  showToolbar={false}
  themeId={sisenseThemeId}
  volatile={true}
  editMode={false}
  unmountShouldDestroySisenseFrame={false}
  unmountShouldUnloadEmbedSdk={false}
  onDashboardLoaded={(event: any, args: any) => handleDashboardLoaded(event, args)}
  onDashboardFirstLoaded={(loadedDashboard: any) => setCurrentDashboardObject(loadedDashboard)}
/>
```

## Using this example application

- Clone the repository locally
- Start the application via `npm start` as explained below under 'Available Scripts'
- Paste in the URL to your sisense application (without the trailing slash e.g. `https://your.sisense.com` and also the dashboard ID you want to embed, into the relevant inputs in the page
- The dashboard should load, and you can toggle the UI components on and off.

![react-embedSDK](https://user-images.githubusercontent.com/9842660/232162477-1871de35-25dd-4936-8e31-949180004439.gif)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
