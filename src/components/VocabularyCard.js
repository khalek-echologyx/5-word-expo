import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function VocabularyCard({ word }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.wordContainer}>
          <Text style={styles.word}>
            {word.word}
          </Text>

          <Text style={styles.meaning}>
            {word.bangla_meaning}
          </Text>
        </View>

        <Text style={styles.arrow}>
          {expanded ? "▲" : "▼"}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.label}>
            Pronunciation
          </Text>

          <Text style={styles.text}>
            {word.pronunciation}
          </Text>

          <Text style={styles.label}>
            Part of speech
          </Text>

          <Text style={styles.text}>
            {word.part_of_speech}
          </Text>

          <Text style={styles.label}>
            Definition
          </Text>

          <Text style={styles.text}>
            {word.definition}
          </Text>

          <Text style={styles.label}>
            Example
          </Text>

          <Text style={styles.example}>
            "{word.example_sentence}"
          </Text>

          <Text style={styles.meta}>
            {word.difficulty} · {word.category}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  wordContainer: {
    flex: 1,
  },

  word: {
    fontSize: 20,
    fontWeight: "700",
  },

  meaning: {
    fontSize: 16,
    marginTop: 4,
  },

  arrow: {
    fontSize: 16,
    marginLeft: 12,
  },

  details: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
  },

  example: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },

  meta: {
    fontSize: 12,
    marginTop: 16,
  },
});