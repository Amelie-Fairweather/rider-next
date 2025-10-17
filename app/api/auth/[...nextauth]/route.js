import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback - session:', session);
      console.log('Session callback - token:', token);
      session.user.id = token.sub
      return session
    },
    async jwt({ token, account, profile }) {
      console.log('JWT callback - token:', token);
      console.log('JWT callback - account:', account);
      console.log('JWT callback - profile:', profile);
      if (account) {
        token.sub = profile.id
      }
      return token
    }
  },
  debug: true
})

export { handler as GET, handler as POST }
