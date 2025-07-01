import { Icon } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { useTheme } from "../theme/ThemeContext";
import Cart from "./Cart";
import Explore from "./Explore";
import Listing from "./Listing";
import UserProfile from "./UserProfile";

const Tab = createMaterialBottomTabNavigator();

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: theme.surface,
        elevation: 8,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        height: 100,
      }}
      activeColor={theme.primary}
      inactiveColor={theme.textSecondary}
      labeled={false}
      screenOption={{
        tabBarIcon: ({ color, focused }) => {
          const iconSize = focused ? 32 : 24;
          return (
            <Icon color={color} source="home" size={iconSize} theme={theme} />
          );
        },
      }}
    >
      <Tab.Screen
        name="Listing/index"
        component={Listing}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              color={color}
              source="home"
              size={focused ? 32 : 24}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore/index"
        component={Explore}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              color={color}
              source="compass"
              size={focused ? 32 : 24}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart/index"
        component={Cart}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              color={color}
              source="cart"
              size={focused ? 32 : 24}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile/index"
        component={UserProfile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              color={color}
              source="account"
              size={focused ? 32 : 24}
              theme={theme}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}