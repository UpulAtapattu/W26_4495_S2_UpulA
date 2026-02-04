import { NavigationContainer } from "@react-navigation/native";
// import { useAuth } from "@/hooks/useAuth";
import AuthNavigator from "../navigation/AuthNavigator";
import AdminNavigator from "../navigation/AdminNavigator";
import CleanerNavigator from "../navigation/CleanerNavigation";
import CustomerNavigator from "../navigation/CustomerNavigation";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function RootNavigator() {
  const c = useAuth();
  console.log("console.log");
  const loading = false;
  const user = {
    role: "ADMIN",
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return <CleanerNavigator />;
}
