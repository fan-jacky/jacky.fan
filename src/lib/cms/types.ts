export type ProjectMedia = {
  url?: string | null;
  thumbnailURL?: string | null;
};

export type ProjectGridItem = {
  alias?: string;
  cardStyle?: 'blog' | 'portfolio' | 'terminal' | 'code';
  date?: string;
  desc?: string;
  img?: string | ProjectMedia | null;
  tags?: string[];
  title?: string;
};

export type PageDocument = {
  id?: string;
  pageTitle?: string | null;
  metaDesc?: string | null;
  enableBgHeading?: boolean | null;
  url?: string | null;
  updatedAt?: string | null;
  contents?: any[] | null;
};

export type PageMeta = {
  title: string;
  description: string;
  ogImage?: string;
};

export type ProjectLink = {
  name?: string | null;
  links?: string | null;
};

export type ProjectDocument = {
  slug?: string | null;
  alias?: string | null;
  title?: string | null;
  desc?: string | null;
  tags?: string[] | null;
  img?: string | ProjectMedia | null;
  cardStyle?: string | null;
  links?: ProjectLink[] | null;
  contents?: any[] | null;
};
