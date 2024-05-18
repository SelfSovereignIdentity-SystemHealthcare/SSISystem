# Oficina de Trabalho de Credenciais AnonCreds/Hyperledger Aries na Sandbox do Traction

## Introdução

Bem-vindo! Esta oficina contém uma sequência de quatro laboratórios que vão te levar de zero a emitir, receber, manter, solicitar, apresentar e verificar Credenciais Verificáveis AnonCreds—não é necessária experiência técnica! Se você seguir os passos exatamente como descritos, levará apenas cerca de 20 minutos para concluir todo o processo. Claro, esperamos que você fique curioso, experimente e aprenda muito mais sobre as informações fornecidas nos laboratórios.

Para executar os laboratórios, você precisará de um agente Hyperledger Aries para poder emitir e verificar credenciais verificáveis. Para isso, estamos fornecendo seu próprio inquilino em uma implantação "sandbox" do BC Gov de uma ferramenta de código aberto chamada [Traction], um agente Aries multi-inquilino, pronto para produção e gerenciado, construído no [Hyperledger Aries Cloud Agent Python] (ACA-Py). *Sandbox* neste contexto significa que você pode fazer o que quiser com seu agente inquilino, mas não fazemos promessas sobre a estabilidade do ambiente (mas é bastante robusto, então é provável que funcione...), **e nos dias 1 e 15 de cada mês, reiniciaremos toda a sandbox e todo o seu trabalho será apagado — puff!** Tenha isso em mente ao usar a sandbox do Traction. Recomendamos que você mantenha um caderno ao seu lado, registrando os aprendizados importantes que deseja lembrar. À medida que você cria códigos que utilizam seu agente sandbox, certifique-se de criar configurações fáceis de atualizar para que, após um reinício, você possa criar um novo agente inquilino, recriar os objetos necessários (cada um dos quais terá novos identificadores), atualizar sua configuração e continuar.

Os quatro laboratórios nesta oficina são organizados da seguinte forma:

