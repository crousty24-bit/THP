# Refactor Component

React refactor exercise based on the original THP `refactoTHP` project.

Original source used for comparison: https://github.com/TheHackingProject/refactoTHP/tree/master

## Purpose

The original app rendered the profile, publications, modal content, form state, handlers, and hardcoded data from one large class component. This version keeps the same user-facing behavior while splitting the UI into smaller function components and moving static data outside React components.

## Refactor Summary

- Rewrote `App.js` from a class component to a function component using `useState`.
- Moved the initial profile and publications data to `src/data/profileData.js`.
- Moved hashtag suggestions to `src/data/hashtags.js`.
- Extracted profile rendering to `ProfileCard`.
- Extracted the publication grid to `PublicationList` and `PublicationCard`.
- Extracted all Ant Design modals to dedicated components:
  - `PreviewPublicationModal`
  - `UploadPictureModal`
  - `EditProfileModal`
- Replaced repeated publication card markup with Ant Design `List` grid rendering.
- Kept modal props focused: each child receives only the data and callbacks it needs.

## Preserved Behavior

The refactor is structural only. The following behavior is intentionally unchanged:

- The same profile information and three publications are displayed.
- Clicking a publication opens its preview modal.
- Edit and delete actions show the original alerts, including the original `publcation` typo:
  - `J'update la publcation avec l'id : ...`
  - `Je supprime la publcation avec l'id : ...`
- Upload still shows the original alert with description, hashtags, and mentions.
- Editing the profile updates the displayed account data and shows `Profile well updated`.
- The project still uses Create React App, React 16, and Ant Design 3.

## Code Quality Guardian Usage

This refactor was guided with the `code-quality-guardian` skill to avoid overproducing changes beyond the exercise.

Intervention classification:

```text
Intervention class: Level 2 Coordinated
Decision: coordinate with code-quality-guardian + code-simplification
Reason: the change spans multiple React files while preserving one bounded behavior contract.
Verification: install/build/start with Node 14 and inspect the final component boundaries.
Stop condition: App.js is a function component, contains no Modal markup, and the app builds successfully.
```

Applied guardrails:

- Keep the original stack and dependency versions.
- Do not migrate to Vite, TypeScript, React 18, or a newer Ant Design API.
- Do not add features beyond the exercise brief.
- Preserve alert strings and visible behavior.
- Keep data outside components.
- Keep props narrow instead of passing full state trees to child components.
- Avoid committing generated build output.

## Requirements

This project uses the original Create React App dependencies:

- React 16
- `react-scripts@3.4.0`
- Ant Design 3

The exercise expects Node.js 14:

```bash
nvm install 14
nvm use 14
npm i
```

The project includes a `.nvmrc` file, so `nvm use` automatically selects Node 14 from this folder. If your terminal says `nvm: command not found`, open a new terminal or run:

```bash
source ~/.bashrc
```

If the old CRA toolchain reports the known dependency issue, run:

```bash
npm update
```

## Run

```bash
npm start
```

The app starts on `http://localhost:3000`.

## Build

```bash
npm run build
```

## Verification Performed

Verified with Node `v14.21.3` and npm `6.14.18`:

```bash
npm i
npm run build
npm start
curl -I http://localhost:3000
```

Results:

- `npm i` completed successfully.
- `npm run build` compiled successfully.
- `npm start` compiled successfully.
- `curl -I http://localhost:3000` returned `HTTP/1.1 200 OK`.
- `npm test -- --watchAll=false` found no tests because the source project does not include test files.

Known note: npm reports vulnerabilities from the old CRA/Ant Design dependency tree. They were not fixed here because changing dependency versions would go beyond the refactor brief.

## Structure

```text
src/
  App.js
  MentionsTagsComponent.js
  components/
    EditProfileModal.js
    PreviewPublicationModal.js
    ProfileCard.js
    PublicationCard.js
    PublicationList.js
    UploadPictureModal.js
  data/
    hashtags.js
    profileData.js
```
