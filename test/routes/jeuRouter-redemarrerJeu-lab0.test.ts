// Vous devez insérer les nouveaux tests ici
import 'jest-extended';
import request from "supertest";
import app from "../../src/app";

const testNom1 = 'Jean-Marc-in-getJoueurs';
const testNom2 = 'Pierre-in-getJoueurs';

describe("GET /api/v1/jeu/redemarrerJeu", () => {
  beforeAll(async () => {
    await request(app).post("/api/v1/jeu/joueurs").send({ nom: testNom1 });
    await request(app).post("/api/v1/jeu/joueurs").send({ nom: testNom2 });
  });

  it("devrait redémarrer le jeu avec succès (status 200, réponse JSON)", async () => {
    const res = await request(app).get('/api/v1/jeu/redemarrerJeu');

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("devrait vider la liste des joueurs après redémarrage", async () => {
    const res = await request(app).get('/api/v1/jeu/joueurs');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("devrait aussi réussir même si aucun joueur n'existe déjà", async () => {
    // Aucun joueur n’a été recréé depuis le dernier test
    const res = await request(app).get('/api/v1/jeu/redemarrerJeu');

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);

    // Vérifier qu'il n'y a toujours pas de joueurs
    const joueursRes = await request(app).get('/api/v1/jeu/joueurs');
    expect(joueursRes.status).toBe(200);
    expect(joueursRes.body).toEqual([]);
  });

  it("devrait contenir un test pour jouer qui retourne 404 (après redemarrerJeu)", async () => {
    await request(app).get('/api/v1/jeu/redemarrerJeu');

    const res = await request(app)
      .post('/api/v1/jeu/jouer/')   
      .send({ nom: testNom1 });

    expect(res.status).toBe(404);
  });
});

