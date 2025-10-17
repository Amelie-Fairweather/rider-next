import '../styles/style.css';
import '../styles/styled.css';
import '../styles/styler.css';
import '../styles/styley.css';
import { getServerSession } from "next-auth/next";
import AuthProvider from "../components/AuthProvider";

export const metadata = {
  title: 'RIDE',
  description: 'Lets get you where you need to go',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  
  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
