import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getProjectById,
  Project,
  getProjectSummary,
} from "../../src/api/projects";

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function handleGenerateInsight() {
    if (!id) {
      return;
    }

    try {
      setIsGeneratingInsight(true);
      setAiError(null);

      const summary = await getProjectSummary(id);

      setAiInsight(summary);
    } catch (err) {
      console.error("AI INSIGHT FAILED:", err);

      setAiError(
        err instanceof Error ? err.message : "Unable to generate AI insight.",
      );
    } finally {
      setIsGeneratingInsight(false);
    }
  }
  function cleanMarkdown(text: string): string {
    return text
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^---+$/gm, "")
      .replace(/^\s*-\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  useEffect(() => {
    async function loadProject() {
      if (!id) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await getProjectById(id);

        setProject(data);
      } catch (err) {
        console.error("PROJECT DETAILS LOAD FAILED:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project details.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.message}>Loading project...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.message}>Project not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{project.name}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{project.status}</Text>
        </View>

        <View style={styles.section}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>

          <Text style={styles.value}>
            {project.description || "No description available."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Blockers</Text>
          {Array.isArray(project.blockers) ? (
            project.blockers.length > 0 ? (
              project.blockers.map((blocker, index) => (
                <Text key={`${blocker}-${index}`} style={styles.blocker}>
                  • {blocker}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>No blockers.</Text>
            )
          ) : project.blockers ? (
            <Text style={styles.value}>{project.blockers}</Text>
          ) : (
            <Text style={styles.value}>No blockers.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Project ID</Text>
          <Text style={styles.projectId}>{project.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>AI Delivery Insight</Text>

          <Pressable
            style={[
              styles.aiButton,
              isGeneratingInsight && styles.aiButtonDisabled,
            ]}
            onPress={handleGenerateInsight}
            disabled={isGeneratingInsight}
          >
            {isGeneratingInsight ? (
              <View style={styles.aiButtonContent}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.aiButtonText}>Generating...</Text>
              </View>
            ) : (
              <Text style={styles.aiButtonText}>Generate AI Insight</Text>
            )}
          </Pressable>

          {aiError && <Text style={styles.aiErrorText}>{aiError}</Text>}

          {aiInsight && (
            <View style={styles.aiInsightCard}>
              <Text style={styles.aiInsightText}>
                {cleanMarkdown(aiInsight)}
              </Text>
            </View>
          )}
        </View>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  section: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  value: {
    fontSize: 16,
    lineHeight: 24,
  },

  progressTrack: {
    height: 10,
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
    fontSize: 14,
    textAlign: "right",
  },

  blocker: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },

  projectId: {
    fontSize: 13,
  },

  message: {
    fontSize: 16,
  },

  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
  },
  aiButton: {
    marginTop: 4,
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
  },

  aiButtonDisabled: {
    opacity: 0.6,
  },

  aiButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  aiButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  aiInsightCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },

  aiInsightText: {
    fontSize: 16,
    lineHeight: 24,
  },

  aiErrorText: {
    marginTop: 12,
    color: "#dc2626",
    fontSize: 14,
  },
});
