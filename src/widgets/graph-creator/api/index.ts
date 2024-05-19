import $api from "shared/api/config";

export const getGraph = async (data: string, type_of_model: string) => {
  const regex = /wall-(\d+)_(\d+)/;
  const match = data.match(regex);

  if (!match) return;

  const owner_id = -parseInt(match[1]);
  const post_id = parseInt(match[2]);
  return (await $api.post(`/get_graph/${owner_id}/${post_id}/${type_of_model}`))
    .data;
};
