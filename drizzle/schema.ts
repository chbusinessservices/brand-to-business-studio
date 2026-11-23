import { relations } from "drizzle-orm";
import {
  sqliteArray,
  integer,
  text,
  uuid,
  datetime,
} from "drizzle-orm/sqlite-core/types";

export const created_at = datetime("now", { withTimezone: true });
export const updated_at = datetime("now", { withTimezone: true });
export const gen_uuid = () => crypto.randomUUID() as string;

/** Enums for multi-tenant schema */
export const orgRoleEnum = ["owner", "team_member", "contractor", "client_admin", "client_contributor", "client_billing"] as const;
export const trustPillarEnum = ["CODE", "SHIELD", "SIGNAL", "SYSTEM"] as const;
export const itemVisibilityEnum = ["client_review", "owner_prep"] as const;
export const approvalStatusEnum = ["pending", "approved", "changes_requested", "superseded"] as const;

/** Organization & Memberships Tables */
export const organizations = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    is_ch_internal: boolean("is_ch_internal").notNull().default(false),
    created_by: text("created_by").references(() => auth.userId()),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "organizations"
);

export const organizationsRelations = relations(organizations).fn((t) => ({
  _id: t.id,
}));

export const organizationMemberships = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    organization_id: text("organization_id").references(() => organizations.id),
    user_id: text("user_id").references(() => auth.userId()),
    role: text("role").enum(orgRoleEnum).notNull(),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "organization_memberships"
);

export const organizationMembershipsRelations = relations(organizationMemberships)
  .references(() => organizations.id, (t) => t.organization_id)
  .references(() => auth.userId(), (t) => t.user_id);

/** Project Tables */
export const projects = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    organization_id: text("organization_id").references(() => organizations.id),
    name: text("name").notNull(),
    objective: text("objective"),
    scope_summary: text("scope_summary"),
    exclusions: text("exclusions"),
    active_pillars: sqliteArray("active_pillars").enum(trustPillarEnum).array().$index(),
    status: text("status").default("onboarding"),
    billing_url: text("billing_url"),
    handoff_notes: text("handoff_notes"),
    created_by: text("created_by").references(() => auth.userId()),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "projects"
);

export const projectsRelations = relations(projects).fn((t) => ({
  _id: t.id,
}));

export const projectAssignments = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id),
    user_id: text("user_id").references(() => auth.userId()),
    role: text("role").enum(orgRoleEnum).notNull(),
    assigned_by: text("assigned_by").references(() => auth.userId()),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "project_assignments"
);

export const projectAssignmentsRelations = relations(projectAssignments)
  .references(() => projects.id, (t) => t.project_id)
  .references(() => auth.userId(), (t) => t.user_id);

/** Milestones & Tasks Tables */
export const milestones = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id),
    pillar: text("pillar").enum(trustPillarEnum).notNull(),
    visibility: text("visibility").enum(itemVisibilityEnum).default("client_review"),
    title: text("title").notNull(),
    description: text("description"),
    due_date: integer("due_date"),
    status: text("status").default("pending"),
    requires_external_counsel: boolean("requires_external_counsel").notNull().default(false),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "milestones"
);

export const milestonesRelations = relations(milestones)
  .references(() => projects.id, (t) => t.project_id);

export const tasks = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id),
    milestone_id: text("milestone_id").references(() => milestones.id).null(),
    visibility: text("visibility").enum(itemVisibilityEnum).default("owner_prep"),
    title: text("title").notNull(),
    assigned_to: text("assigned_to").references(() => auth.userId()).null(),
    is_client_action: boolean("is_client_action").notNull().default(false),
    due_date: integer("due_date"),
    completed_at: datetime("completed_at").$index(),
    created_at: datetime("created_at").notNull().defaultNow(),
    completed_by: text("completed_by").references(() => auth.userId()).null(),
  },
  "tasks"
);

export const tasksRelations = relations(tasks)
  .references(() => projects.id, (t) => t.project_id)
  .references(() => milestones.id, (t) => t.milestone_id)
  .references(() => auth.userId(), (t) => t.assigned_to)
  .references(() => auth.userId(), (t) => t.completed_by);

