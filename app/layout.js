import './globals.css';

export const metadata = {
  title: 'Kavya Labs | AI products, built fast and shipped clean',
  description: 'Kavya Labs is a Bengaluru AI startup that turns ideas into working software.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
