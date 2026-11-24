import { createFileRoute } from "@tanstack/react-router";
import { OfferDetail } from "@/components/site/OfferDetail";
import { pageHead } from "@/components/site/PageShell";
import { OFFERS } from "@/lib/site";

const offer = OFFERS.find((o) => o.slug === "websites-inquiry")!;

export const Route = createFileRoute("/services/websites-inquiry/")({
  head: () => pageHead("/services/websites-inquiry/", offer.name, offer.short),
  component: () => <OfferDetail offer={offer} />,
});
