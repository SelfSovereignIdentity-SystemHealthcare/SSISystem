# Serviços de Endossador

Os serviços de endossador são construídos usando [FastAPI](https://fastapi.tiangolo.com/).

Para instalar as dependências locais:

```shell
pip install -r requirements.txt
gunicorn -k uvicorn.workers.UvicornWorker -b localhost:5000  api.main:app
```

Para executar a verificação de estilo e os testes localmente (esses são executados automaticamente para cada PR):

```sh
pip install tox
tox -e lint
tox -e test
```