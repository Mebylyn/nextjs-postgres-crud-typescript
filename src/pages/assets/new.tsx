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
    await fetch("https://githubactionsnextjsapi.azurewebsites.net/assets/", {
      method: "POST",
      body: JSON.stringify(asset),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const updateAsset = async (id: string, asset: Asset) =>
    await fetch("https://githubactionsnextjsapi.azurewebsites.net/assets/" + id, {
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
    const res = await fetch("https://githubactionsnextjsapi.azurewebsites.net/assets/" + id);
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
      const res = await fetch("https://githubactionsnextjsapi.azurewebsites.net/assets/" + id, {
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
      <Grid>
        <Grid.Column>
        <form onSubmit={handleSubmit} className="ui form">
          <h4 className="ui dividing header">Asset</h4>
          <div className="two fields">
            <div className="field">
            <label>Asset Name</label>
              <input type="text" name="assetName" placeholder="Input Asset Name" onChange={handleChange} value={asset.assetName}/>
            </div>
            <div className="field">
            <label>Category</label>
              <input type="text" name="assetCategory" placeholder="Category" onChange={handleChange} value={asset.assetCategory}/>
            </div>
          </div>

          <div className="field">
            <label>Details</label>
            <textarea name="assetDetails" onChange={handleChange} value={asset.assetDetails} />
          </div>

          <div className="fields">
            <div className="six wide field">
              <label>Quantity</label>
              <input type="text" name="assetQuantity" placeholder="Input Quantity" onChange={handleChange} value={asset.assetQuantity}/>
            </div>
            <div className="six wide field">
              <label>Price</label>
              <input type="text" name="assetPrice" placeholder="Input Price" onChange={handleChange} value={asset.assetPrice}/>
            </div>

            <div className="six wide field">
              <label>Total</label>
              <input type="text" name="assetTotal" placeholder="Input Total" onChange={handleChange} value={asset.assetTotal}/>
            </div>
          </div>
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
                        
        </form>

                      {router.query.id && (
                        <Button inverted color="red" onClick={() => setOpenConfirm(true)}>
                          <Icon name="trash" />
                          Delete
                        </Button>
                      )}

                      <Confirm
                        header="Delete an Asset"
                        content={`Are you sure you want to delete asset ${router.query.id}`}
                        open={openConfirm}
                        onCancel={() => setOpenConfirm(false)}
                        onConfirm={() =>
                          typeof router.query.id === "string" && handleDelete(router.query.id)
                        }
                      />
                      </Grid.Column>
                  </Grid>
        
    </Layout>
  );
};

export default NewPage;
