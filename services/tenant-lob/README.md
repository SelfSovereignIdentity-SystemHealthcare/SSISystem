# Tenant LOB

Este é um servidor simples destinado a representar um Tenant LOB.
Nesta demonstração, ilustraremos como adicionar webhooks ao seu locatário para que o Aca-Py possa notificá-lo conforme os eventos ocorram.

Cabem às necessidades do seu negócio interpretar os tópicos de notificação, eventos e payloads para determinar o que seu aplicativo precisa fazer (se algo).

Existem alguns endpoints de tarefas simples para ajudar a inicializar o sistema.

- criar um conjunto de 3 locatários prontos para receber dados de webhook: alice, faber, acme
- conectar rapidamente alice com faber e alice com acme
- visualizar dados de eventos de webhook (por locatário)
- registrar um DID público para um locatário

A maioria dos aplicativos de negócios não terá vários locatários, então nosso único endpoint de webhook para vários locatários é artificial. No entanto, ele ilustra o uso de Chave de API por locatário e como provar que os dados de webhook estão relacionados ao seu locatário (via cabeçalho `x-wallet-id`).

Os endpoints nesta demonstração usam `GET` para criações em vez de `POST` para simplificar os procedimentos. Isso permitirá que você abra um navegador e execute as etapas da demonstração.

Todos os dados nesta demonstração são completamente efêmeros, existem apenas na memória.

## Fluxo de Demonstração Simples

Pressupõe-se que isso está sendo executado em um ambiente local configurado de acordo com a documentação de [scripts](../../scripts) com configuração padrão.

1. Criar conjunto de locatários de demonstração
    1. Abrir navegador em [http://localhost:9876/tasks/create-alice-faber-acme](http://localhost:9876/tasks/create-alice-faber-acme)
    2. os locatários alice, faber e acme são criados
    3. cada um atualizou sua configuração de locatário para incluir a URL do webhook com uma chave de API exclusiva: `http://host.docker.internal:9876/webhook#<uma chave de API>`
    4. Observação: no terminal do docker, os `wallet_id`, `wallet_key` e tokens de cada locatário são impressos. Você pode usá-los para fazer login em [tenant-ui](http://localhost:5101)
2. Conectar locatários de demonstração
    1. Abrir navegador em [http://localhost:9876/tasks/connect-alice-faber-acme](http://localhost:9876/tasks/connect-alice-faber-acme)
    2. alice e faber são conectados, alice e acme são conectados
    3. como todos os locatários registraram webhooks, eles receberão notificações à medida que seus locatários aceitam conexões automaticamente
    4. Abrir navegador em [http://localhost:9876/tenants/alice/webhook-data](http://localhost:9876/tenants/alice/webhook-data) para visualizar os dados do webhook de alice.
    5. Abrir navegador em [http://localhost:9876/tenants/faber/webhook-data](http://localhost:9876/tenants/faber/webhook-data) para visualizar os dados do webhook de faber.
    6. Abrir navegador em [http://localhost:9876/tenants/acme/webhook-data](http://localhost:9876/tenants/acme/webhook-data) para visualizar os dados do webhook de acme.
    7. Observação de que os tópicos são `connections` (e possivelmente `ping`).
    8. Observação de que cada locatário tem um conjunto único de dados que pertencem especificamente a eles - estes são dados privados compartilhados através de seu webhook protegido com sua chave de API.
3. Obter um DID Público para faber
    1. Abrir navegador em [http://localhost:9876/tenants/faber/public-did](http://localhost:9876/tenants/faber/public-did)
    2. Isso levará algum tempo, mas faber será conectado a um endossador e criará um DID público e escreverá isso no ledger
    3. Você verá que faber tem um novo atributo: `public_did`.
    4. Abrir navegador em [http://localhost:9876/tenants/faber/webhook-data](http://localhost:9876/tenants/faber/webhook-data) para visualizar os dados do webhook de faber.
    5. Observação de que há um novo tópico: `endorse_transaction`. Isso é faber pedindo ao endossador para fazer o trabalho (escrever DID público no ledger) em seu nome.

Ao criar seus próprios locatários no [tenant-ui](http://localhost:5101), você pode atualizar a URL do webhook para `http://host.docker.internal:9876/webhook` e não adicionar uma chave de API. Você pode ver as notificações para seu webhook no console do docker `tenant-lob`.

### Construir imagem Docker

```shell
docker build -f Dockerfile -t tenant-lob .
