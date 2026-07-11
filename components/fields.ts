import type { FieldDef } from "@/components/RecordDialog";
import type { Owner } from "@/lib/types";

function ownerOptions(owners: Owner[]) {
  return [
    { value: "", label: "— Unassigned —" },
    ...owners.map((o) => ({ value: o.id, label: o.role ? `${o.name} (${o.role})` : o.name })),
  ];
}

const TASK_STATUS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

const PRIORITY = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const LEVEL = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

type V = Record<string, string | null | undefined>;

export function taskFields(owners: Owner[], v: V = {}): FieldDef[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, full: true, defaultValue: v.title, placeholder: "e.g. Finalize API integration spec" },
    { name: "description", label: "Description", type: "textarea", full: true, defaultValue: v.description },
    { name: "status", label: "Status", type: "select", options: TASK_STATUS, defaultValue: v.status },
    { name: "priority", label: "Priority", type: "select", options: PRIORITY, defaultValue: v.priority ?? "medium" },
    { name: "owner_id", label: "Owner", type: "select", options: ownerOptions(owners), defaultValue: v.owner_id },
    { name: "due_date", label: "Due date", type: "date", defaultValue: v.due_date },
  ];
}

export function deliverableFields(owners: Owner[], v: V = {}): FieldDef[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, full: true, defaultValue: v.title, placeholder: "e.g. CRM Data Migration Script" },
    { name: "description", label: "Description", type: "textarea", full: true, defaultValue: v.description },
    { name: "status", label: "Status", type: "select", options: TASK_STATUS, defaultValue: v.status },
    { name: "owner_id", label: "Owner", type: "select", options: ownerOptions(owners), defaultValue: v.owner_id },
    { name: "due_date", label: "Due date", type: "date", defaultValue: v.due_date, full: true },
  ];
}

export function riskFields(owners: Owner[], v: V = {}): FieldDef[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, full: true, defaultValue: v.title, placeholder: "e.g. Third-party API deprecation" },
    { name: "description", label: "Description", type: "textarea", full: true, defaultValue: v.description },
    { name: "likelihood", label: "Likelihood", type: "select", options: LEVEL, defaultValue: v.likelihood ?? "medium" },
    { name: "impact", label: "Impact", type: "select", options: LEVEL, defaultValue: v.impact ?? "medium" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "mitigated", label: "Mitigated" },
        { value: "closed", label: "Closed" },
      ],
      defaultValue: v.status,
    },
    { name: "owner_id", label: "Owner", type: "select", options: ownerOptions(owners), defaultValue: v.owner_id },
    { name: "mitigation", label: "Mitigation", type: "textarea", full: true, defaultValue: v.mitigation, placeholder: "How will this risk be handled?" },
  ];
}

export function issueFields(owners: Owner[], v: V = {}): FieldDef[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, full: true, defaultValue: v.title, placeholder: "e.g. Dev environment mismatch" },
    { name: "description", label: "Description", type: "textarea", full: true, defaultValue: v.description },
    { name: "severity", label: "Severity", type: "select", options: LEVEL, defaultValue: v.severity ?? "medium" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "resolved", label: "Resolved" },
      ],
      defaultValue: v.status,
    },
    { name: "owner_id", label: "Owner", type: "select", options: ownerOptions(owners), defaultValue: v.owner_id },
    { name: "resolution", label: "Resolution", type: "textarea", full: true, defaultValue: v.resolution, placeholder: "How was it resolved?" },
  ];
}

export function ownerFields(v: V = {}): FieldDef[] {
  return [
    { name: "name", label: "Name", type: "text", required: true, full: true, defaultValue: v.name },
    { name: "role", label: "Role", type: "text", defaultValue: v.role, placeholder: "e.g. Tech Lead" },
    { name: "email", label: "Email", type: "email", defaultValue: v.email },
  ];
}

export function projectFields(v: V = {}): FieldDef[] {
  return [
    { name: "name", label: "Project name", type: "text", required: true, full: true, defaultValue: v.name },
    { name: "description", label: "Description", type: "textarea", full: true, defaultValue: v.description },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "on_hold", label: "On Hold" },
        { value: "completed", label: "Completed" },
      ],
      defaultValue: v.status,
    },
    { name: "start_date", label: "Start date", type: "date", defaultValue: v.start_date },
    { name: "end_date", label: "End date", type: "date", defaultValue: v.end_date },
  ];
}
