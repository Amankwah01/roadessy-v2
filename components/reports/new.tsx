import React from "react";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import { Map } from "../map-section";
import { DefectStats } from "../defects-stats";

// Create styles

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",

    backgroundColor: "#E4E4E4",
  },

  section: {
    margin: 10,

    padding: 10,

    flexGrow: 1,
  },
});

// Create Document Component

export default function New() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <DefectStats />
        </View>

        <View style={styles.section}>
          <Text>Roadessy Road Report</Text>
        </View>
      </Page>
    </Document>
  );
}
