import { createFileRoute } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { OfferDetail } from "@/components/site/OfferDetail";
import { pageHead } from "@/components/site/PageShell";
import { OFFERS } from "@/lib/site";

const offer = OFFERS.find((item) => item.slug === "cleaning-business-setup")!;

/** 
 * /services/cleaning-business-setup - Full service detail per Section 5.2 spec
 */
export const Route = createFileRoute("/services/cleaning-business-setup")({
  head: () => pageHead(
    "/services/cleaning-business-setup",
    offer.name,
    "A focused setup for owner-led residential cleaning businesses with existing customers in Hudson County, New Jersey.",
  ),
  component: CleaningBusinessSetupPage,
});

/** 
 * Service detail following Section 5.2 mandatory requirements
 */
function CleaningBusinessSetupPage() {
  return <OfferDetail offer={offer} />;
}
