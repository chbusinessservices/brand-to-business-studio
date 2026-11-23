import { createFileRoute } from "@tanstack/react-router";
import { OfferDetail } from "@/components/site/OfferDetail";
import { pageHead } from "@/components/site/PageShell";
import { OFFERS } from "@/lib/site";

const offer = OFFERS.find((o) => o.slug === "cleaning-business-setup")!;

export const Route = createFileRoute("/services/cleaning-business-setup")({
  head: () => pageHead("/services/cleaning-business-setup", offer.name, offer.short),
  component: () => <OfferDetail offer={offer} />,
});
