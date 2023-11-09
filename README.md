# Cranyons

This is the [Next.js](https://nextjs.org/) rewrite of the Angular.js app. The last v1 commit was [ae628a5](https://github.com/deanslamajr/cranyons/tree/ae628a55a791010699394c25286c3d48c2e24211)

## Getting Started

First, make sure you have [nvm](https://github.com/nvm-sh/nvm) installed and use it to switch to the expected version of Node.js:

```bash
nvm use
```

Note: if you're on a Windows system, you can't use nvm so switch to the correct version of manually (to find the expected version number, see `.nvmrc`)

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) with your browser.

## Next.js Docs

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Publishing (wip)

The following command will

- generate a test version number (based off of commit sha)
- build a docker image
- tag the docker image with the test version number

```bash
npm run publish
```

Note: this script has a dependency on a local Docker cli instance that has been authenticated with the associated GCP Artifact Registry.
