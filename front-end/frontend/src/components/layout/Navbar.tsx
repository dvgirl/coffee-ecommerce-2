"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, User, Heart, ArrowRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import { clearSession, getStoredSession, getVerifiedAuthToken } from "@/lib/auth";

const NAV_LINKS = [
  { name: "Home", href: "/#hero" },
  { name: "Arrivals", href: "/#arrivals" },
  { name: "Magic", href: "/#categories" },
  { name: "Press", href: "/#story" },
  { name: "Craft", href: "/#brew" },
  { name: "Club", href: "/#club" },
  { name: "Shop", href: "/shop" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUserName, setSessionUserName] = useState("");
  const { cartCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncAuthState = async () => {
      const session = getStoredSession();
      setSessionUserName(session?.user?.name || "");

      if (!session?.token) {
        setIsAuthenticated(false);
        return;
      }

      const verifiedToken = await getVerifiedAuthToken();
      setIsAuthenticated(Boolean(verifiedToken));
    };

    void syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const profileHref = isAuthenticated ? "/profile" : `/login?returnTo=${encodeURIComponent(pathname || "/")}`;
  const accountLabel = sessionUserName.trim() || "Account";
  const accountInitial = accountLabel.charAt(0).toUpperCase() || "A";

  const handleLogout = () => {
    clearSession({ resetGuestSession: true });
    router.push("/");
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);

      if (element) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });

        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <>
      {pathname === "/" && <AnnouncementBar />}

      {/* ── Navbar ── */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full border-b border-black/5 bg-background/95 px-4 backdrop-blur-md transition-all duration-300 sm:px-6 md:px-12",
          isScrolled ? "shadow-sm" : "shadow-none"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between gap-3 py-3 sm:py-4",
            isScrolled ? "lg:py-3" : "lg:py-5"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-[1.75rem] font-bold gradient-text tracking-[-0.05em] sm:text-3xl"
            >
              AURA
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-5 py-2 text-[13px] font-bold uppercase tracking-[0.2em] text-foreground/80 hover:text-primary transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/4 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden items-center gap-2 lg:flex md:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={profileHref}
                  className="inline-flex items-center gap-3 rounded-2xl border border-black/8 bg-white/70 px-3 py-2.5 text-foreground/80 transition-all duration-300 hover:border-primary/20 hover:text-primary"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-xs font-black text-primary">
                    {accountInitial}
                  </span>
                  <span className="max-w-[120px] truncate text-sm font-semibold">{accountLabel}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/8 bg-white/70 px-3 py-2.5 text-sm font-semibold text-foreground/75 transition-all duration-300 hover:border-primary/20 hover:text-primary"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href={profileHref}
                className="rounded-2xl p-2.5 text-foreground/70 transition-all duration-300 hover:bg-black/5 hover:text-primary group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            )}
            <Link
              href="/favorites"
              className="rounded-2xl p-2.5 text-foreground/70 transition-all duration-300 hover:bg-black/5 hover:text-primary group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-2xl p-2.5 text-foreground/70 transition-all duration-300 hover:bg-black/5 hover:text-primary group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-black shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Icons + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={profileHref}
              className={cn(
                "rounded-2xl p-2.5 text-foreground/75 transition-colors hover:bg-black/5 hover:text-primary",
                isAuthenticated && "border border-black/8 bg-white/70"
              )}
            >
              {isAuthenticated ? (
                <span className="flex h-5 w-5 items-center justify-center text-[10px] font-black text-primary">
                  {accountInitial}
                </span>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>
            <Link
              href="/cart"
              className="relative rounded-2xl p-2.5 text-foreground/75 transition-colors hover:bg-black/5 hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              id="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-foreground transition-all hover:bg-black/5"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu — OUTSIDE <nav> to avoid sticky stacking-context breaking fixed positioning ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[200] bg-black/40 lg:hidden"
          >
            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-[340px] flex-col bg-[linear-gradient(180deg,_#fdfbf8_0%,_#f5ede4_100%)] px-5 pb-8 pt-6 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-black/6 pb-4">
                <div>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-2xl font-bold gradient-text tracking-[-0.05em]"
                  >
                    AURA
                  </Link>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Navigation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-white/70 text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="mt-5 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.04 * idx }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          scrollToSection(e, link.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between rounded-[1.2rem] border border-black/6 bg-white/70 px-4 py-4 text-base font-semibold text-foreground transition-colors hover:border-primary/20 hover:text-primary"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Access Grid */}
                <div className="mt-5 rounded-[1.4rem] border border-primary/12 bg-white/65 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Quick Access
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Link
                      href={profileHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center rounded-[1rem] bg-background px-3 py-3 text-[11px] font-semibold text-muted transition-colors hover:text-primary"
                    >
                      <User className="mb-2 h-4 w-4 text-primary" />
                      Profile
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center rounded-[1rem] bg-background px-3 py-3 text-[11px] font-semibold text-muted transition-colors hover:text-primary"
                    >
                      <Heart className="mb-2 h-4 w-4 text-primary" />
                      Saves
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center rounded-[1rem] bg-background px-3 py-3 text-[11px] font-semibold text-muted transition-colors hover:text-primary"
                    >
                      <ShoppingCart className="mb-2 h-4 w-4 text-primary" />
                      Cart
                    </Link>
                  </div>
                </div>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[1.4rem] border border-red-200 bg-red-50/90 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>

              {/* Footer CTA */}
              <div className="mt-5 border-t border-black/6 pt-4">
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[1.15rem] bg-primary px-5 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg"
                >
                  Join Aura Club <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
