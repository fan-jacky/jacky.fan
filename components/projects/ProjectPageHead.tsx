import FadeInBottom from "../animation/FadeInBottom";
import { fetchPayloadJson, getPayloadCmsUrl } from "@/helpers/payloadcms/api";

async function getData() {
  if (!getPayloadCmsUrl()) {
    return { data: null } as any;
  }

  return fetchPayloadJson('globals/project_page_settings?depth=2');
}

export default async function ProjectPageHead() {
  const data = await getData();

  if (!data) return null;

  return (
    <FadeInBottom extraClassName={data?.topPadding ? 'pt-24 md:pt-36' : ''}>
      {data?.label ? <span className="slide-label">{data.label}</span> : null}
      {data?.title ? <h1 className="slide-headline">{data.title}</h1> : null}
      {data?.subtitle ? (
        <p className="slide-subtitle" style={{ marginBottom: '3rem' }}>
          {data.subtitle}
        </p>
      ) : null}
    </FadeInBottom>
  );
}
