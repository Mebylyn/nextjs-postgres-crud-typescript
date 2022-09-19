import { GetServerSideProps } from "next";
import { Button, Grid } from "semantic-ui-react";
import { Layout } from "src/components/Layout";
import { BiTaskX } from "react-icons/bi";
import { AssetList } from "src/components/assets/AssetList";
import { useRouter } from "next/router";
import { Asset } from "src/interfaces/Assets";

interface Props {
  assets: Asset[];
}

const Home = ({ assets }: Props) => {
  const { push } = useRouter();

  return (
    <Layout>
      {assets.length === 0 ? (
        <Grid
          columns={3}
          centered
          verticalAlign="middle"
          style={{ height: "70%" }}
        >
          <Grid.Row>
            <Grid.Column>
              <div style={{ color: "#eee", textAlign: "center" }}>
                <BiTaskX size="15rem" />
                <h1>No tasks yet</h1>
                <Button onClick={() => push("/assets/new")}>Create one</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <AssetList assets={assets} />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("https://assetapirubianes.azurewebsites.net/assets/");
  const assets = await res.json();

  return {
    props: { assets },
  };
};

export default Home;