/** File Versioning Tables */
export const files = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id),
    pillar: text("pillar").enum(trustPillarEnum).notNull(),
    visibility: text("visibility").enum(itemVisibilityEnum).default("client_review"),
    title: text("title").notNull(),
    current_version_number: integer("current_version_number").notNull().default(1),
    created_by: text("created_by").references(() => auth.userId()).null(),
    created_at: datetime("created_at").notNull().defaultNow(),
    metadata: json("metadata").$typeAny().default("{}"),
  },
  "files"
);

export const filesRelations = relations(files)
  .references(() => projects.id, (t) => t.project_id);

export const fileVersions = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    file_id: text("file_id").references(() => files.id),
    version_number: integer("version_number").notNull(),
    storage_path: text("storage_path").notNull(),
    mime_type: text("mime_type").notNull(),
    size_bytes: integer("size_bytes").notNull(),
    uploaded_by: text("uploaded_by").references(() => auth.userId()).null(),
    created_at: datetime("created_at").notNull().defaultNow(),
    pillar: text("pillar").enum(trustPillarEnum).default("SYSTEM"),
    visibility: text("visibility").enum(itemVisibilityEnum).default("client_review"),
  },
  "file_versions"
);

export const fileVersionsRelations = relations(fileVersions)
  .references(() => files.id, (t) => t.file_id);

/** Approval Workflow Tables */
export const reviewRequests = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id),
    file_version_id: text("file_version_id").references(() => fileVersions.id),
    requested_by: text("requested_by").references(() => auth.userId()).null(),
    status: text("status").enum(approvalStatusEnum).notNull().default("pending"),
    priority: text("priority").notNull().default("normal"),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "review_requests"
);

export const reviewRequestsRelations = relations(reviewRequests)
  .references(() => projects.id, (t) => t.project_id)
  .references(() => fileVersions.id, (t) => t.file_version_id);

export const approvalDecisions = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    review_request_id: text("review_request_id").references(() => reviewRequests.id),
    file_version_id: text("file_version_id").references(() => fileVersions.id),
    decided_by: text("decided_by").references(() => auth.userId()).null(),
    decision: text("decision").enum(approvalStatusEnum).notNull(),
    comments: text("comments"),
    disclaimer_acknowledged: boolean("disclaimer_acknowledged").notNull().default(true),
    version_commented: text("version_commented"),
    decided_at: datetime("decided_at").notNull().defaultNow(),
  },
  "approval_decisions"
);

export const approvalDecisionsRelations = relations(approvalDecisions)
  .references(() => reviewRequests.id, (t) => t.review_request_id)
  .references(() => fileVersions.id, (t) => t.file_version_id)
  .references(() => auth.userId(), (t) => t.decided_by);

/** Internal Notes & Audit Tables */
export const internalNotes = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    project_id: text("project_id").references(() => projects.id).null(),
    author_id: text("author_id").references(() => auth.userId()).notNull(),
    body: text("body").notNull(),
    visibility: text("visibility").notNull(),
    created_at: datetime("created_at").notNull().defaultNow(),
    updated_at: datetime("updated_at").notNull().defaultNow(),
  },
  "internal_notes"
);

export const internalNotesRelations = relations(internalNotes)
  .references(() => projects.id, (t) => t.project_id)
  .references(() => auth.userId(), (t) => t.author_id);

export const auditEvents = createSchemaCt(
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    actor_id: text("actor_id").references(() => auth.userId()).null(),
    organization_id: text("organization_id").references(() => organizations.id).null(),
    project_id: text("project_id").references(() => projects.id).null(),
    action: text("action").notNull(),
    target_table: text("target_table").notNull(),
    target_id: text("target_id").null(),
    metadata: json("metadata").$typeAny().default("{}"),
    created_at: datetime("created_at").notNull().defaultNow(),
  },
  "audit_events"
);

export const auditEventsRelations = relations(auditEvents)
  .references(() => organizations.id, (t) => t.organization_id).optional()
  .references(() => projects.id, (t) => t.project_id).optional()
  .references(() => auth.userId(), (t) => t.actor_id);

/** Helper Functions & Triggers */
export const helperFunctions = createSchemaCt(
  {
    name: text("name").unique(),
    schema: text("schema").default("public"),
    sourceCode: blob("sourceCode").notNull(),
  },
  "public_functions"
);

/** Table Relations Summary */
export function getRelations() {
  return {
    organizations, organizationMemberships, projects, projectAssignments,
    milestones, tasks, files, fileVersions, reviewRequests, approvalDecisions,
    internalNotes, auditEvents
  };
}
