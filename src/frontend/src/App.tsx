import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Headphones,
  Heart,
  Instagram,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Phone,
  Star,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Review } from "./backend";
import { useActor } from "./hooks/useActor";

const WA_LINK = "https://wa.me/918524932135";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Care Tips", href: "#care-tips" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    title: "Indoor Plants",
    image: "/assets/generated/indoor-plants.dim_800x600.jpg",
    items: [
      "Money Plant",
      "Snake Plant",
      "Peace Lily",
      "Spider Plant",
      "Pothos",
      "ZZ Plant",
      "Rubber Plant",
      "Aloe Vera",
      "& More...",
    ],
    emoji: "🌿",
  },
  {
    title: "Outdoor Plants",
    image: "/assets/generated/outdoor-plants.dim_800x600.jpg",
    items: [
      "Bougainvillea",
      "Hibiscus",
      "Jasmine",
      "Marigold",
      "Croton",
      "Shade Plants",
      "Ferns",
      "Garden Plants",
      "& More...",
    ],
    emoji: "🌳",
  },
  {
    title: "Terrariums & Miniatures",
    image: "/assets/generated/terrarium.dim_800x600.jpg",
    items: ["Glass Terrariums", "Mini Garden Designs", "Customized Terrariums"],
    emoji: "🌍",
  },
  {
    title: "Pots & Accessories",
    image: "/assets/generated/pots-accessories.dim_800x600.jpg",
    items: ["Decorative Pots", "Soil Mix", "Gardening Tools"],
    emoji: "🪴",
  },
];

const WHY_CHOOSE = [
  {
    icon: Leaf,
    title: "Fresh & Healthy Plants",
    desc: "Every plant is nurtured with care before reaching your home.",
  },
  {
    icon: Heart,
    title: "Affordable Pricing",
    desc: "Quality plants at prices that make green living accessible for all.",
  },
  {
    icon: Palette,
    title: "Custom Plant Designs",
    desc: "Personalized terrariums and miniature gardens crafted just for you.",
  },
  {
    icon: Headphones,
    title: "Friendly Support",
    desc: "Our plant experts are here to guide you at every step.",
  },
  {
    icon: Truck,
    title: "Fast Local Delivery",
    desc: "Quick and safe delivery across Tamil Nadu.",
  },
];

const CARE_TIPS = [
  {
    title: "Money Plant Care",
    emoji: "🌱",
    tip: "Keep in indirect light, water every 7–10 days. Avoid overwatering — let the soil dry slightly between waterings.",
    difficulty: "Easy",
  },
  {
    title: "Snake Plant Care",
    emoji: "🌵",
    tip: "Thrives in low light and minimal watering. One of the most forgiving plants — perfect for beginners.",
    difficulty: "Very Easy",
  },
  {
    title: "Peace Lily Care",
    emoji: "🌸",
    tip: "Keep soil moist and place in shade or indirect light. Loves humidity — mist leaves occasionally for best results.",
    difficulty: "Easy",
  },
];

const STARS = [1, 2, 3, 4, 5];
const LOGO_SRC =
  "/assets/file_000000001a5071fa824b913a18c97ce1-019d5741-18d3-7592-b394-7589925755a2.png";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {STARS.slice(0, count).map((n) => (
        <Star key={n} className="w-4 h-4 fill-star text-star" />
      ))}
    </div>
  );
}

