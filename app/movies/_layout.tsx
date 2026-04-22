import { useMemo } from "react";
import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Layout, useUserStore } from "@/features/movies";

const TAB_ICON = 24;

export default function MoviesLayout() {
  const theme = useUserStore((state) => state.theme);

  const tabStyle = useMemo(() => {
    return {
      background: theme === "light" ? "#ecf0f1" : "#101218",
    };
  }, [theme]);

  const tabBarStyle: any = useMemo(() => {
    return {
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#f1c40f",
      tabBarInactiveTintColor: "#7f8c8d",
      tabBarStyle: {
        backgroundColor: tabStyle.background,
        paddingTop: 12,
        borderTopColor: "rgba(127, 140, 141, 0.25)",
        borderTopWidth: 1,
      },
    };
  }, [tabStyle]);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
      backBehavior="history"
      layout={(props) => {
        return <Layout>{props.children}</Layout>;
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          ...tabBarStyle,
          title: "Home",
          tabBarAccessibilityLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              color={color}
              size={TAB_ICON}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          ...tabBarStyle,
          title: "Watchlist",
          tabBarAccessibilityLabel: "Watchlist",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
              size={TAB_ICON}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          ...tabBarStyle,
          title: "Favorites",
          tabBarAccessibilityLabel: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={TAB_ICON}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          ...tabBarStyle,
          title: "Config",
          tabBarAccessibilityLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "cog" : "cog-outline"}
              color={color}
              size={TAB_ICON}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: "none" },
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
        name="series/[id]/index"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="series/[id]/cast/[id]"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="series/[id]/people/[personId]"
        options={{
          ...tabBarStyle,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="series/[id]/reviews/[id]"
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
