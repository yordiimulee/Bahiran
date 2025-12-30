import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function TermsOfServices() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.modalText}>
        <Text style={styles.sectionTitle}>Customer Agreement (Terms of Service){"\n"}</Text>
        This Customer Agreement is entered into between Bahiran and the Customer ("you"). By creating an account, placing an order, or otherwise using our services, you agree to the following terms:{"\n\n"}

        <Text style={styles.sectionTitle}>1. Acceptance of Terms{"\n"}</Text>
        By using the Bahiran app or website, you agree to these Terms of Service. We may update these Terms from time to time, and continued use of our platform means you accept any changes.{"\n\n"}

        <Text style={styles.sectionTitle}>2. Services Provided{"\n"}</Text>
        Bahiran provides an online ordering and delivery service connecting customers with restaurants and independent delivery partners. Bahiran itself does not cook or prepare food.{"\n\n"}

        <Text style={styles.sectionTitle}>3. Orders & Payments{"\n"}</Text>
        Customers must pay using the payment methods available on the platform. Any applicable service or delivery fees will be clearly displayed.{"\n\n"}

        <Text style={styles.sectionTitle}>4. Delivery{"\n"}</Text>
        Estimated delivery times are not guaranteed. Customers must be available at the provided address to receive orders. If an order cannot be delivered due to customer unavailability or incorrect details, the customer may still be charged.{"\n\n"}

        <Text style={styles.sectionTitle}>5. Food Quality & Responsibility{"\n"}</Text>
        Restaurants are solely responsible for the quality and safety of the food if the delivery was still sealed. Bahiran is not liable for food-related issues including allergies or spoilage. Customers should check packaging upon delivery.{"\n\n"}

        <Text style={styles.sectionTitle}>6. Refunds & Cancellations{"\n"}</Text>
        Orders can only be cancelled before restaurant confirmation. Refunds, if any, are subject to company policy. Late delivery does not automatically qualify for a refund.{"\n\n"}

        <Text style={styles.sectionTitle}>7. Customer Conduct{"\n"}</Text>
        Customers must provide accurate information and treat delivery partners and restaurant staff with respect. Fraudulent or abusive behavior may result in account suspension.{"\n\n"}

        <Text style={styles.sectionTitle}>8. Ratings & Reviews{"\n"}</Text>
        Customers may leave reviews, but they must be fair and respectful. The Company reserves the right to remove abusive or false reviews.{"\n\n"}

        <Text style={styles.sectionTitle}>9. Liability Limitation{"\n"}</Text>
        Bahiran is not responsible for indirect damages such as delays, missed events, or dissatisfaction with food quality. The Company's maximum liability is limited to the order value.{"\n\n"}

        <Text style={styles.sectionTitle}>10. Privacy & Data Protection{"\n"}</Text>
        Customer data will be used only for processing orders and improving services. We will not sell personal data to third parties.{"\n\n"}

        <Text style={styles.sectionTitle}>11. Termination of Service{"\n"}</Text>
        The Company may suspend or terminate accounts if customers violate these Terms.{"\n\n"}

        
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40, // Same as back button for balance
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
  },
  content: {
    paddingBottom: 40, // Extra padding at the bottom
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
});