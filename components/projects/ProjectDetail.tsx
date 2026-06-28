import { Page } from "@/components/basic";
import PortfolioEnhancements from "@/components/portfolio/PortfolioEnhancements";

import ProjectDetailContent, { type ProjectDocument } from "./ProjectDetailContent";

export default function ProjectDetail({ project }: { project: ProjectDocument }) {
  return (
    <Page reserveNavbarHeight={false}>
      <PortfolioEnhancements />
      <ProjectDetailContent project={project} />
    </Page>
  );
}