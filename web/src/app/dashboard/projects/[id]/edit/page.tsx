import EditProjectForm from "@/components/projects/EditProjectForm";
import { getProjectById } from "@/lib/projects.server";
type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const project = await getProjectById(id);

  return <EditProjectForm project={project} />;
}
