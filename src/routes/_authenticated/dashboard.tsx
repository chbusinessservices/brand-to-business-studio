import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, Inbox, Loader2, LogOut, Mail, Search, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { INQUIRY_STATUSES, STATUS_LABELS, type InquiryStatus } from "@/lib/inquiry-schema";
import { SERVICE_OPTIONS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Inquiries — CH Business Services" },
      { name: "description", content: "Owner dashboard for CH Business Services inquiries." },
      { property: "og:title", content: "Inquiries — CH Business Services" },
      { property: "og:description", content: "Owner dashboard for CH Business Services inquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

const accessQuery = (userId: string) => ({
  queryKey: ["owner-access", userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
});

const inquiriesQuery = {
  queryKey: ["inquiries"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    return data as Inquiry[];
  },
};

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-foreground text-background border-foreground",
  contacted: "bg-accent text-foreground border-stone-soft",
  scheduled: "bg-background text-foreground border-foreground",
  completed: "bg-muted text-muted-foreground border-border",
  archived: "bg-background text-muted-foreground border-border border-dashed",
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={cn("inline-flex items-center border px-2 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const access = useQuery(accessQuery(user.id));

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="View website">
              <Logo variant="onLight" height={32} />
            </a>
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="eyebrow hidden text-muted-foreground sm:block">Owner workspace</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[14rem] truncate text-sm text-muted-foreground md:block">{user.email}</span>
            <Button variant="outline" size="sm" className="h-10 px-3" onClick={signOut}>
              <LogOut aria-hidden /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        {access.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : access.isError ? (
          <ErrorPanel message="We couldn't check your access. Please refresh the page." />
        ) : !access.data ? (
          <NoAccess email={user.email ?? ""} onSignOut={signOut} />
        ) : (
          <InquiriesView />
        )}
      </main>
    </div>
  );
}

function NoAccess({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="mx-auto max-w-lg border bg-background p-8 md:p-10">
      <ShieldAlert className="h-6 w-6" aria-hidden />
      <h1 className="display mt-5 text-3xl">This account doesn't have owner access.</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You're signed in as <span className="text-foreground">{email}</span>. The inquiry dashboard
        is limited to authorized CH accounts. If you believe this is a mistake, contact{" "}
        <a href={SITE.emailHref} className="underline">
          {SITE.email}
        </a>
        .
      </p>
      <Button className="mt-8" onClick={onSignOut}>
        Sign in with a different account
      </Button>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div role="alert" className="border border-destructive/40 bg-background p-6 text-destructive">
      {message}
    </div>
  );
}

function InquiriesView() {
  const { data, isPending, isError, refetch, isFetching } = useQuery(inquiriesQuery);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all" | "open">("open");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0, open: 0 };
    for (const s of INQUIRY_STATUSES) c[s] = 0;
    for (const row of data ?? []) {
      c.all++;
      c[row.status]++;
      if (row.status !== "archived" && row.status !== "completed") c.open++;
    }
    return c;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((row) => {
      if (statusFilter === "open" && (row.status === "archived" || row.status === "completed")) return false;
      if (statusFilter !== "all" && statusFilter !== "open" && row.status !== statusFilter) return false;
      if (serviceFilter !== "all") {
        if (serviceFilter === "none" ? row.service_interest.length > 0 : !row.service_interest.includes(serviceFilter)) return false;
      }
      if (q) {
        const hay = `${row.name} ${row.email} ${row.business_name} ${row.message} ${row.internal_notes ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, statusFilter, serviceFilter, search]);

  const selected = data?.find((r) => r.id === selectedId) ?? null;

  const tabs: { key: typeof statusFilter; label: string }[] = [
    { key: "open", label: "Open" },
    ...INQUIRY_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s] })),
    { key: "all", label: "All" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">Inquiries</p>
          <h1 className="display mt-2 text-4xl md:text-5xl">Inquiry pipeline</h1>
        </div>
        <Button variant="outline" size="sm" className="h-10 self-start md:self-auto" onClick={() => refetch()} disabled={isFetching}>
          {isFetching && <Loader2 className="animate-spin" aria-hidden />} Refresh
        </Button>
      </div>

      <div className="mt-8 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <div role="tablist" aria-label="Filter by status" className="flex min-w-max border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={statusFilter === t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "-mb-px flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm transition-colors",
                statusFilter === t.key
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="tabular-nums text-xs text-muted-foreground">{counts[t.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Search inquiries"
            placeholder="Search name, email, business, message…"
            className="h-11 bg-background pl-9 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger aria-label="Filter by service" className="h-11 bg-background sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
            <SelectItem value="none">No service selected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorPanel message="We couldn't load inquiries. Please refresh to try again." />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No inquiries yet" body="New submissions from the website contact form will appear here as soon as they're received." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing matches these filters" body="Try a different status, service, or search term." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden border bg-background md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/60">
                  <tr className="eyebrow text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-normal">Date</th>
                    <th scope="col" className="px-4 py-3 font-normal">Name</th>
                    <th scope="col" className="px-4 py-3 font-normal">Business</th>
                    <th scope="col" className="px-4 py-3 font-normal">Service interest</th>
                    <th scope="col" className="px-4 py-3 font-normal">Message</th>
                    <th scope="col" className="px-4 py-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className="cursor-pointer border-b align-top transition-colors last:border-b-0 hover:bg-muted/50"
                    >
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-muted-foreground">
                        {format(new Date(row.created_at), "MMM d, yyyy")}
                        <span className="block text-xs">{format(new Date(row.created_at), "h:mm a")}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(row.id);
                          }}
                          className="text-left font-medium hover:underline"
                        >
                          {row.name}
                        </button>
                        <span className="block break-all text-xs text-muted-foreground">{row.email}</span>
                      </td>
                      <td className="px-4 py-4">{row.business_name}</td>
                      <td className="px-4 py-4">
                        <ServiceTags tags={row.service_interest} />
                      </td>
                      <td className="max-w-xs px-4 py-4 text-muted-foreground">
                        <p className="line-clamp-2">{row.message}</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className="block w-full border bg-background p-5 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{row.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{row.business_name}</p>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{row.message}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <ServiceTags tags={row.service_interest} />
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {format(new Date(row.created_at), "MMM d")}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Showing {filtered.length} of {data?.length ?? 0} inquiries
            </p>
          </>
        )}
      </div>

      <InquirySheet inquiry={selected} onClose={() => setSelectedId(null)} />
    </>
  );
}

function ServiceTags({ tags }: { tags: string[] }) {
  if (!tags.length) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="border px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wide">
          {t}
        </span>
      ))}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center border border-dashed bg-background px-6 py-16 text-center">
      <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden />
      <p className="mt-4 text-lg font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function InquirySheet({ inquiry, onClose }: { inquiry: Inquiry | null; onClose: () => void }) {
  return (
    <Sheet open={!!inquiry} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        {inquiry && <InquiryDetail key={inquiry.id} inquiry={inquiry} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function InquiryDetail({ inquiry, onClose }: { inquiry: Inquiry; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [assignedOwner, setAssignedOwner] = useState(inquiry.assigned_owner ?? "");
  const [nextAction, setNextAction] = useState(inquiry.next_action ?? "");
  const [notes, setNotes] = useState(inquiry.internal_notes ?? "");

  const dirty =
    status !== inquiry.status ||
    assignedOwner !== (inquiry.assigned_owner ?? "") ||
    nextAction !== (inquiry.next_action ?? "") ||
    notes !== (inquiry.internal_notes ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .update({
          status,
          assigned_owner: assignedOwner.trim().slice(0, 120) || null,
          next_action: nextAction.trim().slice(0, 300) || null,
          internal_notes: notes.trim().slice(0, 5000) || null,
        })
        .eq("id", inquiry.id)
        .select()
        .single();
      if (error) throw error;
      return data as Inquiry;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Inquiry[]>(["inquiries"], (old) =>
        old?.map((r) => (r.id === updated.id ? updated : r)),
      );
      toast.success("Inquiry updated");
    },
    onError: () => toast.error("Couldn't save changes. Please try again."),
  });

  return (
    <div className="flex min-h-full flex-col">
      <SheetHeader className="border-b p-6 text-left">
        <p className="eyebrow text-muted-foreground">
          Received {format(new Date(inquiry.created_at), "MMM d, yyyy 'at' h:mm a")}
        </p>
        <SheetTitle className="display text-3xl">{inquiry.name}</SheetTitle>
        <SheetDescription className="text-base">{inquiry.business_name}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-8 p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-muted-foreground">Email</dt>
            <dd className="mt-1 break-all">
              <a href={`mailto:${inquiry.email}`} className="underline">{inquiry.email}</a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-muted-foreground">Website</dt>
            <dd className="mt-1 break-all">
              {inquiry.website ? (
                <a href={inquiry.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 underline">
                  {inquiry.website.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-muted-foreground">Service interest</dt>
            <dd className="mt-2"><ServiceTags tags={inquiry.service_interest} /></dd>
          </div>
          <div>
            <dt className="eyebrow text-muted-foreground">Source</dt>
            <dd className="mt-1 capitalize">{inquiry.source}</dd>
          </div>
        </dl>

        <div>
          <p className="eyebrow text-muted-foreground">What prompted them to reach out</p>
          <p className="mt-3 whitespace-pre-wrap border-l-2 border-stone bg-muted p-4 leading-relaxed">{inquiry.message}</p>
        </div>

        <div className="grid gap-5 border-t pt-6">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as InquiryStatus)}>
              <SelectTrigger id="status" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="owner">Assigned owner</Label>
              <Input id="owner" className="h-11" maxLength={120} value={assignedOwner} onChange={(e) => setAssignedOwner(e.target.value)} placeholder="e.g. Elias" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="next">Next action</Label>
              <Input id="next" className="h-11" maxLength={300} value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="e.g. Send booking link" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" rows={5} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to CH owners." />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Owner email notification:{" "}
          {inquiry.notification_status === "sent"
            ? "sent"
            : inquiry.notification_status === "failed"
              ? `failed${inquiry.notification_error ? ` (${inquiry.notification_error})` : ""}`
              : "not set up yet"}
        </p>
      </div>

      <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-background p-5 sm:flex-row sm:justify-between">
        <Button variant="outline" className="h-11" asChild>
          <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Your inquiry with CH Business Services")}`}>
            <Mail aria-hidden /> Reply by email
          </a>
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" className="h-11" onClick={onClose}>Close</Button>
          <Button className="h-11 flex-1 sm:flex-none" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="animate-spin" aria-hidden />} Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
