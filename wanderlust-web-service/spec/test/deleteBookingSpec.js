const request = require("request");
const baseUrl = "http://localhost:4000";


describe("TestCase Set 4: Fetch Booking details", () => {
    it("TestCase 4.1: Successfull fetching of booking details", (done) => {
        request.get(baseUrl + "/book/getDetails/:userId", (error, response, body) => {
            expect(body).toBeTruthy();
            done();
        });
    })

    it("TestCase 4.2: Failed to fetch data", (done) => {
        request.get(baseUrl + "/book/getDetails/:userIdIdId", (error, response, body) => {
            expect(error).toBe(null);
            done();
        });
    })

    it("TestCase 4.3: Failed to fetch data", (done) => {
        request.get(baseUrl + "/book/getDetails/:userId", (error, response, body) => {
            expect(error).toBeFalsy()
            done();
        });
    })
})