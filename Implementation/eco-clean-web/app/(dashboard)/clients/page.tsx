import ClientsTable from "@/app/components/tables/ClientTable";
import { Card, Container} from "@mantine/core";

const page = () => {
  return (
    <Container py="lg" fluid>
      <Card bg="white" p="md" withBorder>
        <ClientsTable />
      </Card>
    </Container>
  );
};

export default page;
