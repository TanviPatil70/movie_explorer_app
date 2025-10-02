import GenreClient from "./GenreClient";

export default function GenrePage({ params }: { params: { name: string } }) {
  return <GenreClient genreName={params.name} />;
}
