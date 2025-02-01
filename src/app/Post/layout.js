import  Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata = {
  title: "Blogs",
  description: "Blogs",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
