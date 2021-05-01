
// Mocking axios while running test so that real axios is not used

module.exports = {
    get: jest.fn(() => Promise.resolve({data: {startTime: "2021-04-29T15:52:47.401Z", endTime: "2021-04-29T16:04:11.656Z", surveyId: 2}}))
}