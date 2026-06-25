import TopNavbar from "@/components/TopNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Server component — renders the public page shell (TopNavbar, Navbar, Footer).
 * The admin-route check is done server-side via the x-is-admin header set by
 * middleware, so we no longer need "use client" + usePathname() here.
 */
export default function PublicLayoutShell({ children, navSettings, isAdmin }) {
  return (
    <>
      {!isAdmin && <TopNavbar />}
      {!isAdmin && <Navbar settings={navSettings} />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}