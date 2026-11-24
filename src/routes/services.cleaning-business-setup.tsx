import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE, EVIDENCE_LABELS } from "@/lib/site";
import { OfferDetail as BaseOfferDetail } from "@/components/site/Sections";

/** 
 * /services/cleaning-business-setup - Full service detail per Section 5.2 spec
 */
export const Route = createFileRoute("/services/cleaning-business-setup")({
  head: () => ({
    title: `${SITE.name} — Cleaning Business Setup`,
    description: "A focused setup for owner-led residential cleaning businesses with existing customers in Hudson County, New Jersey.",
    children: {
      "og:title": "Cleaning Business Setup | CH Business Services",
      "og:description": "From service definition to delivery systems—we build the business behind your brand.",
      "og:type": "website",
    },
  }),
  component: CleaningBusinessSetupPage,
});

/** 
 * Service detail following Section 5.2 mandatory requirements
 */
function CleaningBusinessSetupPage() {
  return <BaseOfferDetail />;
}
