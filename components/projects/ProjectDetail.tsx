import { Page } from "@/components/basic";

import ProjectDetailContent, { type ProjectDocument } from "./ProjectDetailContent";

export default function ProjectDetail({ project }: { project: ProjectDocument }) {
  return (
    <Page>
      <ProjectDetailContent project={project} />
    </Page>
  );
}