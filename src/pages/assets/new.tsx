import { Layout } from "src/components/Layout";
import { Card, Form, Grid, Button, Icon, Confirm } from "semantic-ui-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Asset } from "src/interfaces/Assets";

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const inititalState = {
  assetName: "",
  assetCategory: "",
  assetDetails: "",
  assetQuantity: "",
  assetPrice: "",
  assetTotal: "",
};

const NewPage = (): JSX.Element => {
  const [asset, setAsset] = useState<Asset>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();

  const createAsset = async (asset: Asset) =>
    await fetch("https://assetapirubianes.azurewebsites.net/assets/", {
      method: "POST",
      body: JSON.stringify(asset),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const updateAsset = async (id: string, asset: Asset) =>
    await fetch("https://assetapirubianes.azurewebsites.net/assets/" + id, {
      method: "PUT",
      body: JSON.stringify(asset),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (typeof router.query.id === "string") {
        updateAsset(router.query.id, asset);
      } else {
        createAsset(asset);
      }
      setAsset(inititalState);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setAsset({ ...asset, [name]: value });

  const loadAsset = async (id: string) => {
    const res = await fetch("https://assetapirubianes.azurewebsites.net/assets/" + id);
    const asset = await res.json();
    setAsset({ 
              assetName: asset.assetName,
              assetCategory: asset.assetCategory,
              assetDetails: asset.assetDetails,
              assetQuantity: asset.assetQuantity,
              assetPrice: asset.assetPrice,
              assetTotal: asset.assetTotal });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("https://assetapirubianes.azurewebsites.net/assets/" + id, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof router.query.id === "string") loadAsset(router.query.id);
  }, [router.query]);

  return (
    <Layout>
      <Grid
        centered
        columns={3}
        verticalAlign="middle"
        style={{ height: "70%" }}
      >
        <Grid.Column>
          <Card>
            <Card.Content>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label htmlFor="assetname">Asset Name</label>
                  <input
                    type="text"
                    placeholder="Write Asset Name"
                    name="assetName"
                    onChange={handleChange}
                    value={asset.assetName}
                    autoFocus
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="description">Category</label>
                  <textarea
                    name="assetCategory"
                    id="description"
                    rows={2}
                    placeholder="Write a Description"
                    onChange={handleChange}
                    value={asset.assetCategory}
                  ></textarea>
                </Form.Field>
                <Form.Field>
                  <label htmlFor="assetdetails">Details</label>
                  <textarea
                    name="assetDetails"
                    id="assetdetails"
                    rows={3}
                    placeholder="Write a Details"
                    onChange={handleChange}
                    value={asset.assetDetails}
                  ></textarea>
                </Form.Field>
                <Form.Field>
                  <label htmlFor="assetquantity">Quantity</label>
                  <textarea
                    name="assetQuantity"
                    id="assetquantity"
                    rows={4}
                    placeholder="Write a Quantity"
                    onChange={handleChange}
                    value={asset.assetQuantity}
                  ></textarea>
                </Form.Field>
                <Form.Field>
                  <label htmlFor="assetprice">Price</label>
                  <textarea
                    name="assetPrice"
                    id="assetprice"
                    rows={5}
                    placeholder="Write a Price"
                    onChange={handleChange}
                    value={asset.assetPrice}
                  ></textarea>
                </Form.Field>
                <Form.Field>
                  <label htmlFor="assettotal">Total</label>
                  <textarea
                    name="assetTotal"
                    id="assettotal"
                    rows={6}
                    placeholder="Write a Total"
                    onChange={handleChange}
                    value={asset.assetTotal}
                  ></textarea>
                </Form.Field>
                {router.query.id ? (
                  <Button color="teal" loading={loading}>
                    <Icon name="save" />
                    Update
                  </Button>
                ) : (
                  <Button primary loading={loading}>
                    <Icon name="save" />
                    Save
                  </Button>
                )}
              </Form>
            </Card.Content>
          </Card>

          {router.query.id && (
            <Button inverted color="red" onClick={() => setOpenConfirm(true)}>
              <Icon name="trash" />
              Delete
            </Button>
          )}
        </Grid.Column>
      </Grid>

      <Confirm
        header="Delete an Asset"
        content={`Are you sure you want to delete asset ${router.query.id}`}
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() =>
          typeof router.query.id === "string" && handleDelete(router.query.id)
        }
      />
    </Layout>
  );
};

export default NewPage;
