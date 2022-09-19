import { useRouter } from "next/router";
import { Card } from "semantic-ui-react";
import { Asset } from "src/interfaces/Assets";

interface Props {
  assets: Asset[];
}

export const AssetList = ({ assets = [] }: Props) => {
  const router = useRouter();

  return (
    <Card.Group itemsPerRow={4}>
      {assets.map((asset) => (
        <Card
          onClick={() => router.push(`/assets/edit/${asset.id}`)}
          key={asset.id}
        >
          <Card.Content>
            <Card.Header>{asset.assetName}</Card.Header>
            {asset.created_on && (
              <Card.Meta>
                {new Date(asset.created_on).toLocaleDateString()}
              </Card.Meta>
            )}
            <Card.Description>{asset.assetCategory}</Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};
