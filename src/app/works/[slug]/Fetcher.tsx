import { fetchPageBySlug, fetchRecordsByPageId } from "@/utils/notion";
import { notFound } from "next/navigation";
import Renderer from "./Renderer";

const Fetcher: React.FC<{
  slug: string;
}> = async ({ slug }) => {
  const page = await fetchPageBySlug(slug);

  if (!page) notFound();

  const data = await fetchRecordsByPageId(page.id);

  return <Renderer data={data} />;
};

export default Fetcher;
