import { AntDesign, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";

export const icon = {
  events: (props: any) => (
    <Ionicons name="calendar-outline" size={24} color="black" {...props} />
  ),
  index: (props: any) => (
    <Feather name="home" size={24} color={"#222"} {...props} />
  ),

  news: (props: any) => (
    <FontAwesome6 name="newspaper" size={24} color="black" {...props} />
  ),
  chat: (props: any) => (
    <Ionicons
      name="chatbubble-ellipses-outline"
      size={24}
      color="black"
      {...props}
    />
  ),
};
