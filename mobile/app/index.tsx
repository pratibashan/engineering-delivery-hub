import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProjects, Project } from "../src/api/projects";
import { useAuth } from "../src/auth/AuthContext";

export default function ProjectsScreen() {
  const { signOut } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProjects();

        setProjects(data);
      } catch (err) {
        console.error("PROJECT LOAD FAILED:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load projects.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Engineering Delivery Hub</Text>

            <Text style={styles.subtitle}>
              Track project health, progress, blockers, and delivery risk.
            </Text>
          </View>

          <Pressable style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>

        {isLoading && (
          <View style={styles.messageContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.messageText}>Loading projects...</Text>
          </View>
        )}

        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No projects found.</Text>
          </View>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <View style={styles.list}>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/projects/[id]",
                    params: {
                      id: project.id,
                    },
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>

                  <Text style={styles.status}>{project.status}</Text>
                </View>

                <Text style={styles.label}>Progress</Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${project.progress}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressText}>{project.progress}%</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },

  headerText: {
    flex: 1,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
  },

  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },

  signOutText: {
    fontSize: 14,
    fontWeight: "600",
  },

  messageContainer: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },

  messageText: {
    fontSize: 16,
  },

  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
  },

  list: {
    marginTop: 24,
    gap: 16,
  },

  card: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#ffffff",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  projectName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
  },

  label: {
    marginTop: 20,
    fontSize: 13,
  },

  progressTrack: {
    height: 8,
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#06b6d4",
  },

  progressText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "right",
  },
});
