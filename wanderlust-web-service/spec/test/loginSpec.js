const request = require("request");
const baseUrl = "http://localhost:4000/user";

describe("TestCase  1: User db Setup", () => {
    it("TestCase 1: Returns Insertion error", (done) => {
        request.get(baseUrl + "/setup", (error, response, body) => {
            expect(error).toBe(null);
            done();
        });
    });
    it("TestCase 1.2: Inserted Successfully", (done) => {
        request.get(baseUrl + "/setup", (error, response, body) => {
            expect(body).toBe("Insertion Successfull");
            done();
        });
    });
    it("TestCase 1.3: login error statuscode", (done) => {
        request.get(baseUrl + "/login", (error, response, body) => {
            expect(error).toBe(null);
            done();
        });
    });
});

// describe("TestCase 1: Login", () => {
//     //valid login
//     it("TestCase 1.1: Valid Login", (done) => {
//         request.post(loginUrl, (error, response, body) => {
//             userService.login( 9098765432,'Ac@1234').then((data) => {
//                 expect(data).toBeDefined();
//                 done();
//                 console.log("login successful")
//             }).catch((error) =>{ 
//                 expect(error).toBeDefined();
//                 done();
//                 console.log("login failed")
//             })
//         })
//     })
//     //invalid login
//     it("TestCase 1.2: Invalid Login", (done) => {
//         request.post(loginUrl, (error, response, body) => {
//             userService.login( 9098765432,'Ac@1234').then((data) => {
//                 expect(data).toBeDefined();
//                 done();
//                 console.log("login successful")
//             }).catch((error) =>{ 
//                 expect(error).toBeDefined();
//                 done();
//                 console.log("login failed")
//             })
//         })
//     })

// })
