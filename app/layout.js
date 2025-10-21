import '../styles/style.css';
import '../styles/styled.css';
import '../styles/styler.css';
import '../styles/styley.css';

export const metadata = {
  title: 'RIDE',
  description: 'Lets get you where you need to go',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
