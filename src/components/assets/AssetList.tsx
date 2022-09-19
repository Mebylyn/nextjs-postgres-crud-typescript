import { useRouter } from "next/router";
import { Card } from "semantic-ui-react";
import { Asset } from "src/interfaces/Assets";
import { Button } from "semantic-ui-react";

interface Props {
  assets: Asset[];
}

export const AssetList = ({ assets = [] }: Props) => {
  const router = useRouter();

  return (
    <table className="ui striped table">
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      {assets.map((asset) => (
      <tbody onClick={() => router.push(`/assets/edit/${asset.id}`)}
              key={asset.id}>
        <tr>
          <td>{asset.assetName}</td>
          <td>{asset.assetCategory}</td>
          <td>{asset.assetQuantity}</td>
          <td>{asset.assetPrice}</td>
          <td>{asset.assetTotal}</td>
        </tr>
      </tbody>
      ))}
    </table>
  );
};
