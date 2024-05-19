import { graphCreatorStore } from "entities/graph-creator/model";
import { observer } from "mobx-react-lite";
import { Loading } from "shared/ui/loading";
import NetworkVisualization from "shared/ui/network-visualization/ui";

export const GraphCreator = observer(() => {
  const models = ["russian_news", "toxicity", "lenta_news"];

  return (
    <div className="flex gap-6 bg-white p-10 outline outline-[#949cb8] rounded-[20px]">
      <div className="outline outline-blue-500 size-[600px] rounded-md">
        {graphCreatorStore.loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading className="size-[48px]" color="#000000" />
          </div>
        ) : (
          <NetworkVisualization
            comments={graphCreatorStore.comments}
            width={600}
            height={600}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 min-w-[200px]">
        <textarea
          className="outline outline-blue-500 rounded-sm"
          value={graphCreatorStore.link}
          onChange={(e) => graphCreatorStore.setLink(e.target.value)}
        />
        {models.map((model, index) => (
          <div key={index} className="flex">
            <input
              type="radio"
              id={`checkbox${index + 1}`}
              name="checkbox"
              checked={graphCreatorStore.model === model}
              onChange={() => graphCreatorStore.setModel(model)}
            />
            <div className="w-2" />
            <label className="-translate-y-[1px]">{model}</label>
          </div>
        ))}
        <button
          className="outline rounded-sm bg-blue-500 text-white min-h-10"
          onClick={async () => {
            graphCreatorStore.loadComments();
          }}
        >
          Создать граф
        </button>
      </div>
    </div>
  );
});
