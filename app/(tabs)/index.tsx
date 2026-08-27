import React, { useState } from 'react';

import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [produtos, setProdutos] = useState<string[]>([]);

  function cadastrarPreco() {
    if (produto === '' || preco === '') {
      alert('Preencha todos os campos!');
      return;
    }

    setProdutos([
      ...produtos,
      `${produto} cadastrado por R$ ${preco}!`,
    ]);

    setProduto('');
    setPreco('');
  }

  function limpar() {
    setProduto('');
    setPreco('');
    setProdutos([]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🛒</Text>

      <Text style={styles.titulo}>
        Menor Preço Saqua
      </Text>

      <Text style={styles.descricao}>
        Encontre e compartilhe os melhores preços de Saquarema
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={produto}
        onChangeText={setProduto}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço encontrado"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />

      <Button
        title="CADASTRAR PREÇO"
        onPress={cadastrarPreco}
      />

      <View style={styles.espaco} />

      <Button
        title="LIMPAR"
        onPress={limpar}
      />

      {produtos.length > 0 && (
        <View style={styles.lista}>
          <Text style={styles.subtitulo}>
            Produtos cadastrados
          </Text>

          {produtos.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.resultado}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F4F8F4',
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 5,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#198754',
    marginBottom: 8,
  },

  descricao: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#198754',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  espaco: {
    height: 10,
  },

  lista: {
    marginTop: 25,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#198754',
    textAlign: 'center',
    marginBottom: 10,
  },

  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#198754',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  resultado: {
    fontSize: 16,
    color: '#198754',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});