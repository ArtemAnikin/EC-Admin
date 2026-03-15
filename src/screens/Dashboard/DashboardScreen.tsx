import { Container, Title, Text } from '@mantine/core';

export function DashboardScreen() {
  return (
    <Container size="lg" py="xl">
      <Title order={1}>Dashboard</Title>
      <Text c="dimmed" mt="md">
        Welcome to the Easy Cars Admin Panel.
      </Text>
    </Container>
  );
}