function InteractiveStarRating({
  value,
  hovered,
  onChange,
  onHover,
  onLeave,
}: {
  value: number;
  hovered: number;
  onChange: (v: number) => void;
  onHover: (v: number) => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex gap-1" onMouseLeave={onLeave}>
      {STARS.map((n) => {
        const filled = n <= (hovered || value);
        return (
          <button
            key={n}
            type="button"
            data-ocid={`review_form.star.${n}`}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => onHover(n)}
            onClick={() => onChange(n)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                filled
                  ? "fill-star text-star"
                  : "fill-none text-muted-foreground"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function useReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const queryClient = useQueryClient();

  // Backend reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews();

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewLocation, setReviewLocation] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHovered, setReviewHovered] = useState(0);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const { actor } = useActor();

  const submitMutation = useMutation({
    mutationFn: async ({
      name,
      location,
      text,
      rating,
    }: {
      name: string;
      location: string;
      text: string;
      rating: number;
    }) => {
      if (!actor) throw new Error("Not ready");
      return actor.submitReview(name, location, text, BigInt(rating));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setReviewName("");
      setReviewLocation("");
      setReviewText("");
      setReviewRating(0);
      setReviewHovered(0);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    },
    onError: () => {
      setReviewError("Something went wrong. Please try again.");
    },
  });

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      setReviewError("Please enter your name.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Please write your review.");
      return;
    }
    if (reviewRating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    setReviewError("");
    submitMutation.mutate({
      name: reviewName.trim(),
      location: reviewLocation.trim() || "India",
      text: reviewText.trim(),
      rating: reviewRating,
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2 font-extrabold text-lg text-primary tracking-tight"
          >
            <img
              src={LOGO_SRC}
              alt="Green Empire Logo"
              className="w-8 h-8 object-contain rounded-full"
            />
            <span>GREEN EMPIRE NURSERY</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://share.google/aVb94xyPZnVuPg2Bp"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.greenempire.link"
              className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              <Leaf className="w-4 h-4" />
              Green Empire
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.whatsapp.button"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              Order on WhatsApp
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            data-ocid="nav.mobile_menu.toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="text-sm font-medium text-foreground py-2 border-b border-border last:border-0"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="https://share.google/aVb94xyPZnVuPg2Bp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg text-sm font-semibold"
                >
                  <Leaf className="w-4 h-4" />
                  Green Empire
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold mt-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16">
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-[580px] flex items-center justify-center overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-nursery.dim_1400x700.jpg')",
            }}
          />
          {/* Stronger dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-sm font-extrabold text-white mb-6 tracking-wide">
                <Leaf className="w-4 h-4" /> Tamil Nadu&apos;s Trusted Nursery
              </span>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-5 text-white"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)",
                }}
              >
                Bringing Nature
                <br />
                Closer to You 🌱
              </h1>
              <p
                className="text-xl sm:text-2xl text-white font-extrabold mb-10 max-w-xl mx-auto"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.7)",
                }}
              >
                Fresh plants, terrariums &amp; eco-friendly green solutions for
                every space
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  data-ocid="hero.browse.primary_button"
                  onClick={() => scrollTo("#products")}
                  className="px-7 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors text-base"
                >
                  Browse Collection
                </button>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="hero.whatsapp.primary_button"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-base border border-white/20"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Order
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT US */}
        <section id="about" className="py-20 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                  About Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2 mb-4 leading-tight">
                  Passionate About a Greener World 🌿
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  Green Empire Nursery specializes in indoor plants, outdoor
                  plants, decorative terrariums, and miniature gardens. Our
                  mission is to promote eco-friendly living and help people
                  connect with nature.
                </p>
                <ul className="space-y-3">
                  {[
                    "Quality Plants",
                    "Affordable Prices",
                    "Customer Satisfaction",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl overflow-hidden shadow-card"
              >
                <img
                  src="/assets/generated/outdoor-plants.dim_800x600.jpg"
                  alt="Our nursery"
                  className="w-full h-72 object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                Shop Now
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2">
                Our Products
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                From indoor greens to stunning terrariums — we have something
                for every plant lover.
              </p>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-ocid="products.list"
            >
              {PRODUCTS.map((product, i) => {
                const varietyCount = product.items.filter(
                  (item) => !item.startsWith("&"),
                ).length;
                return (
                  <motion.div
                    key={product.title}
                    data-ocid={`products.item.${i + 1}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-hero transition-shadow group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 text-2xl">
                        {product.emoji}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground text-base mb-3 flex items-center flex-wrap gap-1">
                        {product.title}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ml-1">
                          {varietyCount} varieties
                        </span>
                      </h3>
                      <ul className="space-y-1 mb-4">
                        {product.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`products.order.button.${i + 1}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle className="w-4 h-4" /> Order Now
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-20 bg-primary">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Why Choose Us? 💚
              </h2>
              <p className="text-white/70 mt-2">
                We go beyond just selling plants
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {WHY_CHOOSE.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-center p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/65 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CARE TIPS */}
        <section id="care-tips" className="py-20 bg-card">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                Plant Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2">
                Care Tips &amp; Tricks 🌱
              </h2>
              <p className="text-muted-foreground mt-2">
                Keep your plants thriving with our expert advice
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {CARE_TIPS.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-2xl p-6 border border-border shadow-card"
                >
                  <div className="text-4xl mb-4">{tip.emoji}</div>
                  <div className="inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                    {tip.difficulty}
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.tip}
                  </p>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-semibold hover:underline"
                  >
                    Order this plant <ChevronRight className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2">
                Happy Customers ⭐ ({reviews.length})
              </h2>
            </div>

            {/* Review Cards */}
            {reviewsLoading ? (
              <div
                className="flex flex-col items-center justify-center py-16 gap-3"
                data-ocid="reviews.loading_state"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="reviews.empty_state"
              >
                <div className="text-5xl mb-4">🌱</div>
                <p className="font-semibold text-foreground text-lg">
                  No reviews yet
                </p>
                <p className="text-sm mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {reviews.map((review, i) => (
                  <motion.div
                    key={`${review.name}-${i}`}
                    data-ocid={`reviews.item.${i + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(i, 2) * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border shadow-card"
                  >
                    <StarRating count={Number(review.rating)} />
                    <p className="text-foreground text-sm leading-relaxed mt-4 mb-5">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Review Submission Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-14 bg-card rounded-2xl p-6 border border-border shadow-card"
              data-ocid="review_form.panel"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-foreground">
                  Share Your Experience 💬
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Your review helps other plant lovers!
                </p>
              </div>

              <form
                onSubmit={handleReviewSubmit}
                className="max-w-2xl mx-auto space-y-5"
                data-ocid="review_form.modal"
              >
                {/* Name + Location row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="review-name"
                      className="text-sm font-semibold text-foreground"
                    >
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      data-ocid="review_form.input"
                      placeholder="e.g. Priya S."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="review-location"
                      className="text-sm font-semibold text-foreground"
                    >
                      Your City
                    </label>
                    <input
                      id="review-location"
                      type="text"
                      data-ocid="review_form.input"
                      placeholder="Your city"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Rating <span className="text-destructive">*</span>
                  </p>
                  <InteractiveStarRating
                    value={reviewRating}
                    hovered={reviewHovered}
                    onChange={setReviewRating}
                    onHover={setReviewHovered}
                    onLeave={() => setReviewHovered(0)}
                  />
                  {reviewRating > 0 && (
                    <span className="text-xs text-primary font-medium">
                      {reviewRating === 5
                        ? "Excellent!"
                        : reviewRating === 4
                          ? "Very Good!"
                          : reviewRating === 3
                            ? "Good"
                            : reviewRating === 2
                              ? "Fair"
                              : "Poor"}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="review-text"
                    className="text-sm font-semibold text-foreground"
                  >
                    Your Review <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="review-text"
                    data-ocid="review_form.textarea"
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                  />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {reviewError && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      data-ocid="review_form.error_state"
                      className="text-sm text-destructive font-medium"
                    >
                      {reviewError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Success message */}
                <AnimatePresence>
                  {reviewSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      data-ocid="review_form.success_state"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Thank you! Your review has been added. 🌱
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  data-ocid="review_form.submit_button"
                  disabled={submitMutation.isPending}
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Get In Touch 📞
              </h2>
              <p className="text-white/70 mt-2">
                We&apos;d love to hear from you. Order, enquire, or just say
                hello!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact info */}
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "Tamil Nadu, India",
                    href: "",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "8524932135",
                    href: "tel:8524932135",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "greenempirenursery@gmail.com",
                    href: "mailto:greenempirenursery@gmail.com",
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    value: "@Green._Empire",
                    href: "https://instagram.com/Green._Empire",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wide">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white font-semibold hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white font-semibold">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA card */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5">
                <div className="text-5xl">🛒</div>
                <h3 className="text-white font-black text-xl">
                  Ready to Order?
                </h3>
                <p className="text-white/70 text-sm">
                  Browse our collection and place your order directly via
                  WhatsApp. Fast, easy, and friendly!
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.whatsapp.primary_button"
                  className="flex items-center gap-3 px-8 py-4 bg-white text-primary font-black text-base rounded-xl hover:bg-white/90 transition-colors w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order on WhatsApp
                </a>
                <p className="text-white/50 text-xs">📱 +91 85249 32135</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-foreground text-white/80 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 font-black text-lg text-white mb-3">
                <img
                  src={LOGO_SRC}
                  alt="Green Empire Logo"
                  className="w-7 h-7 object-contain rounded-full"
                />
                GREEN EMPIRE NURSERY
              </div>
              <p className="text-white/55 text-sm leading-relaxed">
                Bringing nature closer to you. Quality plants, terrariums, and
                green solutions.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                Quick Links
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      className="text-white/55 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                Connect With Us
              </p>
              <div className="flex gap-4 mb-4">
                <a
                  href="https://instagram.com/Green._Empire"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.instagram.link"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.whatsapp.link"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <p className="text-white/50 text-xs">
                📧 greenempirenursery@gmail.com
              </p>
              <p className="text-white/50 text-xs mt-1">📱 8524932135</p>
              <p className="text-white/50 text-xs mt-1">
                🌐{" "}
                <a
                  href="https://share.google/aVb94xyPZnVuPg2Bp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Green Empire
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-xs">
            © {new Date().getFullYear()} Green Empire Nursery. Built with{" "}
            <span className="text-red-400">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
