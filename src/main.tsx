import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Phone,
  Menu,
  X,
  MapPin,
  Plus,
  Minus,
  Upload,
  Check,
  Layers,
  Droplets,
  Hammer,
} from "lucide-react";
import galleryContent from "./gallery.json";
import "./fonts.css";
import "./style.css";
import photos from "./photos.json";
import { siteConfig } from "./site-config";
import { sendQuote, validQuoteEndpoint } from "./quote";
const phone = "tel:+33756879110",
  maps = "https://maps.app.goo.gl/PKMfApK7X4pSrJ7Y7";
const nav = [
  ["/", "Accueil"],
  ["/services", "Services"],
  ["/a-propos", "À propos"],
  ["/realisations", "Réalisations"],
  ["/zones", "Zones d’intervention"],
  ["/contact", "Contact"],
];
const services = [
  [
    "Rénovation de toiture",
    "Redonner à votre toiture sa cohérence, en tenant compte de son état et de l’architecture de votre maison.",
    "service-renovation",
  ],
  [
    "Réparation de toiture",
    "Étudier les éléments abîmés et les réparations adaptées avant que les désordres ne s’étendent.",
    "service-repair",
  ],
  [
    "Pose de couverture",
    "Préparer une couverture adaptée à la pente, au support et aux particularités de votre projet.",
    "service-installation",
  ],
  [
    "Recherche de fuites",
    "Comprendre l’origine des infiltrations : couverture, raccords, évacuations et points singuliers.",
    "service-leaks",
  ],
  [
    "Étanchéité",
    "Examiner les zones sensibles et envisager une solution adaptée à la configuration de la toiture.",
    "service-sealing",
  ],
  [
    "Zinguerie et gouttières",
    "Soigner les raccords et l’évacuation des eaux pluviales, essentiels à la protection du bâti.",
    "service-zinc",
  ],
  [
    "Nettoyage et entretien",
    "Évaluer les besoins d’entretien en respectant le matériau et l’état de la couverture.",
    "service-care",
  ],
  [
    "Couverture en tuiles et ardoises",
    "Explorer les matières et les teintes qui donnent à votre maison son caractère.",
    "service-slate",
  ],
];
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
function Button({
  children,
  to = "/contact",
  light = false,
}: {
  children: React.ReactNode;
  to?: string;
  light?: boolean;
}) {
  return (
    <Link className={"button " + (light ? "outline" : "")} to={to}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
function Brand() {
  return (
    <Link className="brand" to="/" aria-label="France Couverture — accueil">
      <img
        src="/brand/logo-white.svg"
        alt="France Couverture"
        width="235"
        height="66"
      />
    </Link>
  );
}
function Photo({
  id,
  alt,
  className = "",
  priority = false,
}: {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const photo = photos.find((photo) => photo.id === id);
  return (
    <img
      className={className}
      src={"/images/" + id + ".webp"}
      srcSet={
        "/images/" +
        id +
        "-small.webp " +
        (photo?.smallWidth || 640) +
        "w, /images/" +
        id +
        ".webp " +
        (photo?.width || 1600) +
        "w"
      }
      sizes={priority ? "100vw" : "(max-width:640px) 100vw, 55vw"}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      width={photo?.width || 1600}
      height={photo?.height || 1100}
    />
  );
}

function useModalKeys(open: boolean, selector: string, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = document.querySelector(selector);
    const items = () =>
      Array.from(
        root?.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled]),input",
        ) || [],
      );
    items()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = items(),
          first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [open, selector]);
}
function Header() {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  useModalKeys(open, ".mobile-nav", () => {
    setOpen(false);
    toggle.current?.focus();
  });
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title =
      (nav.find((n) => n[0] === loc.pathname)?.[1] || "Informations") +
      " | France Couverture — Joinville-le-Pont";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      loc.pathname === "/contact"
        ? "Contactez France Couverture à Joinville-le-Pont au 07 56 87 91 10. Demande de devis et coordonnées de l’entreprise."
        : "France Couverture, entreprise de couverture à Joinville-le-Pont. Échangez sur votre projet de toiture dans le Val-de-Marne.",
    );
  }, [loc.pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header
      className={
        (scrolled || loc.pathname !== "/" ? "solid " : "") +
        (open ? "opened" : "")
      }
    >
      <Brand />
      <nav aria-label="Navigation principale">
        {nav.map(([url, label]) => (
          <NavLink key={url} to={url}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <a
          className="header-phone"
          href={phone}
          aria-label="Appeler France Couverture"
        >
          <Phone size={17} />
          <span>07 56 87 91 10</span>
        </a>
        <Link className="small-cta" to="/contact">
          Demander un devis <ArrowUpRight size={16} />
        </Link>
      </div>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          >
            <button className="mobile-close" onClick={() => setOpen(false)}>
              Fermer <X size={18} />
            </button>
            {nav.map(([u, l], i) => (
              <motion.div
                key={u}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={u}>
                  <small>0{i + 1}</small>
                  {l}
                  <ArrowUpRight />
                </Link>
              </motion.div>
            ))}
            <a className="mobile-call" href={phone}>
              <Phone size={17} />
              07 56 87 91 10
            </a>
            <small>3 Avenue Jean Jaurès · Joinville-le-Pont</small>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 85]);
  return (
    <section className="hero">
      <motion.div className="hero-image" style={{ y }}>
        <Photo
          id="hero-exclusive"
          alt="Maison de pierre et toiture d’ardoise en Bretagne — photographie d’illustration"
          priority
        />
      </motion.div>
      <div className="hero-shade" />
      <div className="architecture" />
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow>COUVERTURE & RÉNOVATION · JOINVILLE-LE-PONT</Eyebrow>
        </motion.div>
        <h1>
          {["Votre toiture,", "notre savoir-faire."].map((text, i) => (
            <span className="text-mask" key={text}>
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.12 + i * 0.13,
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <p>
            Votre partenaire pour vos projets de couverture à Joinville-le-Pont
            et ses environs.
          </p>
          <div className="hero-buttons">
            <Button>Demander un devis</Button>
            <Link to="/services" className="hero-secondary">
              Découvrir nos services <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="hero-note">
        <span className="note-rule" />
        <p>
          PROTÉGER L’ESSENTIEL.
          <br />
          PRÉSERVER LE CARACTÈRE.
        </p>
      </div>
      <div className="hero-bottom">
        <a href="#introduction">
          <ArrowDown size={18} />
          <span>LE SENS DU DÉTAIL</span>
        </a>
        <span>
          JOINVILLE-LE-PONT · 94340 <i> / </i> VAL-DE-MARNE
        </span>
        <small>Photographie d’illustration</small>
      </div>
    </section>
  );
}
function Intro() {
  return (
    <section id="introduction" className="section intro">
      <Reveal className="intro-title">
        <Eyebrow>01 / UNE AUTRE IDÉE DE LA COUVERTURE</Eyebrow>
        <h2>
          Au-dessus de vous,
          <br />
          <em>bien plus qu’un toit.</em>
        </h2>
      </Reveal>
      <Reveal className="intro-photo">
        <Photo
          id="introduction"
          alt="Artisan au travail sur une couverture — photographie d’illustration"
        />
        <span>LE GESTE JUSTE, DÈS LE DÉPART</span>
      </Reveal>
      <Reveal className="intro-copy">
        <p>
          Une toiture dessine la silhouette d’une maison. Elle abrite les
          moments qui comptent et donne au bâti son identité.
        </p>
        <p className="muted">
          À Joinville-le-Pont, France Couverture est votre interlocuteur pour
          parler de votre projet, comprendre votre besoin et envisager la suite.
        </p>
        <Link className="text-link" to="/a-propos">
          Rencontrer France Couverture <ArrowUpRight size={18} />
        </Link>
      </Reveal>
    </section>
  );
}
function Services({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <section className="section services">
      <Reveal className="section-heading">
        <div>
          <Eyebrow>02 — NOS DOMAINES D’INTERVENTION</Eyebrow>
          <h2>
            À chaque toiture,
            <br />
            <em>sa solution.</em>
          </h2>
        </div>
        <p>
          Du premier constat aux finitions,
          <br />
          explorons les besoins de votre habitat.
          <small>Prestations proposées, à confirmer avec l’entreprise.</small>
        </p>
      </Reveal>
      {full ? (
        <div className="service-grid">
          {services.map(([title, desc, img], i) => (
            <Reveal key={title}>
              <article className="service-card">
                <div className="service-card-image">
                  <Photo
                    id={img}
                    alt={title + " — photographie d’illustration"}
                  />
                  <small>ILLUSTRATION</small>
                </div>
                <div>
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <Link
                    className="text-link"
                    to={"/contact?travaux=" + encodeURIComponent(title)}
                  >
                    Parlons de votre projet <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="service-showcase">
          <Reveal className="service-photo">
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={"/images/" + services[active][2] + ".webp"}
                alt="Travaux de couverture — illustration"
                initial={{
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  scale: 1.04,
                }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)", scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </AnimatePresence>
            <span>LE SENS DU DÉTAIL</span>
            <small>Photographie d’illustration</small>
          </Reveal>
          <div className="service-list">
            {services.slice(0, 4).map(([title, desc], i) => (
              <div
                className={"service-row " + (active === i ? "selected" : "")}
                key={title}
              >
                <button
                  aria-expanded={active === i}
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <ArrowUpRight />
                </button>
                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p>{desc}</p>
                      <Link
                        to={"/contact?travaux=" + encodeURIComponent(title)}
                      >
                        Échanger sur ce besoin <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link className="text-link all-services" to="/services">
              Tous nos services <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
function PhotoBand() {
  return (
    <section className="photo-band">
      <Photo
        id="craftsmanship"
        alt="Détail de couverture et de matériaux — photographie d’illustration"
      />
      <div className="photo-band-overlay" />
      <Reveal>
        <Eyebrow>LA MATIÈRE. LE GESTE. L’ÉQUILIBRE.</Eyebrow>
        <h2>
          Le soin du geste.
          <br />
          <em>Le respect du bâti.</em>
        </h2>
        <p>
          Comprendre ce qui existe.
          <br />
          Préparer ce qui vient.
        </p>
      </Reveal>
      <small>Photographie d’illustration</small>
    </section>
  );
}
function About({ full = false }: { full?: boolean }) {
  return (
    <section className="section about">
      <Reveal className="about-image">
        <Photo
          id={full ? "about-detail" : "about-home"}
          alt={
            full
              ? "Travail de rénovation de toiture — photographie d’illustration"
              : "Maison et couverture française — photographie d’illustration"
          }
        />
        <div className="image-tag">
          <MapPin size={19} />
          <span>
            UNE ENTREPRISE LOCALE
            <br />
            <strong>Joinville-le-Pont, 94340</strong>
          </span>
        </div>
      </Reveal>
      <Reveal className="about-copy">
        <Eyebrow>03 — FRANCE COUVERTURE</Eyebrow>
        <h2>
          Votre maison.
          <br />
          Votre projet.
          <br />
          <em>Un dialogue local.</em>
        </h2>
        <p>
          Une toiture ne se choisit pas sur catalogue. Son histoire, ses
          matériaux et son environnement méritent d’être compris avant de
          décider.
        </p>
        <p className="muted">
          Retrouvez France Couverture au 3 Avenue Jean Jaurès, à
          Joinville-le-Pont. Un premier échange permet de préciser votre besoin
          et de vérifier les possibilités d’intervention.
        </p>
        {full ? (
          <div className="values">
            <div>
              <h3>Comprendre avant de proposer</h3>
              <p>
                Décrire le problème, observer la toiture et définir le périmètre
                du projet.
              </p>
            </div>
            <div>
              <h3>Respecter l’existant</h3>
              <p>
                Tenir compte de l’architecture, des matériaux et des contraintes
                du bâti.
              </p>
            </div>
          </div>
        ) : (
          <Link className="text-link" to="/a-propos">
            Faisons connaissance <ArrowUpRight size={19} />
          </Link>
        )}
      </Reveal>
    </section>
  );
}
function Materials() {
  return (
    <section className="materials section">
      <Reveal>
        <Eyebrow>04 — MATIÈRES & FINITIONS</Eyebrow>
        <h2>
          Le bon matériau.
          <br />
          <em>À la bonne place.</em>
        </h2>
        <p>
          La beauté d’une couverture tient à son ensemble.
          <br />
          Sa durabilité se joue aussi dans les détails.
        </p>
      </Reveal>
      <Reveal className="material-photo">
        <Photo
          id="material-detail"
          alt="Texture de tuiles anciennes — illustration"
        />
        <small>LA BEAUTÉ DE LA MATIÈRE · ILLUSTRATION</small>
      </Reveal>
      <div className="material-items">
        {[
          [
            Layers,
            "Tuiles & ardoises",
            "Une identité visuelle, une pente et des contraintes à respecter.",
          ],
          [
            Droplets,
            "Zinc & évacuations",
            "Des raccords et des cheminements d’eau à examiner avec attention.",
          ],
          [
            Hammer,
            "Pose & finitions",
            "Des points singuliers à intégrer dès la préparation du projet.",
          ],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Layers;
          return (
            <Reveal key={String(t)}>
              <I size={28} strokeWidth={1} />
              <h3>{String(t)}</h3>
              <p>{String(d)}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
const gallery = galleryContent;
function Gallery({ full = false }: { full?: boolean }) {
  const [filter, setFilter] = useState("Tout"),
    [selected, setSelected] = useState<number | null>(null);
  const close = () => setSelected(null);
  useModalKeys(selected !== null, ".lightbox", close);
  return (
    <section className="section gallery">
      <Reveal className="section-heading">
        <div>
          <Eyebrow>05 — REGARDS SUR LA COUVERTURE</Eyebrow>
          <h2>
            Des toitures.
            <br />
            <em>Du caractère.</em>
          </h2>
        </div>
        <div>
          <p>
            Un aperçu des matières et des lignes
            <br />
            qui inspirent vos futurs projets.
          </p>
          <small>
            Images d’illustration. Photographies de référence, sans attribution
            <br />
            de chantier à France Couverture.
          </small>
        </div>
      </Reveal>
      <div className="filters" aria-label="Filtrer les illustrations">
        {["Tout", "Ardoise", "Tuiles", "Zinc"].map((f) => (
          <button
            aria-pressed={filter === f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      <motion.div layout className="gallery-grid">
        {gallery
          .filter((_, i) => full || i < 3)
          .map(
            ([title, type, img], i) =>
              (filter === "Tout" || filter === type) && (
                <motion.button
                  layout
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={"gallery-card item-" + i}
                  onClick={() => setSelected(i)}
                  key={title}
                >
                  <div className="gallery-img">
                    <Photo id={img} alt={title + " — illustration"} />
                    <span className="round-arrow">
                      <ArrowUpRight />
                    </span>
                    <small>ILLUSTRATION</small>
                  </div>
                  <div className="gallery-caption">
                    <h3>{title}</h3>
                    <span>
                      0{i + 1} / {type}
                    </span>
                  </div>
                </motion.button>
              ),
          )}
      </motion.div>
      {!full && (
        <Link className="text-link" to="/realisations">
          Explorer la galerie <ArrowUpRight size={18} />
        </Link>
      )}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={gallery[selected][0]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              aria-label="Fermer la photographie"
              className="close"
              onClick={close}
            >
              <X />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <img
                src={"/images/" + gallery[selected][2] + ".webp"}
                alt={gallery[selected][0]}
              />
              <h3>{gallery[selected][0]}</h3>
              <p>
                Photographie d’illustration — aucun chantier client présenté.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
function Process() {
  return (
    <section className="section process">
      <Reveal>
        <Eyebrow>06 — VOTRE PROJET, PAS À PAS</Eyebrow>
        <h2>
          Avancer ensemble.
          <br />
          <em>Simplement.</em>
        </h2>
      </Reveal>
      <motion.div
        className="timeline-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
      <div className="process-grid">
        {[
          [
            "Échanger",
            "Vous nous décrivez votre toiture, vos attentes et les signes observés.",
          ],
          [
            "Étudier",
            "L’état du toit, l’accès et les contraintes du chantier sont à examiner.",
          ],
          [
            "Définir",
            "Le périmètre des travaux et les modalités sont précisés dans une proposition.",
          ],
          [
            "Organiser",
            "Le calendrier et le déroulement sont convenus avant toute intervention.",
          ],
        ].map(([t, d], i) => (
          <Reveal key={t}>
            <span className="process-number">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>
      <small>Parcours indicatif, modalités à convenir avec l’entreprise.</small>
    </section>
  );
}
function Area({ full = false }: { full?: boolean }) {
  return (
    <section className="section area">
      <Reveal>
        <Eyebrow>07 — L’ANCRAGE LOCAL</Eyebrow>
        <h2>
          À Joinville-le-Pont.
          <br />
          <em>Tout près de votre projet.</em>
        </h2>
        <p>
          Un projet de rénovation de toiture à Joinville-le-Pont, 94340, ou une
          réparation de toiture dans le Val-de-Marne ? Contactez France
          Couverture pour vérifier la prise en charge de votre adresse.
        </p>
        <p className="muted">
          Le périmètre d’intervention et les déplacements sont à confirmer
          directement avec l’entreprise.
        </p>
        <a className="text-link" href={maps} target="_blank" rel="noreferrer">
          Nous situer sur Google Maps <ArrowUpRight size={18} />
        </a>
        {full && (
          <div className="area-note">
            <h3>Votre chantier se situe à proximité ?</h3>
            <p>
              Indiquez la commune et l’adresse du chantier lors de votre appel.
              La possibilité d’intervention dépendra du lieu et de la nature des
              travaux.
            </p>
            <Button>Parlons de votre adresse</Button>
          </div>
        )}
      </Reveal>
      <Reveal className="location-photo">
        <Photo
          id="local-architecture"
          alt="Architecture résidentielle à Joinville-le-Pont — photographie locale d’illustration"
        />
        <div className="location-card">
          <span>FRANCE COUVERTURE · JOINVILLE-LE-PONT</span>
          <h3>
            Une adresse.
            <br />
            Un interlocuteur local.
          </h3>
          <p>
            3 Avenue Jean Jaurès
            <br />
            94340 Joinville-le-Pont, France
          </p>
          <div>
            <a href={maps} target="_blank" rel="noreferrer">
              Voir l’itinéraire <ArrowUpRight size={17} />
            </a>
            <a href={phone}>
              <Phone size={17} />
              Appeler
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
const faqs = [
  [
    "Comment préparer une demande de devis ?",
    "Précisez l’adresse du chantier, le type de toiture, les signes observés et vos attentes. Des photos prises depuis un endroit sûr peuvent faciliter le premier échange. Le contenu et les conditions du devis sont à confirmer avec France Couverture.",
  ],
  [
    "Une infiltration nécessite-t-elle une rénovation complète ?",
    "Pas nécessairement. Une infiltration peut avoir plusieurs origines. Un examen de la couverture et de ses points sensibles est nécessaire pour déterminer les travaux appropriés.",
  ],
  [
    "Intervenez-vous dans tout le Val-de-Marne ?",
    "France Couverture est située à Joinville-le-Pont. Contactez l’entreprise avec l’adresse de votre chantier pour confirmer la possibilité d’intervention ; le périmètre est précisé selon le lieu et la nature des travaux.",
  ],
  [
    "Quels matériaux choisir pour ma toiture ?",
    "Le choix dépend notamment de la pente, du support, de l’aspect recherché et des règles d’urbanisme applicables. Les tuiles, l’ardoise et les éléments de zinguerie répondent à des besoins différents.",
  ],
  [
    "Comment vous contacter pour un devis ?",
    "Appelez France Couverture au 07 56 87 91 10 avec l’adresse du chantier et une description de votre besoin. Le premier échange permet de préciser les informations utiles à l’étude de votre toiture.",
  ],
];
function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section className="section faq">
      <Reveal>
        <Eyebrow>08 — VOS QUESTIONS</Eyebrow>
        <h2>
          Parlons toiture.
          <br />
          <em>En toute clarté.</em>
        </h2>
        <a className="text-link" href={phone}>
          Une autre question ? Appelez-nous <ArrowUpRight size={18} />
        </a>
      </Reveal>
      <div>
        {faqs.map(([q, a], i) => (
          <div className="faq-row" key={q}>
            <button
              aria-expanded={active === i}
              aria-controls={"faq-" + i}
              onClick={() => setActive(active === i ? null : i)}
            >
              {q}
              {active === i ? <Minus size={19} /> : <Plus size={19} />}
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div
                  id={"faq-" + i}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
function CTA() {
  return (
    <section className="cta section">
      <Reveal>
        <Eyebrow>UN PROJET EN TÊTE ?</Eyebrow>
        <h2>
          Et si on parlait
          <br />
          <em>de votre toiture ?</em>
        </h2>
      </Reveal>
      <Reveal>
        <Button>Demander un devis</Button>
        <a className="cta-phone" href={phone}>
          <Phone size={20} />
          07 56 87 91 10
        </a>
        <span>Un premier échange pour préciser votre besoin.</span>
      </Reveal>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <Reveal className="footer-reveal">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Protéger votre maison.
              <br />
              Respecter son caractère.
            </p>
          </div>
          <div>
            <h3>EXPLORER</h3>
            {nav.slice(1).map(([u, l]) => (
              <Link key={u} to={u}>
                {l}
              </Link>
            ))}
          </div>
          <div>
            <h3>NOUS TROUVER</h3>
            <p>
              3 Avenue Jean Jaurès
              <br />
              94340 Joinville-le-Pont, France
            </p>
            <a href={maps} target="_blank" rel="noreferrer">
              Voir l’itinéraire ↗
            </a>
            <a href={phone}>+33 7 56 87 91 10</a>
          </div>
          <div>
            <h3>VOTRE PROJET</h3>
            <p>
              Une rénovation, une réparation,
              <br />
              une question sur votre toiture ?
            </p>
            <Link className="text-link" to="/contact">
              Parlons-en <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} France Couverture</span>
          <Link to="/informations">Informations & confidentialité</Link>
          <span>CONÇU AVEC LE SENS DU DÉTAIL</span>
        </div>
      </Reveal>
    </footer>
  );
}
function PageHero({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <section className="page-hero section">
      <Reveal>
        <Eyebrow>{tag}</Eyebrow>
        <h1>{title}</h1>
        <p>{desc}</p>
      </Reveal>
      <span className="page-line" />
    </section>
  );
}
function Contact() {
  const [status, setStatus] = useState(""),
    [fileError, setFileError] = useState(""),
    [sending, setSending] = useState(false),
    [success, setSuccess] = useState(false);
  const online = validQuoteEndpoint(siteConfig.quoteEndpoint);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  return (
    <>
      <PageHero
        tag="CONTACT — DONNONS FORME À VOTRE PROJET"
        title="Tout commence par un échange."
        desc="Un projet de toiture, une question, un besoin à préciser ? Échangeons sur votre maison."
      />
      <section className="section contact">
        <Reveal className="contact-info">
          <Eyebrow>PARLONS DE VOTRE TOITURE</Eyebrow>
          <h2>
            À votre écoute,
            <br />
            <em>à Joinville-le-Pont.</em>
          </h2>
          <a className="contact-number" href={phone}>
            07 56 87 91 10 <ArrowUpRight />
          </a>
          <p>
            3 Avenue Jean Jaurès
            <br />
            94340 Joinville-le-Pont, France
          </p>
          <a className="text-link" href={maps} target="_blank" rel="noreferrer">
            Ouvrir Google Maps <ArrowUpRight size={18} />
          </a>
          <div className="contact-photo">
            <Photo
              id="contact-detail"
              alt="Détail d’une toiture française — illustration"
            />
            <small>PHOTOGRAPHIE D’ILLUSTRATION</small>
          </div>
          <div className="contact-note">
            <strong>Votre projet mérite un échange.</strong>
            <p>
              Précisez l’adresse, la nature de votre toiture et les signes
              observés. Prenez vos photos depuis un endroit sûr, sans monter sur
              le toit.
            </p>
          </div>
        </Reveal>
        <form
          aria-busy={sending}
          onChange={() => {
            setStatus("");
            setSuccess(false);
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!online || sending || fileError) return;
            const form = e.currentTarget;
            const data = new FormData(form);
            if (
              String(data.get("nom") || "").trim().length < 2 ||
              String(data.get("adresse") || "").trim().length < 5 ||
              String(data.get("description") || "").trim().length < 15
            ) {
              setStatus("Veuillez préciser vos coordonnées et votre projet.");
              return;
            }
            const digits = String(data.get("telephone") || "").replace(
              /[^0-9]/g,
              "",
            );
            if (
              digits.length < 9 ||
              digits.length > 15 ||
              !/^[+0-9 ().-]+$/.test(String(data.get("telephone") || ""))
            ) {
              setStatus("Veuillez renseigner un numéro de téléphone valide.");
              return;
            }
            if (String(data.get("website") || "")) return;
            const photo = data.get("photo");
            if (
              photo instanceof File &&
              photo.size > 0 &&
              (photo.size > 10 * 1024 * 1024 ||
                !["image/jpeg", "image/png", "image/webp"].includes(photo.type))
            ) {
              setFileError(
                "Choisissez une image JPEG, PNG ou WebP de moins de 10 Mo.",
              );
              return;
            }
            setSending(true);
            setStatus("");
            setSuccess(false);
            controller.current = new AbortController();
            const timeout = window.setTimeout(
              () => controller.current?.abort(),
              20000,
            );
            try {
              await sendQuote(
                siteConfig.quoteEndpoint,
                data,
                controller.current.signal,
              );
              setSuccess(true);
              setStatus(
                "Votre demande a bien été reçue. France Couverture pourra vous contacter aux coordonnées indiquées.",
              );
              form.reset();
            } catch (error) {
              setStatus(
                error instanceof Error && error.name !== "AbortError"
                  ? error.message
                  : "Aucune confirmation de réception n’a été reçue. Veuillez nous appeler avant de renouveler votre demande.",
              );
            } finally {
              window.clearTimeout(timeout);
              setSending(false);
            }
          }}
        >
          <div className="form-heading">
            <span>VOTRE DEMANDE</span>
            <h2>Parlons de votre toiture.</h2>
            <p>
              {online
                ? "Renseignez les informations utiles à votre projet."
                : "Pour demander un devis, contactez-nous au 07 56 87 91 10. L’envoi en ligne est actuellement indisponible."}
            </p>
          </div>
          <fieldset disabled={sending || !online}>
            <legend className="sr-only">
              Coordonnées et description du chantier
            </legend>
            <label className="honeypot" aria-hidden="true">
              Votre site
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="form-grid">
              <label>
                Nom *
                <input
                  required
                  name="nom"
                  autoComplete="name"
                  minLength={2}
                  placeholder="Votre nom"
                />
              </label>
              <label>
                Téléphone *
                <input
                  required
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="06 00 00 00 00"
                />
              </label>
              <label>
                E-mail *
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.fr"
                />
              </label>
              <label>
                Type de travaux *
                <select
                  name="travaux"
                  required
                  defaultValue={
                    new URLSearchParams(window.location.search).get(
                      "travaux",
                    ) || ""
                  }
                >
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  {services.map((s) => (
                    <option key={s[0]}>{s[0]}</option>
                  ))}
                  <option>Autre / À préciser</option>
                </select>
              </label>
              <label className="wide">
                Adresse du chantier *
                <input
                  required
                  name="adresse"
                  autoComplete="street-address"
                  placeholder="Adresse, code postal et commune"
                  minLength={5}
                />
              </label>
              <label className="wide">
                Description de votre projet *
                <textarea
                  required
                  name="description"
                  minLength={15}
                  rows={5}
                  placeholder="Votre toiture, vos besoins, les signes observés…"
                />
              </label>
              <label className="wide upload">
                <span>
                  <Upload size={19} />
                  Ajouter une photo{" "}
                  <small>Facultatif · JPEG, PNG, WebP · 10 Mo maximum</small>
                </span>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setFileError(
                      f &&
                        (f.size > 10 * 1024 * 1024 ||
                          !["image/jpeg", "image/png", "image/webp"].includes(
                            f.type,
                          ))
                        ? "Choisissez une image JPEG, PNG ou WebP de moins de 10 Mo."
                        : "",
                    );
                  }}
                />
              </label>
            </div>
            {fileError && (
              <p role="alert" className="error">
                {fileError}
              </p>
            )}
            <label className="consent">
              <input required name="consent" value="accepted" type="checkbox" />{" "}
              <span>
                J’ai lu les{" "}
                <Link to="/informations">informations de confidentialité</Link>{" "}
                et j’accepte que mes coordonnées soient utilisées pour répondre
                à ma demande. *
              </span>
            </label>
            <button
              type="submit"
              className="button"
              disabled={!online || sending}
            >
              {sending ? "Envoi en cours…" : "Envoyer ma demande"}
              <ArrowUpRight size={18} />
            </button>
          </fieldset>
          {!online && (
            <a className="button contact-fallback" href={phone}>
              <Phone size={17} />
              Demander un devis par téléphone
            </a>
          )}
          <p className="form-hint">
            * Champs obligatoires. Vos informations servent à étudier votre
            demande.
          </p>
          {status && (
            <div
              className={success ? "form-status" : "form-status form-error"}
              role="status"
            >
              {success ? <Check size={21} /> : <Phone size={21} />}
              <p>{status}</p>
            </div>
          )}
        </form>
      </section>
    </>
  );
}
function Info() {
  return (
    <>
      <PageHero
        tag="MENTIONS LÉGALES & CONFIDENTIALITÉ"
        title="Des informations en toute clarté."
        desc="Coordonnées, utilisation des données et droits sur les photographies."
      />
      <section className="section legal">
        <h2>France Couverture</h2>
        <p>
          3 Avenue Jean Jaurès, 94340 Joinville-le-Pont, France.
          <br />
          Téléphone : <a href={phone}>+33 7 56 87 91 10</a>.
        </p>
        {siteConfig.legal.companyName && (
          <p>
            Raison sociale : {siteConfig.legal.companyName}
            <br />
            Forme juridique : {siteConfig.legal.legalForm}
            <br />
            Immatriculation : {siteConfig.legal.registrationNumber}
            <br />
            Responsable de publication : {siteConfig.legal.publicationDirector}
          </p>
        )}
        {siteConfig.legal.hostingName && (
          <>
            <h3>Hébergement</h3>
            <p>
              {siteConfig.legal.hostingName}
              <br />
              {siteConfig.legal.hostingAddress}
            </p>
          </>
        )}
        <h3>Vos données personnelles</h3>
        <p>
          Le site n’installe aucun outil publicitaire ou de mesure d’audience.
          Les informations saisies dans le formulaire restent dans votre
          navigateur tant qu’aucun envoi n’est effectué. Aucun envoi en ligne
          n’est possible lorsque ce service est indiqué comme indisponible.
        </p>
        {siteConfig.legal.privacyContact && (
          <p>
            Pour exercer vos droits d’accès, de rectification ou d’effacement,
            contactez : {siteConfig.legal.privacyContact}. Les demandes sont
            conservées pendant {siteConfig.legal.retentionPeriod}.
          </p>
        )}
        <p>
          Lors d’un appel, les coordonnées et informations que vous communiquez
          permettent à l’entreprise de répondre à votre demande. Les liens vers
          Google Maps ouvrent un service externe soumis à sa propre politique de
          confidentialité.
        </p>
        <h3>Photographies et droits d’utilisation</h3>
        <p>
          Les photographies présentent des gestes, des matériaux et des
          architectures de référence. Elles ne constituent pas un portfolio de
          chantiers de France Couverture. Les personnes photographiées ne sont
          pas présentées comme membres de l’entreprise. Les images sont
          recadrées et converties en WebP ; leurs licences et auteurs sont
          indiqués ci-dessous.
        </p>
        <div className="photo-credits">
          {photos.map((p) => (
            <p key={p.id}>
              <a href={p.source} target="_blank" rel="noreferrer">
                {p.title}
              </a>{" "}
              — {p.artist}.{" "}
              <a href={p.licenseUrl} target="_blank" rel="noreferrer">
                {p.license}
              </a>
              .
            </p>
          ))}
        </div>
      </section>
    </>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <PhotoBand />
      <About />
      <Materials />
      <Gallery />
      <Process />
      <Area />
      <FAQ />
      <CTA />
    </>
  );
}
function RouteTransition() {
  const loc = useLocation();
  return (
    <motion.div
      key={loc.pathname}
      className="route-progress"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{
        scaleX: { duration: 0.65 },
        opacity: { delay: 0.6, duration: 0.3 },
      }}
    />
  );
}
function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <Header />
        <RouteTransition />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/services"
              element={
                <>
                  <PageHero
                    tag="NOS SERVICES"
                    title="La couverture, dans tous ses détails."
                    desc="Des pistes de travaux adaptées aux différentes étapes de vie de votre toiture. Les prestations présentées sont à confirmer avec France Couverture."
                  />
                  <Services full />
                  <Materials />
                  <FAQ />
                  <CTA />
                </>
              }
            />
            <Route
              path="/a-propos"
              element={
                <>
                  <PageHero
                    tag="À PROPOS"
                    title="Une adresse locale. Un projet qui vous ressemble."
                    desc="France Couverture, entreprise de couverture à Joinville-le-Pont. Un point de départ concret pour parler de votre habitat."
                  />
                  <About full />
                  <PhotoBand />
                  <Process />
                  <CTA />
                </>
              }
            />
            <Route
              path="/realisations"
              element={
                <>
                  <PageHero
                    tag="NOS RÉALISATIONS — GALERIE D’INSPIRATION"
                    title="La toiture comme signature."
                    desc="Tuiles, ardoises, zinc : découvrez les matières et les lignes de la couverture. Une sélection photographique de référence, distincte des réalisations de l’entreprise."
                  />
                  <Gallery full />
                  <CTA />
                </>
              }
            />
            <Route
              path="/zones"
              element={
                <>
                  <PageHero
                    tag="ZONES D’INTERVENTION"
                    title="Votre projet, à proximité."
                    desc="Retrouvez France Couverture à Joinville-le-Pont, dans le Val-de-Marne. La prise en charge de chaque adresse reste à confirmer."
                  />
                  <Area full />
                  <FAQ />
                  <CTA />
                </>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/informations" element={<Info />} />
            <Route
              path="*"
              element={
                <>
                  <PageHero
                    tag="PAGE INTROUVABLE"
                    title="Retrouvons le bon chemin."
                    desc="Cette page n’existe pas. Retrouvez nos services ou contactez France Couverture."
                  />
                  <div className="section">
                    <Button to="/">Retour à l’accueil</Button>
                  </div>
                </>
              }
            />
          </Routes>
        </main>
        <Footer />
        <div className="mobile-sticky">
          <a href={phone}>
            <Phone size={17} />
            Appeler
          </a>
          <Link to="/contact">
            Demander un devis
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
