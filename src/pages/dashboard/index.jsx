import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Flex,
  Group,
  UnstyledButton,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ExtractionCard from "../../compnents/Cards/ExtractionCard";
import PrescriptionHistory from "../../compnents/Cards/PrescriptionHistory";
import ManualEntry from "../../compnents/Cards/ManualEntry";
export default function Index() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth"); 
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="xs">
        <Flex align="center" justify="space-between">
          <ActionIcon
            variant="gradient"
            size="xl"
            aria-label="Gradient action icon"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            <IconHeart />
          </ActionIcon>

          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            size="sm"
            style={{ marginLeft: 10 }}
            onClick={() => {
              supabase.auth.signOut();
              router.push("/auth");
            }}
          >
            Logout
          </Button>

        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Flex wrap="wrap" style={{ height: "100%" }}>
          <Card shadow="sm" padding="lg" style={{ width: 800 }}>
           <ExtractionCard/>
          </Card>
          <Card shadow="sm" padding="lg" style={{ width: 800 }}>
           <ManualEntry/>
          </Card>
          <Card shadow="sm" padding="lg" style={{ width: 800 }}>
           <PrescriptionHistory/>
          </Card>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}
