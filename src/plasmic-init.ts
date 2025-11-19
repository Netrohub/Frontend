import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "1Hn4NBB5sATdK2CZK8S6bB",  // Plasmic project ID
      token: "iQz155EqDyKTfo33hTtAEKrqKYS7nB1xdY6tgo2qOehiQJq7qbXrXPzihV9NVO58L48zSHtwO3jcWg3B3Ufg"  // Plasmic API token
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});

// To find your project's ID and public API token:
// 1. Open the project in Plasmic Studio
// 2. The project ID is in the URL: https://studio.plasmic.app/projects/PROJECTID
// 3. The public API token can be found by clicking the Code toolbar button

