export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIL,
      applicationID: 'convex',
    },
  ],
}