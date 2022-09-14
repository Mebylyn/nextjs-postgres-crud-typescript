import { Layout } from "src/components/Layout";
import { Card, Form, Grid, Button, Icon, Confirm } from "semantic-ui-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Task } from "src/interfaces/Tasks";

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
  const [task, setTask] = useState<Task>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();

  const createTask = async (task: Task) =>
    await fetch("http://127.0.0.1:9000/assets/", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const updateTask = async (id: string, task: Task) =>
    await fetch("http://127.0.0.1:9000/assets/" + id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (typeof router.query.id === "string") {
        updateTask(router.query.id, task);
      } else {
        createTask(task);
      }
      setTask(inititalState);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setTask({ ...task, [name]: value });

  const loadTask = async (id: string) => {
    const res = await fetch("http://127.0.0.1:9000/assets/" + id);
    const task = await res.json();
    setTask({ 
              assetName: task.assetName,
              assetCategory: task.assetCategory,
              assetDetails: task.assetDetails,
              assetQuantity: task.assetQuantity,
              assetPrice: task.assetPrice,
              assetTotal: task.assetTotal });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("http://127.0.0.1:9000/assets/" + id, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof router.query.id === "string") loadTask(router.query.id);
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
                    value={task.assetName}
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
                    value={task.assetCategory}
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
                    value={task.assetDetails}
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
                    value={task.assetQuantity}
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
                    value={task.assetPrice}
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
                    value={task.assetTotal}
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
        header="Delete a Task"
        content={`Are you sure you want to delete task ${router.query.id}`}
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
