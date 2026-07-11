import { redirect } from "next/navigation";
import { getProjects } from "@/lib/db";
import { RecordDialog } from "@/components/RecordDialog";
import { projectFields } from "@/components/fields";
import { createProject } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  let projects;
  try {
    projects = await getProjects();
  } catch {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-2xl font-semibold">Can’t reach the database</h1>
        <p className="text-neutral-500">
          The app couldn’t load projects. Check that the Supabase migration has been applied and
          that the environment variables are set, then refresh.
        </p>
      </main>
    );
  }

  if (projects.length > 0) {
    redirect(`/p/${projects[0].id}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="text-4xl">📋</div>
      <h1 className="text-3xl font-bold tracking-tight">PM Tracker</h1>
      <p className="text-neutral-500">
        No projects yet. Create your first project to start tracking tasks, deliverables, risks,
        and issues.
      </p>
      <RecordDialog
        action={createProject}
        fields={projectFields()}
        hidden={{}}
        title="New project"
        triggerLabel="+ Create project"
        submitLabel="Create project"
      />
    </main>
  );
}
