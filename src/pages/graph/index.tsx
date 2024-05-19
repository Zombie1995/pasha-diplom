import { GraphCreator } from "widgets/graph-creator";

export default function Graph() {
  return (
    <div className="h-[100svh] flex flex-col items-center justify-center">
      <div className="-translate-y-5">
        <GraphCreator />
      </div>
    </div>
  );
}
