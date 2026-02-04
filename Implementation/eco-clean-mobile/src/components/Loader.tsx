import { colors } from "@/theme";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type LoaderProps = {
  size?: "small" | "large";
  fullscreen?: boolean;
};

export function Loader({ size = "large", fullscreen = false }: LoaderProps) {
  if (fullscreen) {
    return (
      <View style={styles.fullscreen}>
        <ActivityIndicator size={size} color={colors.primary} />
      </View>
    );
  }

  return <ActivityIndicator size={size} />;
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
