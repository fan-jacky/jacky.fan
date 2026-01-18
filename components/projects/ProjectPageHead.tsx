import FadeInBottom from "../animation/FadeInBottom";
import { Heading } from "../visual";
import { getRichTextBlocks } from "@/helpers/strapi/getRichTextBlocks";

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL;

const richText = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value.root?.children) return value.root.children;
  return [];
};

async function getData() {
  if (!PAYLOAD_CMS_URL) {
    return { data: null } as any;
  }

  const res = await fetch(
    `${PAYLOAD_CMS_URL}/api/globals/project_page_settings?depth=2`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}

export default async function ProjectPageHead() {
  const data = await getData();

  if (!data) return null;

  const descBlocks = richText(data?.desc).map((block: any, index: number) =>
    getRichTextBlocks(block, {
      className: "text-md md:text-xl mb-4 md:mb-8 leading-8",
    }, index)
  );

  return (
    <FadeInBottom>
      <Heading
        topTitle={data?.topTitle}
        leftTitle={data?.leftTitle}
        rightTitle={data?.rightTitle}
        colorReverse={true}
      />

      { descBlocks }
    </FadeInBottom>
  );
}
