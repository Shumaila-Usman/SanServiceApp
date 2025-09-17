// LogoHeader.js
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// --- Responsive helpers (no external libs required) ---
const guidelineBaseWidth = 375; // design base width
const guidelineBaseHeight = 812; // design base height

const wp = (percent) => (width * percent) / 100;
const hp = (percent) => (height * percent) / 100;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
// <<< fixed: implemented function body (was missing and caused parser errors) >>>
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// --- Nav items (keys lowercase & stable) ---
const navItems = [
  { key: "home", label: "Home", icon: require("../assets/images/home.png") },
  { key: "services", label: "Services", icon: require("../assets/images/services.png") },
  { key: "products", label: "Products", icon: require("../assets/images/products.png") },
  { key: "discover", label: "Discover", icon: require("../assets/images/discover.png") },
  { key: "account", label: "Account", icon: require("../assets/images/account.png") },
];

// FeatureCard - keep same layout, support "special" prop
const FeatureCard = ({ icon, title, subtitle, special }) => {
  // <<< fixed: no TS annotations here, plain JS destructuring works correctly >>>
  return (
    <View style={[styles.card, special ? styles.cardSpecial : null]}>
      <Image source={icon} style={styles.cardIcon} resizeMode="contain" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
};

export default function LogoHeader() {
  const initialActive = "home";
  const [active, setActive] = useState(initialActive);

  // indicator for active pill position (index). Start at initial index.
  const initialIndex = navItems.findIndex((i) => i.key === initialActive);
  const indicator = useRef(new Animated.Value(initialIndex >= 0 ? initialIndex : 0)).current;

  // create animations map safely and only once
  const animationsRef = useRef({});
  if (Object.keys(animationsRef.current).length === 0) {
    navItems.forEach((item) => {
      animationsRef.current[item.key] = new Animated.Value(item.key === initialActive ? 1 : 0);
    });
  }
  const animations = animationsRef.current;

  const handlePress = (key) => {
    if (key === active) return;
    const previous = active;
    const newIndex = navItems.findIndex((i) => i.key === key);

    // guard in case something is wrong with keys
    const animTo = animations[key];
    const animFrom = animations[previous];

    const ops = [];
    if (animTo) {
      ops.push(
        Animated.timing(animTo, {
          toValue: 1,
          duration: 240,
          useNativeDriver: false, // color interpolation requires JS driver
        })
      );
    }
    if (animFrom) {
      ops.push(
        Animated.timing(animFrom, {
          toValue: 0,
          duration: 240,
          useNativeDriver: false,
        })
      );
    }
    if (typeof newIndex === "number" && newIndex >= 0) {
      ops.push(
        Animated.timing(indicator, {
          toValue: newIndex,
          duration: 240,
          useNativeDriver: false,
        })
      );
    }

    if (ops.length) Animated.parallel(ops).start();
    setActive(key);
  };

  // tab math used for pill interpolation (computed at runtime)
  const tabWidth = width / navItems.length;
  const pillWidth = wp(10); // used in inline styles / interpolation calculation
  const pillHalf = pillWidth / 2;

  return (
    <View style={styles.screen}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo (clickable to go Home) */}
        <TouchableOpacity onPress={() => handlePress("home")}>
          <Image
            source={require("../assets/images/sani_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Bell */}
        <Image
          source={require("../assets/images/bell.png")}
          style={styles.bellIcon}
          resizeMode="contain"
        />

        {/* Search */}
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/images/sparkles.png")}
            style={styles.sparklesIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Search or Request Help..."
            placeholderTextColor="#888"
          />
        </View>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>How May We Elevate Your Space?</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardGrid}>
          <FeatureCard
            icon={require("../assets/images/services_icon.png")}
            title="Services"
            subtitle="Specialized environmental care for refined living"
          />
          <FeatureCard
            icon={require("../assets/images/products_icon.png")}
            title="Products"
            subtitle="Premium-grade wellness products for modern homes."
          />
          <FeatureCard
            icon={require("../assets/images/history_icon.png")}
            title="My History"
            subtitle="Review your past bookings and purchases."
          />
          <FeatureCard
            icon={require("../assets/images/emergency_icon.png")}
            title="Emergency Booking"
            subtitle="Need immediate assistance? Request a service now"
            special
          />
        </View>

        {/* AQI */}
        <View style={styles.aqiContainer}>
          <Text style={styles.aqiLabel}>AQI</Text>
          <Text style={styles.aqiStatus}>Moderate (148)</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.featuredProductCard}>
                <Image
                  source={require("../assets/images/products_1.png")}
                  style={styles.featuredProductImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>TPA X8 PRO</Text>
                  <Text style={styles.featuredSubtitle}>
                    Engineered for superior air purification performance.
                  </Text>
                  <Text style={styles.featuredPrice}>
                    <Text style={styles.oldPrice}>AED 5100.00 </Text>AED 4999.00
                  </Text>
                  <TouchableOpacity style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Services */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {[1, 2].map((item) => (
              <View key={item} style={styles.featuredServiceCard}>
                <Image
                  source={require("../assets/images/products_2.png")}
                  style={styles.featuredServiceImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>AC Quarterly Disinfection</Text>
                  <Text style={styles.featuredSubtitle}>
                    Fresh indoor air through luxury-grade disinfection care.
                  </Text>
                  <TouchableOpacity style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fixed Navbar */}
      <View style={styles.navbarContainer}>
        <View style={styles.navbar}>
          <Animated.View
            style={[
              styles.activePill,
              {
                // left is animated based on indicator index; pill width / centering accounted for
                left: indicator.interpolate({
                  inputRange: navItems.map((_, i) => i),
                  outputRange: navItems.map((_, i) => i * tabWidth + tabWidth / 2 - pillHalf),
                }),
                // set width here too (so StyleSheet doesn't need runtime var)
                width: pillWidth,
              },
            ]}
          />
          {navItems.map((item) => {
            const anim = animations[item.key];
            const tintColor = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#888", "#fff"],
            });
            const scaleAnim = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.08],
            });
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.navItem}
                onPress={() => handlePress(item.key)}
                activeOpacity={0.85}
              >
                <Animated.Image
                  source={item.icon}
                  style={[styles.navIcon, { tintColor, transform: [{ scale: scaleAnim }] }]}
                  resizeMode="contain"
                />
                <Animated.Text style={[styles.navText, { color: tintColor }]}>
                  {item.label}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", justifyContent: "space-between" },

  // Ensure content has padding bottom so navbar doesn't overlay content
  scrollContent: { alignItems: "center", paddingBottom: hp(18) },

  // Logo & header section
  logo: {
    width: wp(38.13), // 143 / 375 = 38.13%
    height: moderateScale(42),
    marginTop: hp(17.25), // ~140/812
    marginBottom: hp(12.3), // ~100/812
  },
  bellIcon: {
    width: wp(5.33), // ~20/375
    height: moderateScale(22),
    alignSelf: "flex-end",
    marginRight: wp(8),
    marginBottom: hp(2.5),
  },

  // Search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: moderateScale(20),
    paddingHorizontal: wp(4),
    height: hp(6),
    width: "90%",
  },
  sparklesIcon: {
    width: wp(8.8), // ~33 / 375
    height: moderateScale(22),
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#fff",
  },

  // Heading
  headingContainer: { width: "90%", marginTop: hp(3.7), marginBottom: hp(3.7) },
  headingText: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#fff",
    textAlign: "left",
  },

  // Cards grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: moderateScale(16),
    width: "48%",
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(3),
    marginBottom: hp(2.2),
    alignItems: "center",
  },
  cardSpecial: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(6),
    elevation: 4,
  },
  cardIcon: {
    width: wp(12),
    height: moderateScale(40),
    marginBottom: hp(1),
  },
  cardTitle: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: "#fff",
    marginBottom: hp(0.7),
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: moderateScale(12),
    color: "#aaa",
    textAlign: "center",
  },

  // AQI
  aqiContainer: {
    width: "90%",
    backgroundColor: "#111",
    borderRadius: moderateScale(16),
    padding: wp(4),
    marginTop: hp(1.2),
  },
  aqiLabel: { color: "#aaa", fontSize: moderateScale(12), marginBottom: hp(0.4) },
  aqiStatus: { color: "#fff", fontSize: moderateScale(14), marginBottom: hp(1) },
  progressBar: {
    height: hp(1.2),
    borderRadius: hp(1),
    backgroundColor: "#333",
    overflow: "hidden",
  },
  progressFill: { width: "50%", height: "100%", backgroundColor: "#FFD700" },

  // Sections
  sectionContainer: {
    width: "100%",
    marginTop: hp(3.7),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(5.3),
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#fff",
  },
  viewAll: {
    fontSize: moderateScale(14),
    color: "#E63946",
  },
  horizontalScroll: {
    paddingLeft: wp(5.3),
    paddingRight: wp(5.3),
  },

  // Product card (responsive)
  featuredProductCard: {
    width: wp(95),
    height: hp(33.14),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    backgroundColor: "#111",
    marginRight: wp(4),
  },
  featuredProductImage: {
    width: "100%",
    height: "100%",
  },

  // Service card
  featuredServiceCard: {
    width: wp(95),
    height: hp(29.45),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    backgroundColor: "#111",
    marginRight: wp(4),
  },
  featuredServiceImage: {
    width: "100%",
    height: "100%",
  },

  // Shared overlay
  featuredOverlay: {
    position: "absolute",
    bottom: hp(2.5),
    left: wp(5.3),
    right: wp(5.3),
  },
  featuredTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#fff",
    marginBottom: hp(0.6),
  },
  featuredSubtitle: {
    fontSize: moderateScale(13),
    color: "#ccc",
    marginBottom: hp(1.2),
  },
  featuredPrice: {
    fontSize: moderateScale(14),
    color: "#fff",
    marginBottom: hp(1.2),
  },
  oldPrice: {
    color: "#888",
    textDecorationLine: "line-through",
  },
  featuredButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(14),
  },
  featuredButtonText: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: "#000",
  },

  // Navbar area
  navbarContainer: { position: "absolute", bottom: 0, width: "100%" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: hp(12.19), // ~99/812
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: wp(6.93), height: wp(6.93), marginBottom: hp(0.4) }, // ~26/375
  navText: { fontSize: moderateScale(12) },
  // use wp() directly so StyleSheet stays pure (no in-scope variable used here)
  activePill: {
    position: "absolute",
    top: hp(0.6),
    width: wp(10),
    height: hp(0.5),
    borderRadius: hp(0.3),
    backgroundColor: "#fff",
  },
});
