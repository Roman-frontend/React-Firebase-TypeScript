# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

0. Login via firebase CLI `firebase login`

1. In the files `.firebaserc` and `firebase.json` replace `test-project-20210119` with **your** Firebase project name 

2. In the file `src/common/firebaseConfig.ts` replace the `firebaseConfig` value with the config of the web app you created inside **your** firebase Project

3. Ensure that email authentication is enabled inside Firebase Auth

4. Install dependencies:

```sh
yarn
```

5. Deploy Firestore rules:

```sh
yarn deploy-rules
```

6. Run the project:

```sh
yarn start
```

7. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Running the app locally

```sh
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Code quality standards

Before committing your code, always run `yarn lint:fix` (inside the root and `functions` folders) to fix the code style. Ensure that your code has **0 errors** after running that command (warnings are acceptable, but not recommended too).

## How to deploy my app to Firebase Hosting?

```sh
yarn build
yarn deploy-hosting
```

## How to deploy my app functions?

```sh
cd functions
yarn build
yarn deploy
```

## Відео loop з оглядом працюючих фіч - https://www.loom.com/share/f2ec4c7662d7486fbd6a538fe146cb6f

##Зробити рабочу ссылку на Firebase Hosting сайт, де її можно проект можна подивитись в работі не зробив так як з'явились помилки яких не встиг виправити. 
