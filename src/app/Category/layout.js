import  Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata = {
  title: "Category",
  description: "Category",
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
