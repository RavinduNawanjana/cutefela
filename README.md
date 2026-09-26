# CuteFela website — GitHub Pages build

A static, multi-page rebuild of CuteFela for GitHub Pages. It is intentionally build-tool free: upload the repository contents and enable GitHub Pages.

## Main pages
- Home
- Who we are
- Our work
- School programs
- Wildlife rehabilitation
- Disaster response
- Species + individual species guides
- Global engagement
- Partner
- Contact
- Privacy
- CuteFela & AI

## Motion system
The site uses GSAP + ScrollTrigger for page choreography, Anime.js for text/logo/footer motion, Motion.dev for microinteractions, React + React Spring for selected interactive islands, and Lottie for species illustrations. Reduced-motion preferences are respected.

## Video
The three supplied MP4 files were transcoded to local web-friendly H.264 files, muted and configured with `autoplay muted loop playsinline`. JavaScript retries autoplay after page load and pauses videos when off-screen.

## Contact form
The contact and footer brief forms use the existing Web3Forms endpoint/key supplied in the source footer. Test the form after deployment.

## Custom domain
Do **not** rename `CNAME.example` to `CNAME` until the GitHub version is fully tested and you are ready to move `www.cutefela.com` away from Google Sites.

## Media updates
When new CuteFela photography/video is available, replace the files in `assets/images/` and `assets/video/` using the existing filenames where possible. This preserves layout and URLs.
