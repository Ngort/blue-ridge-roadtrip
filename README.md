# Blue Ridge road trip guide

An autumn travel guide for November 8–12, 2026, from Charleston to Roanoke. The repository root contains the ready-to-publish static site. Rental prices are dated observations, lodging prices are estimates, and nothing is booked.

## Publishing a copy

This guide is a static site. No build step, API key, database, or ChatGPT account is required by the site itself.

1. Create a public GitHub repository for the guide (or use an existing repository you own).
2. Upload the **contents of `dist`**, including `index.html`, styles, scripts, map, data and `.nojekyll`, to the repository root. Do not upload the enclosing `dist` directory if using the root publishing option.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select **main** and **/(root)**, then **Save**.
6. Wait for deployment. GitHub displays the site URL, usually `https://USERNAME.github.io/REPOSITORY/`.

The published guide is viewable by anyone with its public URL. Upload only the `dist` contents; the `.openai` directory and local preview files are not needed. The guide has a third-party CDN dependency for its geographic map, and external booking links require internet access.

For an existing repository, you may instead copy `dist` contents into `/docs` and select `main` plus `/docs` in Pages settings. All guide asset links are relative so either location works.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

For this repository, publish the existing `main` branch from `/(root)`. Edit the HTML, CSS, JavaScript and rental data directly; pushes to the publishing branch update GitHub Pages.
