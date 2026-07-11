import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/db";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { WorkspaceNav } from "@/components/WorkspaceNav";
import { RecordDialog, btnGhost } from "@/components/RecordDialog";
import { UserMenu } from "@/components/UserMenu";
import { projectFields } from "@/components/fields";
import { createProject } from "@/app/actions";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [projects, project, user] = await Promise.all([
    getProjects(),
    getProject(projectId),
    getUser(),
  ]);

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
              PM
            </span>
            <span className="hidden sm:inline">PM Tracker</span>
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <ProjectSwitcher
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            currentId={project.id}
          />
          <div className="ml-auto flex items-center gap-2">
            {!user && (
              <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 sm:inline dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
                Demo · no login
              </span>
            )}
            <RecordDialog
              action={createProject}
              fields={projectFields()}
              hidden={{}}
              title="New project"
              triggerLabel="+ New project"
              triggerClassName={btnGhost}
              submitLabel="Create project"
            />
            <UserMenu email={user?.email ?? null} />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <WorkspaceNav projectId={project.id} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-neutral-400 sm:px-6">
        PM Tracker — a demo project management workspace. All data is public for demonstration.
      </footer>
    </div>
  );
}
