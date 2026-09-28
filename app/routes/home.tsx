import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "LamiTrack" },
  {
    name: "description",
    content: "Vitrine de eventos de tecnologia e inovação da LAMIT.",
  },
];

export default function Home() {
  return (
    <main>
      <h1>LamiTrack</h1>
    </main>
  );
}
