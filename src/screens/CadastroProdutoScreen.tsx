import React, { useState } from 'react';

import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import ProdutoItem from '../components/ProdutoItem';

type Produto = {
  id: string;
  nome: string;
  preco: string;
};

export default function CadastroProdutoScreen() {
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState('');

  function adicionarProduto() {
    const produtoTratado = produto.trim();
    const precoTratado = preco.trim();

    if (produtoTratado === '' || precoTratado === '') {
      setErro('Atenção! Preencha o nome do produto e o preço.');
      return;
    }

    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: produtoTratado,
      preco: precoTratado,
    };

    setProdutos((listaAtual) => [
      ...listaAtual,
      novoProduto,
    ]);

    setProduto('');
    setPreco('');
    setErro('');
  }

  function removerProduto(id: string) {
    setProdutos((listaAtual) =>
      listaAtual.filter((item) => item.id !== id)
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>🛒</Text>

      <Text style={styles.titulo}>
        Menor Preço Saqua
      </Text>

      <Text style={styles.subtitulo}>
        Cadastre e acompanhe os preços encontrados
        nos mercados de Saquarema.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={produto}
        onChangeText={(texto) => {
          setProduto(texto);
          setErro('');
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço encontrado"
        value={preco}
        onChangeText={(texto) => {
          setPreco(texto);
          setErro('');
        }}
        keyboardType="decimal-pad"
        onSubmitEditing={adicionarProduto}
      />

      {erro !== '' && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={adicionarProduto}
      >
        <Text style={styles.textoBotao}>
          ADICIONAR PRODUTO
        </Text>
      </TouchableOpacity>

      <Text style={styles.contador}>
        Total cadastrado: {produtos.length}
      </Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProdutoItem
            item={item}
            onRemover={removerProduto}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhum produto cadastrado.
          </Text>
        }
        contentContainerStyle={
          produtos.length === 0
            ? styles.conteudoListaVazia
            : undefined
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: '#F4F8F4',
  },

  logo: {
    fontSize: 45,
    textAlign: 'center',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#198754',
    textAlign: 'center',
    marginTop: 5,
  },

  subtitulo: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#198754',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  erro: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  botao: {
    backgroundColor: '#198754',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  contador: {
    fontSize: 15,
    color: '#374151',
    marginVertical: 16,
    fontWeight: 'bold',
  },

  listaVazia: {
    color: '#6B7280',
    textAlign: 'center',
  },

  conteudoListaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});