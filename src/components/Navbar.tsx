import { Container, Menu, Button } from "semantic-ui-react";
import Image from "next/image";
import { useRouter } from "next/router";

export const Navbar = () => {
  const router = useRouter();

  return (
    <Menu inverted attached>
      <Container>
        <Menu.Item onClick={() => router.push("/")}>
          <Image
            width="50"
            height="50"
            src="/logo.png"
            alt="nextjs logo"
          />
          <h1> IT Asset Management </h1>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Button onClick={() => router.push("/tasks/new")} primary>
              Add New Asset
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
