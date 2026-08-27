import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PRODUTOS_INICIAIS = [
  {
    id: '1',
    nome: 'Café Torrado e Moído 500g',
    marca: 'Pilão',
    mercado: 'Supermercado Guanabara',
    preco: 16.90,
    imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80'
  },
  {
    id: '2',
    nome: 'Café Torrado e Moído 500g',
    marca: 'Pilão',
    mercado: 'Carrefour',
    preco: 18.50,
    imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80'
  },
  {
    id: '3',
    nome: 'Arroz Branco Tipo 1 5kg',
    marca: 'Tio João',
    mercado: 'Zona Sul',
    preco: 29.90,
    imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80'
  },
  {
    id: '4',
    nome: 'Arroz Branco Tipo 1 5kg',
    marca: 'Tio João',
    mercado: 'Supermercado Guanabara',
    preco: 24.80,
    imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80'
  },
];

export default function App() {
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState(PRODUTOS_INICIAIS);
  const [fotoEncarte, setFotoEncarte] = useState(null);

  const menorPrecoAtual = produtos.length > 0 
    ? Math.min(...produtos.map(p => p.preco)) 
    : null;

  const handleBusca = (texto) => {
    setBusca(texto);
    if (texto === '') {
      setProdutos(PRODUTOS_INICIAIS);
    } else {
      const filtrados = PRODUTOS_INICIAIS.filter(item =>
        item.nome.toLowerCase().includes(texto.toLowerCase()) ||
        item.mercado.toLowerCase().includes(texto.toLowerCase())
      );
      setProdutos(filtrados);
    }
  };

  const enviarParaBancoMySQL = async (uri) => {
    const formData = new FormData();
    formData.append('foto', {
      uri: uri,
      name: 'encarte_saquarema.jpg',
      type: 'image/jpeg',
    });

    try {
      const resposta = await fetch('http://localhost:8000/upload-encarte/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resultado = await resposta.json();
      Alert.alert("Sucesso no MySQL!", resultado.mensagem);
    } catch (erro) {
      console.log("Erro ao conectar com a API:", erro);
      Alert.alert("Aviso", "Encarte capturado e salvo no App com sucesso! (Certifique-se de que o FastAPI está rodando).");
    }
  };

  // Função direta para abrir a Galeria ao clicar no botão
  const abrirGaleriaDireto = async () => {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissao.granted) {
        Alert.alert("Aviso", "Precisamos de permissão para acessar a galeria de fotos.");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, 
        quality: 0.8,
      });

      if (!resultado.canceled) {
        const uri = resultado.assets[0].uri;
        setFotoEncarte(uri);
        enviarParaBancoMySQL(uri);
      }
    } catch (error) {
      console.log("Erro ao abrir a galeria: ", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE600" />
      
      {/* CABEÇALHO ESTILO MERCADO LIVRE */}
      <View style={styles.header}>
        <View style={styles.linhaTopo}>
          <Text style={styles.logoMarca}>MenorPreçoSaquarema</Text>
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.iconeBusca}>🔍</Text>
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar produtos, marcas..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={handleBusca}
          />
        </View>
      </View>

      {/* BANNER / BOTÃO DE ENCARTE (ABRE A GALERIA DIRETAMENTE) */}
      <View style={styles.containerBanner}>
        <TouchableOpacity style={styles.botaoEncarte} onPress={abrirGaleriaDireto} activeOpacity={0.9}>
          <Text style={styles.textoBotaoEncarte}>📸 Enviar Encarte de Ofertas</Text>
          <Text style={styles.subTextoBotao}>Toque para selecionar o encarte da galeria</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE PRODUTOS */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const ehOMenorPreco = item.preco === menorPrecoAtual;

          return (
            <View style={[styles.cardProduto, ehOMenorPreco && styles.cardMenorPreco]}>
              <Image source={{ uri: item.imagem }} style={styles.imagemProduto} />
              
              <View style={styles.detalhesProduto}>
                {ehOMenorPreco && (
                  <View style={styles.badgeMenorPreco}>
                    <Text style={styles.textoBadge}>★ MELHOR PREÇO</Text>
                  </View>
                )}
                <Text style={styles.nomeProduto} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.marcaProduto}>Marca: {item.marca}</Text>
                <Text style={styles.nomeMercado}>📍 {item.mercado}</Text>
              </View>

              <View style={styles.blocoPreco}>
                <Text style={styles.valorPreco}>R$ {item.preco.toFixed(2)}</Text>
                <Text style={styles.freteGratis}>Frete grátis loja</Text>
                <TouchableOpacity style={styles.btnComprar} onPress={abrirGaleriaDireto}>
                  <Text style={styles.txtBtnComprar}>Ver Oferta</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.boxVazio}>
            <Text style={styles.textoVazio}>Nenhum produto encontrado para "{busca}".</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  header: {
    backgroundColor: '#FFE600',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 12,
  },
  linhaTopo: {
    marginBottom: 8,
  },
  logoMarca: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2D3277',
  },
  boxInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 42,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconeBusca: {
    fontSize: 14,
    marginRight: 8,
    color: '#666',
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  containerBanner: {
    padding: 12,
    backgroundColor: '#FFE600',
    paddingBottom: 16,
  },
  botaoEncarte: {
    backgroundColor: '#3483FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    elevation: 3,
  },
  textoBotaoEncarte: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subTextoBotao: {
    color: '#E3F2FD',
    fontSize: 10,
    marginTop: 2,
  },
  listaContainer: {
    padding: 12,
  },
  cardProduto: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  cardMenorPreco: {
    borderColor: '#00A650',
    borderWidth: 1.5,
  },
  imagemProduto: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  detalhesProduto: {
    flex: 1,
    marginLeft: 10,
  },
  badgeMenorPreco: {
    backgroundColor: '#00A650',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  textoBadge: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  nomeProduto: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  marcaProduto: {
    fontSize: 11,
    color: '#777',
    marginTop: 1,
  },
  nomeMercado: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '700',
  },
  blocoPreco: {
    alignItems: 'flex-end',
    marginLeft: 6,
  },
  valorPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  freteGratis: {
    fontSize: 9,
    color: '#00A650',
    fontWeight: 'bold',
    marginVertical: 2,
  },
  btnComprar: {
    backgroundColor: '#3483FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 4,
  },
  txtBtnComprar: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  boxVazio: {
    alignItems: 'center',
    marginTop: 40,
  },
  textoVazio: {
    color: '#666',
    fontSize: 14,
  },
});