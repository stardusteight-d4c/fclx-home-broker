export const getInsertAndUpdatePipeline = (wallet_id: string) => [
  {
    $match: {
      $or: [{ operationType: "insert" }, { operationType: "update" }],
      "fullDocument.wallet_id": wallet_id,
    },
  },
];

export const getUpdatePipeline = (wallet_id: string) => [
  {
    $match: {
      operationType: "update",
      "fullDocument.wallet_id": wallet_id,
    },
  },
];

export const updatePipeline = [
  {
    $match: {
      operationType: "update",
    },
  },
];

export const getInsertPipeline = (asset_id: string) => [
  {
    $match: {
      operationType: "insert",
      "fullDocument.asset_id": asset_id,
    },
  },
];

export const fullDocumentUpdateLookup = {
  fullDocument: "updateLookup",
};
