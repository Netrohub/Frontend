import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "bsWvY6yXzULcMzaG6XfkDA",  // Plasmic project ID
      token: "6JoIh0Nve6zQBLyZJSVx64ykU2xRniCrU0niQL2rhCmncqqUXsIpbvCVARvTPBNAy0p6rol5d6bK284XMKQA"  // Plasmic API token
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

