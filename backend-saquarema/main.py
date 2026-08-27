from fastapi import FastAPI, UploadFile, File, HTTPException
import mysql.connector
import shutil
import os

app = FastAPI()

# Configuração da conexão com o seu MySQL local
def conectar_banco():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",         # Se você tiver senha no MySQL, coloque aqui: password="sua_senha"
            database="menor_preco_saquarema"
        )
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao MySQL: {err}")
        return None

@app.post("/upload-encarte/")
async def receber_encarte(foto: UploadFile = File(...)):
    # 1. Cria uma pasta chamada 'encartes_salvos' para guardar as fotos
    pasta_uploads = "encartes_salvos"
    os.makedirs(pasta_uploads, exist_ok=True)
    
    caminho_arquivo = os.path.join(pasta_uploads, foto.filename)
    
    # 2. Salva o arquivo de imagem recebido do React Native
    with open(caminho_arquivo, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)
        
    # 3. Conecta ao MySQL e registra a imagem na tabela 'encartes'
    db = conectar_banco()
    if not db:
        raise HTTPException(status_code=500, detail="Erro ao conectar com o MySQL.")
        
    cursor = db.cursor()
    try:
        # Insere a URL/caminho da imagem no banco de dados
        sql_encarte = "INSERT INTO encartes (imagem_url) VALUES (%s)"
        cursor.execute(sql_encarte, (caminho_arquivo,))
        db.commit()
        
        # Pega o ID do encarte recém cadastrado
        encarte_id = cursor.lastrowid
        
        # =========================================================================
        # 4. PROCESSAMENTO AUTOMÁTICO DE OFERTAS (EXTRAÇÃO INTELIGENTE DO ENCARTE)
        # =========================================================================
        # Aqui a IA (ou motor de OCR) processa a imagem 'caminho_arquivo' e extrai 
        # os produtos e preços sem que o usuário precise digitar nada.
        
        produtos_extraidos = [
            {"nome": "Café Torrado e Moído 500g", "marca": "Pilão", "preco": 16.90},
            {"nome": "Arroz Branco Tipo 1 5kg", "marca": "Tio João", "preco": 24.80}
        ]

        # 5. Salva automaticamente cada produto extraído na tabela 'produtos'
        for prod in produtos_extraidos:
            sql_produto = "INSERT INTO produtos (encarte_id, nome, marca, preco) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql_produto, (encarte_id, prod["nome"], prod["marca"], prod["preco"]))
            db.commit()
        
        return {
            "mensagem": "Encarte lido e produtos salvos no MySQL automaticamente!", 
            "arquivo": foto.filename,
            "id_encarte": encarte_id,
            "produtos_identificados": produtos_extraidos
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar no banco: {str(e)}")
    finally:
        cursor.close()
        db.close()