import { createServer, Model } from "miragejs";

export function makeServer({ environment }) {
  let sectors = [
    {
      id: "1",
      sector: "Internal",
    },
    {
      id: "2",
      sector: "External",
    },
    {
      id: "3",
      sector: "Semi",
    },
    {
      id: "4",
      sector: "Full",
    },
  ];
  let users = [
    {
      id: "1",
      name: "AbdullahShah Jane",
      sectorsName: ["internal"],
      agree: true,
    },
    {
      id: "2",
      name: "Ali Jane",
      sectorsName: ["external"],
      agree: false,
    },
    {
      id: "3",
      name: "Uzair Jane",
      sectorsName: ["semi"],
      agree: false,
    },
  ];

  return createServer({
    environment,
    models: {
      users: Model,
      sectors: Model,
    },
    routes() {
      this.namespace = "/";
      this.logging = true;
      this.get("/api/users", () => {
        return users;
      });
      this.get("/api/sectors", () => {
        return sectors;
      });
      this.post("/api/users", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs.id = Math.floor(Math.random() * 100);
        users.push(attrs);

        return { user: attrs };
      });
      this.delete("/api/users/:id", (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;

        let user = schema.users.find(id);

        if (user) {
          user.destroy();
          return new Response(204); // Return a success response with status code 204 (No Content)
        } else {
          return new Response(404, {}, { error: "User not found" }); // Return a 404 response if user is not found
        }
      });
      // this.patch("/api/users/:id", (schema, request) => {
      //   let newAttrs = JSON.parse(request.requestBody);
      //   console.log("new attrs", newAttrs);
      //   let id = request.params.id;
      //   console.log("id is", id);
      //   let user = users.find(id);
      //   console.log("user find", user);

      //   return user.update(newAttrs);
      // });
      this.patch("/api/users/:id", (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;

        let user = schema.users.find(id);

        if (user) {
          user.update(newAttrs);
          return new Response(204); // Return a success response with status code 204 (No Content)
        } else {
          return new Response(404, {}, { error: "User not found" }); // Return a 404 response if user is not found
        }
      });

      this.passthrough();
    },
  });
}
