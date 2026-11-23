import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  About,
  Contact,
  Faq,
  Hero,
  HowItWorks,
  Method,
  Problems,
  Services,
  Statement,
} from "@/components/site/Sections";
import { SITE } from "@/lib/site";
import { AssistantWidget } from "@/components/site/AssistantWidget";

const TITLE = "CH Business Services — We build the business behind the brand";
const DESCRIPTION =
  "Brand architecture and business systems studio helping service-business founders connect a clear brand promise with the structure to deliver it.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: SITE.name,
          description: DESCRIPTION,
          email: SITE.email,
          telephone: "+1-929-515-5434",
          foundingDate: String(SITE.established),
          founder: { "@type": "Person", name: SITE.founder },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <Problems />
        <Services />
        <Method />
        <HowItWorks />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
