const {getSurveys, getAverages} = require("../app.js");
const mockAxios = require("axios");

it("Tests if the correct amount of surveys have been returned from the function", async () => {
    const count = 5;

    const surveys = await getSurveys(count)
    expect(surveys.length).toBe(count);
});

it("Tests if the returned survey results contain the expected properties.", async () => {
    const results = await getAverages();
    results.forEach(result => {
        expect(result.averageTime).toBeDefined();
        expect(result.timesTaken).toBeDefined();
        expect(result.surveyId).toBeDefined();
    })
});