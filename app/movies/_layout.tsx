import { useMemo } from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Layout, useUserStore } from "@/features/movies";

export default function MoviesLayout() {
  const theme = useUserStore((state) => state.theme);

  const tabStyle = useMemo(() => {
    return {
      color: theme === "light" ? "#ccc" : "#ccc",
      activeColor: theme === "light" ? "#2980b9" : "#2980b9",
      background: theme === "light" ? "#ecf0f1" : "#101218",
    };
  }, [theme]);

  const tabBarStyle = useMemo(() => {
    return {
      tabBarInactiveTintColor: tabStyle.color,
      tabBarActiveTintColor: tabStyle.activeColor,
      tabBarInactiveBackgroundColor: tabStyle.background,
      tabBarActiveBackgroundColor: tabStyle.background,
      tabBarShowLabel: false,
      tabBarStyle: Platform.select({
        ios: { marginBottom: 20 },
        android: {},
      }),
    };
  }, [tabStyle]);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
      backBehavior="history"
      safeAreaInsets={{ bottom: 0 }}
      layout={(props) => {
        return <Layout>{props.children}</Layout>;
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          ...tabBarStyle,
          tabBarIcon: (props) => (
            <Icon name="home" color={props.color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          ...tabBarStyle,
          tabBarIcon: (props) => (
            <Icon name="magnify" color={props.color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          ...tabBarStyle,
          tabBarIcon: (props) => (
            <Icon name="heart" color={props.color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          ...tabBarStyle,
          tabBarIcon: (props) => (
            <Icon name="cog-outline" color={props.color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="[id]/index"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="[id]/reviews/[id]"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="[id]/cast/[id]"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="[id]/people/[id]"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="view-more"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
