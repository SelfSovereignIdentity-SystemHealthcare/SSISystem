- API de Avalista. Controlador para avalista executando localmente.
- Agente Avalista. Aca-Py configurado para o papel de avalista.
- Banco de Dados do Avalista. Banco de dados Postgresql para Agente Avalista Aca-Py

### Pontos de Extremidade

- Swagger do Proxy do Inquilino
- UI do Inquilino - Hospedeiro
- UI do Inquilino - Inquilinos

### Credenciais

- hospedeiro / altere-me

### Dependências Externas
- Ledger de Teste BCovrin... veja a variável de ambiente `ACAPY_GENESIS_URL` (http://test.bcovrin.vonx.io/genesis).
- DID de Avalista previamente registrado... veja a variável de ambiente `ACAPY_ENDORSER_PUBLIC_DID`.

## Executar Traction Localmente
- docker
- docker compose (V1 ou V2)

#### verificar versão do docker compose

Existem dois comandos que podem agir de forma diferente dependendo da sua configuração: `docker compose` e `docker-compose`.

No exemplo a seguir, você pode ver que os dois comandos usam duas versões diferentes do docker compose. (Este é um Mac com Docker Desktop 4.16.2 com V2 desativado nas configurações).

```sh
CountryMac:scripts jason$ docker compose version
> Versão do Docker Compose v2.15.1

CountryMac:scripts jason$ docker-compose version
> versão do docker-compose 1.29.2, build 5becea4c
```

Agora, a mesma máquina com V2 ativado nas configurações do Docker Desktop.

```sh
CountryMac:scripts jason$ docker compose version
> Versão do Docker Compose v2.15.1

CountryMac:scripts jason$ docker-compose version
> Versão do Docker Compose v2.15.1
```

## iniciar
copie .env-example para .env e ajuste conforme necessário para o seu ambiente
inicie o traction

```sh
cp .env-example .env
docker compose build
docker compose up
```

### Nota:
para usar seu token de autenticação ngrok e evitar que os túneis expirem, adicione o valor no arquivo .env após descomentar a linha que define NGROK_AUTHTOKEN e então inicie o projeto com docker compose up.

### erros de construção
As configurações do Docker Compose (e docker) variam muito para cada desenvolvedor, não podemos garantir que os arquivos do docker compose funcionarão com todas as nuances e ajustes que um desenvolvedor faz em sua configuração (usando buildkit ou não, logado ou não, etc.). Estes scripts foram testados contra Docker / Docker Compose V1 e V2. Usar docker compose para construir séries de imagens parece variar mais entre V1 e V2 e várias máquinas de desenvolvedores. Se você tiver problemas para construir, tente limpar seu docker e construir imagens diretamente. Veja acima para verificar suas versões.

### limpar ambiente docker
Tente o seguinte para purgar seus contêineres docker, imagens e cache de construção:

```sh
docker rm -vf $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker system prune -a --volumes
```

### construir imagens diretamente
Assumindo começar em /scripts…

```sh
cd ../plugins/docker
docker build -f ./Dockerfile --tag traction:plugins-acapy ..
cd ../../services/aca-py
docker build -f ./Dockerfile.acapy --tag traction:traction-agent .
cd ../../scripts
docker compose up
```

Se ainda houver erros, tente desativar o buildkit. No terminal onde você está executando suas construções:

```sh
export DOCKER_BUILDKIT=0
```

Então tente construir novamente.

### parar
Isso deixará o volume (dados) intacto e disponível no reinício.

```sh
docker compose down
```

IMPORTANTE quando os ambientes são desmontados e depois montados novamente, um novo endpoint ngrok é criado. Isso pode causar problemas reutilizando inquilinos/carteiras, pois eles serão registrados com endpoints ngrok defuntos.

### desmontar
Isso removerá o volume, então o próximo início/subida recriará um novo ambiente.

```sh
docker compose down -v --remove-orphans
```

## Fluxo Simples
No guia a seguir, realizaremos um processo simples de integração onde você desempenhará tanto o papel de hospedeiro quanto o de inquilino.

Isso pressupõe um ambiente limpo construído e iniciado conforme documentado acima. Você pode achar mais fácil apenas deixar as abas abertas em vez de copiar e salvar os IDs, senhas e chaves.

1. (Inquilino) Faça uma reserva
	1. abra uma nova aba para agir como um inquilino em potencial e faça uma reserva
	2. navegue até http://localhost:5101
	3. Clique em Criar Solicitação
	4. Preencha a solicitação, lembre-se do endereço de e-mail e defina o nome do Inquilino para algo único.
	5. Envie a Solicitação - copie o endereço de e-mail e o ID da Reserva.

2. (Hospedeiro) Aprovar a Reserva
	1. abra uma nova aba no navegador para realizar as tarefas de hospedeiro.
	2. navegue até http://localhost:5101/innkeeper
	3. Faça login com:
		* Nome do Administrador = hospedeiro
		* Chave do Administrador = altere-me
	4. Vá para a aba Reservas e atualize se necessário.
	5. Aprove a Reserva clicando na marca de verificação na coluna Ações
	6. Copie a Senha da Reserva (NOTA: isso não acontece na produção, a senha da reserva será entregue ao inquilino por e-mail ou algum outro meio)
3. (Inquilino) Verificar status da reserva
	1. abra uma nova aba para agir como um inquilino em potencial e verificar a reserva
	2. navegue até http://localhost:5101
	3. Clique em Verificar Status
	4. insira o endereço de e-mail acima e o ID da Reserva salvo
	5. Clique em Verificar Status e ele deve ser aprovado.
	6. Insira a senha da Reserva.
	7. Isso deve ser validado e você receberá seu ID da Carteira e Chave da Carteira.
	8. Anote esses dados!
4. (Inquilino) Fazer login
	1. abra uma nova aba para o inquilino
	2. navegue até http://localhost:5101
	3. Insira o ID da Carteira salvo e a Chave da Carteira

Você pode usar o id da carteira e a chave para recuperar um token e usar a API do Inquilino.

1. Abra uma nova aba e navegue até http://localhost:8032/api/doc
2. Role para baixo até POST multitenancy/wallet/{wallet_id}/token
3. Expanda e clique em Experimentar.
4. Preencha o corpo com sua Chave da Carteira
5. Insira seu ID da Carteira no campo wallet_id.
6. Clique em Executar e verifique a resposta.
7. Copie o valor de token da resposta.
8. Role para o topo (ou clique em um ícone de cadeado).
9. Na seção inferior AuthorizationHeader (apiKey), para o campo Valor, insira Bearer <seu valor de token> e Autorize.
10. Agora você está logado como seu tenant/wallet/agent.
11. Role para GET /tenant, expanda, Experimente e Execute.
12. Estes são os detalhes do seu inquilino. Apenas você está autorizado a buscar os dados do seu inquilino.
