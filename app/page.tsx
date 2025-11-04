import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NotificationBanner from "./components/banner";
import Routes from "./components/Routes";
import Footer from "./components/Footer";
import ServiceWorkerRegister from "./components/servicecard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <NotificationBanner />
      <Routes />
      <Footer/>
      <ServiceWorkerRegister/>
    </div>
  );
}
