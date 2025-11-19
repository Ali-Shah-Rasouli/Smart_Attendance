import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const StudentProfile = () => {
  const [image, setImage] = useState<string | null>(null);
  const savedImage = 'path/to/savedImage.png';  // Example saved image path

  if (savedImage) {
    setImage(savedImage);  // No TypeScript error anymore
  }

  return (
    <TouchableOpacity onPress={() => { /* Some image picker logic */ }}>
      <Image
        source={image ? { uri: image } : require("../../assets/images/3.png")}
        style={styles.profilePic}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default StudentProfile;