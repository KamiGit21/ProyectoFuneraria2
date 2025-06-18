import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const productos = [
  {
    id: 1,
    nombre: "Planes Funerarios",
    descripcion: "Paquetes completos que incluyen traslado, velatorio, ataúd y gestión de trámites legales.",
    precio_base: 5000.00
  },
  {
    id: 2,
    nombre: "Ataúdes y urnas",
    descripcion: "Ataúdes de madera, metal o ecológicos, y urnas para cenizas con diseños personalizables.",
    precio_base: 1200.00
  },
  {
    id: 3,
    nombre: "Traslado y logística",
    descripcion: "Servicio de traslado local o nacional del fallecido, incluyendo permisos y vehículos especializados.",
    precio_base: 800.00
  },
  {
    id: 4,
    nombre: "Ceremonia y velatorio",
    descripcion: "Organización de velatorios en salas privadas o domicilio, con servicios de catering y música opcionales.",
    precio_base: 2000.00
  },
  {
    id: 5,
    nombre: "Gestión y trámites",
    descripcion: "Asesoría legal para actas de defunción, permisos de inhumación/cremación y trámites ante el registro civil.",
    precio_base: 300.00
  },
  {
    id: 6,
    nombre: "Conmemoración y recuerdo",
    descripcion: "Lápidas, placas conmemorativas, joyería con cenizas y digitalización de memorias (fotos/videos).",
    precio_base: 450.00
  },
  {
    id: 7,
    nombre: "Apoyo posterior",
    descripcion: "Sesiones de acompañamiento psicológico para familiares y gestión de seguros funerarios.",
    precio_base: 150.00
  },
  {
    id: 9,
    nombre: "Arreglos florales",
    descripcion: "Coronas, centros y ramos personalizados con flores frescas para ceremonias.",
    precio_base: 250.00
  }
];

export default function Products() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios y Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.row}>
              <Image source={require("./assets/servicios.png")} style={styles.iconoPaquete} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <View style={styles.precioRow}>
                  <Text style={styles.precioLabel}>Precio base:</Text>
                  <Text style={styles.precio}>Bs {item.precio_base.toLocaleString('es-BO')}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("./assets/home-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Products")}
        >
          <Image
            source={require("./assets/user-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Servicios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cart")}
        >
          <Image
            source={require("./assets/cart-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Paquetes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Buscar")}
        >
          <Image
            source={require("./assets/search-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2EFEA",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6C4F4B",
    marginBottom: 20,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0d7c6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconoPaquete: {
    width: 48,
    height: 48,
    marginRight: 16,
    resizeMode: 'contain',
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C4F4B',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 15,
    color: '#3A4A58',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  precioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  precioLabel: {
    fontSize: 16,
    color: '#6C4F4B',
    marginRight: 8,
    fontWeight: 'bold',
  },
  precio: {
    fontSize: 18,
    color: '#B59F6B',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#2E3B4E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 3,
    resizeMode: "contain",
    tintColor: "#ffffff",
  },
  navLabel: {
    fontSize: 12,
    color: "#ffffff",
  },
});
