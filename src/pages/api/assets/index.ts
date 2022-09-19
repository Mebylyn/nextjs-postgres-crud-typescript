import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const query = "SELECT * FROM assets";
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { assetName,
                assetCategory,
                assetDetails,
                assetQuantity,
                assetPrice,
                assetTotal } = body;

        const query =
          "INSERT INTO assets(assetName, assetCategory, assetDetails, assetQuantity, assetPrice, assetTotal) VALUES ($1, $2) RETURNING *";
        const values = [assetName,
                        assetCategory,
                        assetDetails,
                        assetQuantity,
                        assetPrice,
                        assetTotal];

        const response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: "Method are not supported" });
  }
}
