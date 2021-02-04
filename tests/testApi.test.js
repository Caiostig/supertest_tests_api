const request = require('supertest');
const baseURL = "http://localhost:3000";

describe("GET /public", () => {
  it('deve retornar 200 acessar a rota publica', () => {
    return request(baseURL)  
    .get('/public')
    .set('Accept', 'application/json')
    .expect(200)
    .then(response => {
      expect(response.body.message).toEqual("Acesso livre a informações públicas")
    });
  });

  it('Tentar acessar a raíz sem enviar token', () => {
    return request(baseURL)  
    .get('/')
    .set('Accept', 'application/json')
    .expect(401)
    .then(response => {
      expect(response.body.error).toEqual("Token não enviado")
    });
});


describe("POST users/create", () => {
  let data = {
      "email": "Usertest",
      "password": ""
  }
  it('Tentar criar um usuário sem enviar senha', () => {
    return request(baseURL)
    .post('/users/create')
    .send(data)
    .set('Accept', 'application/json')
    .expect(422)
    .then(response => {
      expect(response.body.error).toEqual("Faltam informações para processar")
  });
});


describe("DELETE users/delete", () => {

  it('Deletar um novo usuário criado', () => {
    let data1 = {
      "email": "usuariodeletetest@teste.com",
      "password": "1234"
  }
    return request(baseURL)
    .post('/users/create')
    .send(data1)
    .set('Accept', 'application/json')
    .expect(201)
    .then(response => {
      expect(response.body.user.email).toEqual(data1.email)

      let data2 = {
        "email": response.body.user.email,
        "_id": response.body.user._id
    }
      request(baseURL)
      .delete('/users/delete')
      .send(data2)
      .set('Accept', 'application/json')
      .set('auth', response.body.token)
      .expect(200)
      .then(response => {
        expect(response.body.message).toEqual('Usuário excluído com sucesso')
        });
      });
    });
  });
});


it('Acessar todos usuários sem passar token', () => {
  let data2 = {
    "email": "usuario5@teste.com",
    "password": "1234"
}
  return request(baseURL)
  .get('/users')
  .set('Authorization', 'Bearer invalid')
  .send(data2)
  .expect(401)
  .then(response => {
    expect(response.body.error).toEqual("Token não enviado")
    });
  });
});