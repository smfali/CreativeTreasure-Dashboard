"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Tag,
  Archive,
  RotateCcw,
  ShoppingCart,
  User,
  LifeBuoy,
  Mail,
  SearchX,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CustomerFormDialog } from "@/components/audience/CustomerFormDialog";
import { ChangeStatusDialog } from "@/components/audience/ChangeStatusDialog";
import { CustomerStatusBadge } from "@/components/audience/CustomerStatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/input";
import { useCustomers } from "@/contexts/CustomersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatDate, timeAgo } from "@/lib/format";
import {
  getCustomerOrders,
  getCustomerActivity,
  type ActivityEvent,
} from "@/lib/data/customers";

const activityMeta = {
  purchase: { icon: ShoppingCart, className: "text-success bg-success/15" },
  account: { icon: User, className: "text-info bg-info/15" },
  support: { icon: LifeBuoy, className: "text-warning bg-warning/15" },
  email: { icon: Mail, className: "text-muted-foreground bg-muted" },
} as const;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="break-all text-right text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default function CustomerDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getCustomer, updateCustomer, archiveCustomer, restoreCustomer } = useCustomers();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const customer = id ? getCustomer(id) : undefined;

  const orders = useMemo(() => (customer ? getCustomerOrders(customer.id) : []), [customer]);
  const activity = useMemo(() => (customer ? getCustomerActivity(customer.id) : []), [customer]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setNotes(customer?.notes ?? "");
  }, [customer]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8">
        <EmptyState
          icon={SearchX}
          title="Customer not found"
          description="This customer may have been removed."
          action={
            <Link href="/audience">
              <Button variant="secondary">Back to customers</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const record = customer;

  const avgOrderValue = record.orders > 0 ? record.totalSpent / record.orders : 0;
  const lifetimeValue = record.totalSpent * 1.35;

  function handleSaveNotes() {
    updateCustomer(record.id, { notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8 space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Audience" }, { label: customer.name }]} />

      <Link
        href="/audience"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to customers
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} className="h-14 w-14 text-lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="heading-page mb-0 text-xl sm:text-2xl">{customer.name}</h1>
                <CustomerStatusBadge status={customer.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {customer.email} · {customer.location}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Button>
            <Button variant="secondary" onClick={() => setStatusOpen(true)}>
              <Tag className="h-4 w-4" aria-hidden />
              Change status
            </Button>
            {customer.archived ? (
              <Button variant="secondary" onClick={() => restoreCustomer(customer.id)}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                Restore
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
                <Archive className="h-4 w-4" aria-hidden />
                Archive
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {customer.archived && (
        <Alert variant="info">
          This customer is archived and hidden from the audience list. Restore them to make them
          visible again.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total orders" value={String(customer.orders)} />
        <Stat label="Total spent" value={formatMoney(customer.totalSpent, symbol)} />
        <Stat label="Average order value" value={formatMoney(avgOrderValue, symbol)} />
        <Stat label="Lifetime value (est.)" value={formatMoney(lifetimeValue, symbol)} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border">
                  <InfoRow label="Account status" value={customer.archived ? "Archived" : "Active"} />
                  <InfoRow label="Joined" value={formatDate(customer.joinedAt)} />
                  <InfoRow label="Location" value={customer.location} />
                  <InfoRow label="Email" value={customer.email} />
                  <InfoRow label="Phone" value={customer.phone ?? "—"} />
                  <div className="flex items-start justify-between gap-4 py-2.5">
                    <dt className="shrink-0 text-sm text-muted-foreground">Tags</dt>
                    <dd className="text-right">
                      {customer.tags && customer.tags.length > 0 ? (
                        <span className="inline-flex flex-wrap justify-end gap-1.5">
                          {customer.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-foreground">—</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No orders yet for this customer.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 3).map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="text-foreground">{o.number}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(o.date)}</TableCell>
                          <TableCell className="text-foreground">{formatMoney(o.amount, symbol)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              {activity.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded.</p>
              ) : (
                <ol className="relative space-y-6 border-l border-border pl-6">
                  {activity.map((event: ActivityEvent) => {
                    const meta = activityMeta[event.type];
                    const Icon = meta.icon;
                    return (
                      <li key={event.id} className="relative">
                        <span
                          className={`absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full ${meta.className}`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <time
                            className="text-xs text-muted-foreground"
                            title={formatDate(event.date)}
                          >
                            {timeAgo(event.date)}
                          </time>
                        </div>
                        {event.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>All orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No orders yet for this customer.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="text-foreground">{o.number}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(o.date)}</TableCell>
                        <TableCell className="text-foreground">{formatMoney(o.amount, symbol)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              o.status === "Paid"
                                ? "success"
                                : o.status === "Pending" || o.status === "Processing"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {o.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a private note about this customer…"
                aria-label="Internal notes"
                rows={5}
              />
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleSaveNotes}>
                  Save note
                </Button>
                {saved && <span className="text-sm text-success">Note saved</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CustomerFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        customer={customer}
        onSave={(values) => updateCustomer(customer.id, values)}
      />

      <ChangeStatusDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        customers={[customer]}
        onConfirm={(status) => updateCustomer(customer.id, { status })}
      />

      <ConfirmDialog
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title={`Archive ${customer.name}?`}
        description="This customer will be hidden from your audience list. You can restore them anytime."
        confirmLabel="Archive"
        destructive
        onConfirm={() => archiveCustomer(customer.id)}
      />
    </div>
  );
}
