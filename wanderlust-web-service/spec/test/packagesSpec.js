const request = require("request");
const packageUrl = "http://localhost:4000/packages";


describe("TestCase 2: Get Hotdeals", () => {
    it("TestCase 2.1: Valid Hotdeals Response ", (done) => {
        request.get(packageUrl + "/hotdeals", (error, response, body) => {
            
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            done();
        });
    });
});

describe("TestCase 2: Get Searched Destination", () => {
    it("TestCase 2.2: Valid City Response", (done) => {
        request.get(packageUrl + "/Paris", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            console.log(response.statusCode)
            console.log("Valid City")
            expect(body).toBeTruthy();
            done();
        });
    });
    it("TestCase 2.3: Valid Continent Response", (done) => {
        request.get(packageUrl + "/ASIA", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            console.log(response.statusCode)
            console.log("Valid Continent")
            expect(body).toBeTruthy();
            done();
        });
    });
    // it("TestCase 2.3: Invalid Continent Response", (done) => {
    //     request.get(packageUrl + "/ASA", (error, response, body) => {
    //         expect(response.statusCode).toBe(404);
    //         console.log(body)
    //         console.log(response.statusCode)
    //         console.log("Invalid Continent")
    //         expect(body).toBeTruthy();
    //         done();
    //     }).catch((error) =>{ 
    //         expect(error).toBeDefined();
    //         done();
    //         console.log("login failed")
    //     })
    // });
})
