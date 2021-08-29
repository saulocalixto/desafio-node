# nubank-authorizer

Como não havia restrição de linguagem, o desafio foi feito em .Net 5.0, utlizando C#.
Para rodar a aplicação é recomendável fazê-lo através de container Docker, pois evitaria ter que instalar as SDKs do .Net no computador. Contudo a aplicação é capaz de rodar em todos os ambientes operacionais mais conhecidos: Linux, MacOs e Windows.

### Decisões Arquiteturais

Não foi necessário criar uma arquitetura muito elaborada para o problema proposto. Contudo, afim de separar bem as responsabilidades, o software foi desenhado em camadas com responsabilidades bem definidas:

#### View

Camada responsável por capturar os comandos inseridos pelo usuário no formato json, tratar e enviar para a camada de negócio para fazer o tratamento necessário.

#### Business

Camada responsável por trabalhar com a lógica de negócio. Nela é feita todas as validações necessárias para aprovar ou não uma operação.
Nela temos:

- Serviços
- Validações
- Modelos

#### Data

Camada responsável por se conectar ao _"banco de dados"_. Nela temos os repositórios que abstraem toda a complexidade de conexão ao banco. Além disso, há uma classe de contexto, responsável por tratar o estado da aplicação.
Em um cenário em que seja necessário mudar o banco de dados, a única camada a ser impactada seria essa.

#### Cross-Cutting

Essa camada possui implementações que podem ser úteis para mais de uma camada e por não ser específico de nenuma delas, preferi deixá-las em uma camada que pudesse ser acessado por todos. Em uma eventual evolução da aplicação, essa camada poderia virar um pacote que poderia ser referenciado em diversos serviços diferentes.
Aqui temos:

- Validador abstrato
- Regra para serialização e desserialização do json
- Globalização de mensagens usadas pela aplicação

Além disso foi criado testes de unidade para validar os serviços e as validações de negócio.
Foram criados também testes de integração para validar a aplicação como um todo.

### Frameworks utilizados

Foram usados poucos frameworks para a construção da aplicação, os quais listo abaixo:

- **Newtonsoft.Json**
  - Framework amplamente utilizado para serialização e desserialização de json.
- **XUnit**
  - Framework utilizado para criação tanto dos testes de unidade, quanto dos testes de integração.
- **Moq**
  - A fim de garantir uma melhor isolamento dos testes de unidade, foi utilizado o Moq para mockar o repositório quando o foco era testar as regras de negócio.

### Passos para construção

Como dito anteriormente, recomendo que seja utilizado a imagem docker contida no zip para poder executar a aplicação, podemos seguir com os seguintes passos:

##### Construção da imagem

    docker-compose up -d --build

Para facilitar o compartilhamento de arquivos entre o host e o container, está sendo feito o _bind_ da pasta _files_ contida no zip, para que todos os arquivos adicionados nela estejam disponíves no container também na pasta _./files_.
Resumidamente, todos os arquivos que estiverem na pasta _./files_ do host, também estarão na pasta _./files_ do container.

##### Executar a aplicação

    docker exec -it authorizer bash -c "cat ./files/operations | dotnet Authorizer.View.dll"

Muito bem, aqui a aplicação é para ter sido executada com sucesso.
O comando cat vai ler cada linha do arquivo _operations_ que está dentro da pasta _files_.
O pipe "|" indica que cada linha será inserida ao stdin da aplicação, que está sendo executada com o comando: _dotnet Authorizer.View.dll_.
Sempre que for preciso alterar o arquivo, ele pode ser feito no próprio host em que o container está sendo executado, é preciso apenas alterar o arquivo _./files/operations_ do host.

### Rodando a aplicação sem o docker

Caso não queria utilizar o docker para executar a aplicação, será necessário instalar:

- SDK dotnet 5.0

No Ubuntu para prosseguir com a instalação basta executar os comandos abaixo:

    sudo apt-get update && sudo apt-get install -y apt-transport-https && sudo apt-get update && sudo apt-get install -y dotnet-sdk-5.0

Para outras versões do Linux, ou até mesmo outro SO, o SDK pode ser baixado também no próprio site da microsoft: [baixar aqui](https://dotnet.microsoft.com/download).

Agora com o SDK instalado para rodar a aplicação é preciso primeiro entrar no diretório que contém o projeto de inicialização:

    cd Authorizer.View/

E depois executar o comando para rodar a aplicação.

    cat operations | dotnet run

Presumindo-se que o arquivo operations esteja no diretório corrente.

Com o SDK instalado é possível também rodar os testes.
Estando no diretório principal basta rodar o comando:

    dotnet test -v n
