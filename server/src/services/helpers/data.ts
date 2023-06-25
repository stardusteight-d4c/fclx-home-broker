export const pipeline = (wallet_id: string) => [
  {
    $match: {
      $or: [{ operationType: "insert" }, { operationType: "update" }],
      "fullDocument.wallet_id": wallet_id,
    },
  },
];

export const options = {
  fullDocument: "updateLookup",
};