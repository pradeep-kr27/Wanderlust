const baseUrl = "http://localhost:4000";
const request = require("request");

describe("TestCase 3: Fetch Booking details", () => {
    it("TestCase 3.1: Successfull fetching of booking details", (done) => {
        request.get(baseUrl + "/book/getDetails/:userId", (error, response, body) => {
            expect(body).toBeTruthy();
            done();
        });
    })

    it("TestCase 3.2: Failed to fetch data", (done) => {
        request.get(baseUrl + "/:userIdIdId", (error, response, body) => {
            expect(error).toBe(null);
            done();
        });
    })

    it("TestCase 3.3: Failed to fetch data", (done) => {
        request.get(baseUrl + "/book/getDetails/:userId", (error, response, body) => {
            expect(error).toBeFalsy()
            done();
        });
    })
})