* Lab 1: [Obtenção de um Agente Inquilino Traction e Carteira Móvel](#lab-1-obtenção-de-um-agente-inquilino-traction-e-carteira-móvel)
* Lab 2: [Preparação para Ser um Emissor](#lab-2-preparação-para-ser-um-emissor)
* Lab 3: [Emissão de Credenciais para uma Carteira Móvel](#lab-3-emissão-de-credenciais-para-uma-carteira-móvel)
* Lab 4: [Solicitação e Envio de Apresentações](#lab-4-solicitação-e-envio-de-apresentações)

Depois de concluir os laboratórios, há [sugestões](#próximos-passos) para próximos passos para desenvolvedores, como experimentar o Traction/ACA-Py.

[Traction]: https://digital.gov.bc.ca/digital-trust/technical-resources/traction/
[Hyperledger Aries Cloud Agent Python]: https://aca-py.org
[Traction Sandbox]: https://traction-sandbox-tenant-ui.apps.silver.devops.gov.bc.ca/
[BCovrin Test Ledger]: http://test.bcovrin.vonx.io/
[Traction Sandbox Workshop FAQ and Questions]: https://github.com/bcgov/traction/issues/927

Vamos começar!

## Lab 1: Obtenção de um Agente Inquilino Traction e Carteira Móvel

Vamos começar obtendo seus dois agentes — uma Carteira Móvel Aries e um agente Emissor/Verificador Aries.

### Lab 1: Passos a Seguir

1. Obtenha uma Carteira Móvel Aries compatível para usar com seu inquilino Aries Traction. Há várias para escolher. Sugerimos que você use uma destas:
    1. [BC Wallet](https://digital.gov.bc.ca/digital-trust/about/about-bc-wallet) do [Governo da Colúmbia Britânica](https://digital.gov.bc.ca/digital-trust/)
    2. [Orbit Wallet](https://northernblock.io/orbit-edge-wallet/) da [Northern Block](https://northernblock.io/)
2. Clique neste [link da Sandbox do Traction] para ir à página de login da Sandbox e criar seu próprio agente Aries Inquilino Traction. Uma vez lá, faça o seguinte:
    1. Clique em "Create Request!", preencha pelo menos os campos obrigatórios do formulário e clique em "Submit".
    2. O ID da Carteira e a Chave da Carteira do seu novo Inquilino Traction serão exibidos. **SALVE-OS IMEDIATAMENTE PARA TER ACESSO AO SEU INQUILINO**. Você só poderá vê-los/salvá-los uma vez!
        1. Você precisará deles toda vez que abrir seu agente Inquilino Traction. Colocá-los em um Gerenciador de Senhas é uma ótima ideia!
        2. Não podemos recuperar seu ID e Chave da Carteira, então se você os perder terá que iniciar todo o processo novamente.
3. Volte ao login da [Sandbox do Traction] e desta vez, use seu ID/Chave da Carteira para fazer login no seu novo agente Inquilino Traction. Talvez você queira adicionar o site aos favoritos.
4. Torne seu novo Inquilino Traction um emissor de credenciais verificáveis:
    1. Clicando no menu "User" (ícone de pasta) (no canto superior direito) e escolhendo "Profile".
    2. Clicando em “BCovrin Test” em `Action` na seção Endorser.
        1. Quando terminar, você terá seu próprio DID público (exibido na página) que foi publicado no [BCovrin Test Ledger]. Seu DID será usado para publicar outras transações AnonCreds para que você possa emitir credenciais verificáveis.
5. Conecte seu Inquilino Traction à sua aplicação de Carteira Móvel:
    1. Selecionando no menu à esquerda "Connections" e depois "Invitations".
    2. Clique no botão "Single Use Connection", dê um alias à conexão (talvez "My Wallet") e clique em "Submit".
    3. Escaneie o código QR resultante com sua Carteira Móvel inicializada e siga as instruções. Uma vez conectado, digite uma mensagem rápida "Hi!" para o Agente Traction e você deverá receber uma mensagem automática de volta.
    4. Verifique o item do menu do Inquilino Traction "Connections→Connections" para ver o status da sua conexão – deve estar `active`.
    5. Se algo não funcionar na sequência, aqui estão algumas coisas para tentar:
       1. Se a conexão do Inquilino Traction não estiver `active`, é possível que sua carteira não tenha conseguido enviar mensagem de volta ao seu Inquilino Traction. Verifique a conexão de internet da sua carteira.
       2. Criamos um [FAQ e Perguntas sobre a Oficina da Sandbox do Traction] no GitHub que você pode verificar para ver se sua pergunta já foi respondida, e se não, você pode adicionar sua pergunta como um comentário no problema e retornaremos a você.

Isso é tudo – você deve estar pronto para começar a emitir e receber credenciais verificáveis.

## Lab 2: Preparação para Ser um Emissor

::: todo
To Do: Atualizar o laboratório para usar este schema: H7W22uhD4ueQdGaGeiCgaM:2:student id:1.0.0
:::

Neste laboratório, usaremos nosso agente Inquilino Traction para criar e publicar um objeto de Esquema AnonCreds (ou dois) e, em seguida, usar esse Esquema para criar e publicar uma Definição de Credencial. Todos os objetos AnonCreds serão publicados na rede de teste BCovrin (pronuncia-se “Be Sovereign”). Para aqueles novos no AnonCreds:

- Um *Esquema* define a lista de atributos (`claims`) em uma credencial. Um emissor geralmente publica seu próprio esquema, mas também pode usar um publicado por outra pessoa. Por exemplo, um grupo de universidades pode usar o esquema publicado pela "Associação de Universidades e Faculdades" à qual pertencem.
- Uma *Definição de Credencial* (`CredDef`) é publicada pelo emissor, vinculando o DID do Emissor ao esquema sobre o qual as credenciais serão emitidas, e contendo o material da chave pública necessário para verificar apresentações da credencial. Registros de Revogação também são vinculados à Definição de Credencial, permitindo que um emissor revogue credenciais quando necessário.

### Lab 2: Passos a Seguir

1. Faça login na sua [Sandbox do Traction]. Você registrou seu ID e Chave da Carteira, certo?
    1. Se não — volte ao [Lab 1](#lab-1-obtenção-de-um-agente-inquilino-traction-e-carteira-móvel) para criar um novo Inquilino Traction e uma conexão com sua Carteira Móvel.
2. Crie um Esquema:
    1. Clique no item de menu “Configuration” e depois em “Schema Storage”.
    2. Clique em “Add Schema From Ledger” e preencha o `Schema Id` com o valor `H7W22uhD4ueQdGaGeiCgaM:2:student id:1.0.0`.
        1. Ao fazer isso, você (como emissor) estará usando um esquema previamente publicado. [Clique aqui](http://test.bcovrin.vonx.io/browse/domain?page=1&query=H7W22uhD4ueQdGaGeiCgaM%3A2%3Astudent%20id%3A1.0.0) para ver o esquema no ledger.
    3. Clique em “Submit”.
3. Crie e Publique uma Definição de Credencial:
    1. Clique no item de menu “Configuration” e depois em “Credentials”.
    2. Clique em “Add Credential” e preencha o formulário para `Create Credential Definition`:
        1. Selecione o Esquema publicado “student id”.
        2. Selecione um nome de `Tag` - isso é como você identificará a Definição de Credencial quando houver várias para o mesmo Esquema.
        3. **Certifique-se de selecionar `Revocable` se desejar ser capaz de revogar credenciais que emitirá usando esta Definição de Credencial.**
    3. Clique em “Submit”.

Ao clicar em “Submit”, você verá um pop-up de progresso que mostra o progresso da transação à medida que ela é enviada para a rede de teste BCovrin. Uma vez concluído, o pop-up mostrará que a Definição de Credencial foi criada. Isso pode levar de alguns segundos a alguns minutos, dependendo da carga do ledger.

Pronto! Você publicou uma Definição de Credencial e está pronto para emitir credenciais usando-a.

### Próximos Passos

Continue para o [Lab 3: Emissão de Credenciais para uma Carteira Móvel](#lab-3-emissão-de-credenciais-para-uma-carteira-móvel) para começar a emitir credenciais.

## Lab 3: Emissão de Credenciais para uma Carteira Móvel

### Lab 3: Passos a Seguir

1. Faça login na sua [Sandbox do Traction].
2. Selecione o item de menu “Credential Management” e depois “Issue Credential”.
3. Clique no botão “Create Issue Credential”.
4. Preencha o formulário para “Create Issue Credential”:
    1. Selecione a conexão que você criou com sua Carteira Móvel no Lab 1.
    2. Selecione o `Credential Definition` que você criou no Lab 2.
    3. Preencha os atributos da credencial com os valores desejados.
5. Clique em “Submit”.

Ao clicar em “Submit”, uma proposta de credencial será enviada para a sua Carteira Móvel. Abra sua Carteira Móvel e você deverá ver uma notificação sobre a nova credencial. Aceite a credencial na sua Carteira Móvel.

### Próximos Passos

Continue para o [Lab 4: Solicitação e Envio de Apresentações](#lab-4-solicitação-e-envio-de-apresentações) para aprender a solicitar e enviar apresentações de credenciais verificáveis.

## Lab 4: Solicitação e Envio de Apresentações

### Lab 4: Passos a Seguir

1. Faça login na sua [Sandbox do Traction].
2. Selecione o item de menu “Presentation Management” e depois “Request Presentation”.
3. Clique no botão “Create Presentation Request”.
4. Preencha o formulário para “Create Presentation Request”:
    1. Selecione a conexão que você criou com sua Carteira Móvel no Lab 1.
    2. Adicione os atributos e predicados que deseja solicitar na apresentação.
5. Clique em “Submit”.

Ao clicar em “Submit”, uma solicitação de apresentação será enviada para a sua Carteira Móvel. Abra sua Carteira Móvel e você deverá ver uma notificação sobre a nova solicitação de apresentação. Envie a apresentação solicitada a partir da sua Carteira Móvel.

### Próximos Passos

Parabéns! Você completou os quatro laboratórios e aprendeu a emitir, receber, solicitar e enviar credenciais verificáveis usando o Hyperledger Aries e AnonCreds.

## Próximos Passos

Explore mais sobre Hyperledger Aries e AnonCreds, e experimente o Traction/ACA-Py para desenvolver suas próprias aplicações e casos de uso.
