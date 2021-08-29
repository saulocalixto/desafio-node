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
* Serviços
* Validações
* Modelos

#### Data
Camada responsável por se conectar ao *"banco de dados"*. Nela temos os repositórios que abstraem toda a complexidade de conexão ao banco. Além disso, há uma classe de contexto, responsável por tratar o estado da aplicação.
Em um cenário em que seja necessário mudar o banco de dados, a única camada a ser impactada seria essa.

Além disso foi criado testes de unidade para validar os serviços e as validações de negócio.
Foram criados também testes de integração para validar a aplicação como um todo.
### Frameworks utilizados
Foram usados poucos frameworks para a construção da aplicação, os quais listo abaixo:
* **Newtonsoft.Json**
	* Framework amplamente utilizado para serialização e desserialização de json.
* **XUnit**
	* Framework utilizado para criação tanto dos testes de unidade, quanto dos testes de integração.
* **Moq**
	* A fim de garantir uma melhor isolamento dos testes de unidade, foi utilizado o Moq para mockar o repositório quando o foco era testar as regras de negócio.
### Passos para construção
Como dito anteriormente, recomendo que seja utilizado a imagem docker contida no zip para poder executar a aplicação, podemos seguir com os seguintes passos:
##### Construção da imagem
    docker-compose up -d --build
  Para facilitação do compartilhamento de arquivos entre o host e o container, estamos fazendo *bind* da pasta *files* contida no zip, para que todos os arquivos adicionados nela estejam disponíves no container também na pasta *./files*.
Resumidamente, todos os arquivos que estiverem na pasta *./files* do host, também estarão na pasta *./files* do container.
##### Entrar no container

    docker exec -it authorizer bash
Esse comando irá entrar no modo iterativo no container, onde poderemos de fato executar os comandos para na aplicação.
##### Executando a aplicação

    cat ./files/operations | dotnet Authorizer.View.dll
Muito bem, aqui a aplicação é para ter sido executada com sucesso.
O comando cat vai ler cada linha do arquivo *operations* que está dentro da pasta *files*.
O pipe | indica que cada linha será inserida ao stdin da aplicação, que está sendo executada com o comando: *dotnet Authorizer.View.dll*.
Sempre que for preciso alterar o arquivo, ele pode ser feito no próprio host em que o container está sendo executado, é preciso apenas alterar o arquivo *./files/operations* do host.
