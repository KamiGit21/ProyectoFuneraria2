import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from "react-native";

const paquetes = [
  {
    id: 1,
    nombre: "Plan Básico",
    descripcion: "Traslado local + ataúd estándar de pino + sala de velación 24 h + trámites civiles básicos",
    precio_base: 6400.00
  },
  {
    id: 7,
    nombre: "Plan Estándar",
    descripcion: "Incluye Plan Básico + carroza + asistencia en tramitación avanzada (obituario digital, certificado urgente)",
    precio_base: 930.00
  },
  {
    id: 8,
    nombre: "Plan Premium",
    descripcion: "Plan Estándar + urna metálica decorativa + servicio de música en vivo + catering ligero para 20 personas",
    precio_base: 14799.00
  },
  {
    id: 9,
    nombre: "Plan Cremación Directa",
    descripcion: "Traslado + cofre ecológico + cremación sin velorio + entrega de cenizas en urna básica",
    precio_base: 7501.00
  },
];

export default function CartScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NUESTROS PAQUETES</Text>
      <FlatList
        data={paquetes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              style={[styles.itemCard, isSelected && styles.selectedCard]}
              onPress={() => setSelectedId(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.row}>
                <Image source={require("./assets/paquete.png")} style={styles.iconoPaquete} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text style={styles.descripcion}>{item.descripcion}</Text>
                  <View style={styles.precioRow}>
                    <Text style={styles.precioLabel}>Precio:</Text>
                    <Text style={styles.precio}>Bs {item.precio_base.toLocaleString('es-BO')}</Text>
                  </View>
                </View>
                {isSelected && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>
              <TouchableOpacity
                style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                onPress={() => setSelectedId(item.id)}
              >
                <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextActive]}>
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity
        style={[styles.button, !selectedId && { backgroundColor: '#ccc' }, { marginBottom: 80 }]}
        onPress={() => selectedId && setModalVisible(true)}
        disabled={!selectedId}
      >
        <Text style={styles.buttonText}>Solicitar paquete</Text>
      </TouchableOpacity>

      {/* Modal personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Revisa más paquetes en nuestra página principal{"\n"}
              <Text style={{ color: "#2E3B4E", fontWeight: "bold" }}>lumengest.com</Text>
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#F2EFEA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C4F4B',
    marginBottom: 20,
    textAlign: 'center',
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
  selectedCard: {
    borderColor: '#B59F6B',
    backgroundColor: '#f9f6f1',
    shadowOpacity: 0.18,
    elevation: 5,
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
  check: {
    fontSize: 28,
    color: '#B59F6B',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectButton: {
    backgroundColor: '#e0d7c6',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  selectButtonActive: {
    backgroundColor: '#B59F6B',
  },
  selectButtonText: {
    color: '#6C4F4B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#6C4F4B',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginHorizontal: 30,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#2E3B4E",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2E3B4E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
