
describe("template spec", () => {
  it("should get all users", () => {
    cy.request("GET", "http://localhost:3030/api/users/users").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });
  it("should get user by id", () => {
    cy.request("GET", "http://localhost:3030/api/users/users/user").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });
});
