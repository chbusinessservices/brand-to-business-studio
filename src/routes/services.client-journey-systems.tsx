import { createFileRoute } from "@tanstack/react-router";
import { OfferDetail } from "@/components/site/OfferDetail";
import { pageHead } from "@/components/site/PageShell";
import { OFFERS } from "@/lib/site";

const offer = OFFERS.find((o) => o.slug === "client-journey-systems")!;

export const Route = createFileRoute("/services/client-journey-systems/")({
  head: () => pageHead("/services/client-journey-systems/", offer.name, offer.short),
  component: () => <OfferDetail offer={offer} />,
});
