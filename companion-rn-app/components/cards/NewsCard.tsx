import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { formattedDate } from "@/utils/formattedDate";

const NewsCard = ({
  image,
  title,
  createdAt,
  author,
}: {
  image: string;
  title: string;
  createdAt: string;
  author: string;
}) => {
  const formattedCreatedAt = formattedDate(createdAt);

  return (
    <View style={styles.cardContainer}>
      {/* <View style={styles.imageTextContainer}>
        <Image
          style={styles.cardImage}
          source={
            //  { uri: image}
            // require("../../assets/images/Untitled_design-13.png")
            require("../../assets/images/Training-4.png")
          }
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', "rgba(0,0,0,1)"]}
          style={styles.background}
        />   
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={{ fontSize: 13, color: "black"}}>{author}</Text>
        <Text style={{ fontSize: 11, color: "rgba(0, 0, 0, 0.54)"}}>{formattedCreatedAt}</Text>
        <TouchableOpacity style={styles.arrowRight} onPress={() => {}}>
          <FontAwesome6 name="arrow-right" size={20} color="black" />
        </TouchableOpacity>
      </View> */}
    </View>

    //     <View style={styles.cardContainer}>
    //   <Image
    //     style={styles.cardImage}
    //     source={
    //       //  { uri: image}
    //       require("../../assets/images/Untitled_design-13.png")
    //     }
    //     resizeMode="cover"
    //   />
    //   <View style={styles.textContainer}>
    //     <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
    //       {title}
    //     </Text>
    //     <Text style={{ fontSize: 13 }}>{formattedCreatedAt}</Text>
    //   </View>
    //   <TouchableOpacity style={styles.arrowRight} onPress={() => {}}>
    //     <FontAwesome6 name="arrow-right" size={20} color="black" />
    //   </TouchableOpacity>
    // </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: "95%",
    borderColor: "#2c2c2c86",
    borderWidth: 0,
    borderRadius: 10,
    boxShadow: "rgba(0, 0, 0, 0.41) 0px 0px 10px 0px",
    marginBlock: 10,
    flexDirection: "row",
    maxHeight: 200,
    overflow: "hidden",
    flex: 1,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },

  imageTextContainer: {
    position: "relative",
    height: "80%",
  },
  textContainer: {
    padding: 10,
    maxWidth: "65%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  cardImage: {
    maxWidth: "100%",
    height: "100%",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
    // marginBottom: 10,
    color: "white",
  },

  footer: {
    height: "20%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    paddingLeft: 10,
    flexDirection: "row",
  },

  arrowRight: {
    position: "absolute",
    right: 15,
    // bottom: 10,
  },
});
