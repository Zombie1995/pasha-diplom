import { graphCreatorStore } from "entities/graph-creator/model";
import { observer } from "mobx-react-lite";
import { Loading } from "shared/ui/loading";
import NetworkVisualizationReddit, {
  CommentReddit,
} from "shared/ui/network-visualization-reddit/ui";
import NetworkVisualization, {
  Comment,
} from "shared/ui/network-visualization/ui";

export const GraphCreator = observer(() => {
  const models = ["russian_news", "toxicity", "lenta_news"];
  const socials = ["vk", "reddit"];

  return (
    <div className="flex gap-6 bg-white p-10 outline outline-[#949cb8] rounded-[20px]">
      <div className="outline outline-blue-500 size-[600px] rounded-md">
        {graphCreatorStore.loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading className="size-[48px]" color="#000000" />
          </div>
        ) : graphCreatorStore.social === "vk" ? (
          <NetworkVisualization
            comments={graphCreatorStore.comments as Comment[]}
            width={600}
            height={600}
          />
        ) : (
          <NetworkVisualizationReddit
            comments={graphCreatorStore.comments as CommentReddit[]}
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
        <div className="flex flex-col divide-y-[2px] gap-2">
          <div className="flex gap-2">
            {socials.map((social, index) => {
              return (
                <div key={index} className="flex">
                  <input
                    type="radio"
                    id={`social${index + 1}`}
                    name="social"
                    checked={graphCreatorStore.social === social}
                    onChange={() => graphCreatorStore.setSocial(social)}
                  />
                  <div className="w-2" />
                  <label className="-translate-y-[1px]">{social}</label>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {models.map((model, index) => (
              <div key={index} className="flex">
                <input
                  type="radio"
                  id={`model${index + 1}`}
                  name="model"
                  checked={graphCreatorStore.model === model}
                  onChange={() => graphCreatorStore.setModel(model)}
                />
                <div className="w-2" />
                <label className="-translate-y-[1px]">{model}</label>
              </div>
            ))}
          </div>
        </div>
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
